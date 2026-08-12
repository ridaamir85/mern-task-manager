function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists.';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

module.exports = { errorHandler, notFound };
