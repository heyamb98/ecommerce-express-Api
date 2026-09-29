const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login (مع Rate Limiting)
router.post('/login', loginLimiter, login);

// GET /api/auth/me (محمي بواسطة JWT)
router.get('/me', authenticate, getMe);

module.exports = router;