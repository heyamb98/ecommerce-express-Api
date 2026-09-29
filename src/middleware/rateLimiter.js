const rateLimit = require('express-rate-limit');

// Rate limiter عام للـ API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Rate limiter صارم لعملية تسجيل الدخول
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 محاولات فقط
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

module.exports = { apiLimiter, loginLimiter };