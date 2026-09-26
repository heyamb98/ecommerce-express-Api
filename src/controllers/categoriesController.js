const pool = require('../config/database');

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories };