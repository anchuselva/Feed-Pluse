export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    data: null,
    error: err.message || 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
