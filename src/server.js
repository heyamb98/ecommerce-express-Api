const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const usersRoutes = require('./routes/usersRoutes');

const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS Policy
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting العام
app.use(apiLimiter);

// 4. Body Parser
app.use(express.json());

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);

// 6. Handle 404 & Global Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});