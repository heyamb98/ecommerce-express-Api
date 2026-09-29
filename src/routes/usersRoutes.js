const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validate');
const pool = require('../config/database');

// GET /api/users/:id (حماية IDOR: يقيم فقط بين ID المستخدم من التوكن وطلب الـ ID)
router.get('/:id', validateIdParam, authenticate, async (req, res, next) => {
  const targetUserId = parseInt(req.params.id);

  // منع الوصول إذا لم يكن أدمن ولم يكن صاحب الحساب نفسه
  if (req.user.role !== 'admin' && req.user.id !== targetUserId) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: You cannot access another user details.'
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [targetUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;