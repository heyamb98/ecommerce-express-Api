const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register User (تسجيل مستخدم جديد)
const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // التأكد من عدم تكرار البريد الإلكتروني (Parameterized Query)
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    // تشفير كلمة المرور بـ bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // تحديد الدور (الافتراضي customer)
    const userRole = role === 'admin' ? 'admin' : 'customer';

    // حفظ المستخدم في قاعدة البيانات
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, userRole]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser.rows[0] // لا يتم إرجاع password_hash هنا!
    });
  } catch (error) {
    next(error);
  }
};

// 2. Login User (تسجيل الدخول)
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // البحث عن المستخدم
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // مقارنة كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // إنشاء JWT Token
    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_jwt_key_2026_secure', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Current User /api/auth/me (مسار محمي)
const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };