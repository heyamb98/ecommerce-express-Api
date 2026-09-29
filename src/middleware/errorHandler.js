// Middleware للتعامل مع الأخطاء غير المتوقعة وآمن للمستخدم
const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack); // طباعة الخطأ في الداخلي فقط دون إرساله للعميل

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

// Middleware للـ Endpoints غير الموجودة (404)
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };