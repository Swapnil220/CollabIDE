export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Log to console for dev
    console.error(err.stack);
  
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };