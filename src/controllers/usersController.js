const pool = require('../config/database');

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, username, email, full_name, role, created_at FROM users');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers };