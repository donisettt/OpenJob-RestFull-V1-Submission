const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  // PostgreSQL: invalid UUID format → treat as not found
  if (err.code === '22P02') {
    return res.status(404).json({
      status: 'failed',
      message: 'Resource not found',
    });
  }

  // PostgreSQL: unique constraint violation
  if (err.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Data already exists (unique constraint violation)',
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'failed',
      message: 'File size exceeds the allowed limit (5MB)',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      status: 'failed',
      message: 'Unexpected field name. Use "document" as the field name',
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid JSON payload',
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
