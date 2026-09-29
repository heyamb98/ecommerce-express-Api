const { body, param, validationResult } = require('express-validator');

// دالة فحص نتائج التحقق
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// قواعد التحقق لإضافة/تحديث منتج
const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('sku').notEmpty().withMessage('SKU is required'),
  handleValidationErrors
];

// قواعد التحقق للـ ID المتمرر في المسار
const validateIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  handleValidationErrors
];

module.exports = { validateProduct, validateIdParam };