const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validateProduct, validateIdParam } = require('../middleware/validate');
const pool = require('../config/database');

// GET /api/products (متاح للجميع أو العملاء)
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id (مع التحقق من الـ ID)
router.get('/:id', validateIdParam, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/products (محمي للأدمن فقط مع Validation)
router.post('/', authenticate, authorize('admin'), validateProduct, async (req, res, next) => {
  const { name, description, price, stock, sku, category_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, sku, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock || 0, sku, category_id || 1]
    );
    res.status(201).json({ success: true, message: 'Product created', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;