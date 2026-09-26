const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const productsRoutes = require('./routes/productsRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ecommerce API' });
});

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);

app.use(errorHandler);

module.exports = app;