// ==========================================
// Global Error Handler Middleware (Phase 1.1 - Enhanced)
// Catches all unhandled errors, formats responses,
// logs with structured context
// ==========================================

const logger = require('../config/logger');

// Prisma error code → HTTP status map
const PRISMA_ERROR_MAP = {
  P2000: { status: 400, message: 'Input value is too long for this field' },
  P2001: { status: 404, message: 'Record not found' },
  P2002: { status: 409, message: 'A record with this value already exists' },
  P2003: { status: 400, message: 'Foreign key constraint failed' },
  P2004: { status: 400, message: 'Database constraint violation' },
  P2005: { status: 400, message: 'Invalid field value' },
  P2006: { status: 400, message: 'Invalid value provided' },
  P2014: { status: 400, message: 'Relation violation: required relation missing' },
  P2015: { status: 404, message: 'Related record not found' },
  P2025: { status: 404, message: 'Record not found or no matching record to update' },
};

const errorHandler = (err, req, res, _next) => {
  // --- Structured log context ---
  const logContext = {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    ip: req.ip,
    errorName: err.name,
    errorCode: err.code,
  };

  // ==========================================
  // Prisma Errors
  // ==========================================
  if (err.code && err.code.startsWith('P')) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    if (mapped) {
      logger.warn(`Prisma ${err.code}: ${err.message}`, logContext);
      return res.status(mapped.status).json({
        success: false,
        message: mapped.message,
        code: err.code,
      });
    }
    // Unknown Prisma error
    logger.error(`Unknown Prisma error ${err.code}: ${err.message}`, logContext);
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      code: err.code,
    });
  }

  // ==========================================
  // JWT Errors
  // ==========================================
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }
  if (err.name === 'NotBeforeError') {
    return res.status(401).json({ success: false, message: 'Token not yet valid' });
  }

  // ==========================================
  // Validation Errors
  // ==========================================
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // ==========================================
  // CORS errors
  // ==========================================
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Cross-origin request not allowed',
    });
  }

  // ==========================================
  // Custom errors with .status property
  // (used throughout controllers: throw Object.assign(new Error(...), { status: 4xx }))
  // ==========================================
  if (err.status && err.status >= 400 && err.status < 500) {
    logger.warn(`Client error ${err.status}: ${err.message}`, logContext);
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // ==========================================
  // Stripe Errors
  // ==========================================
  if (err.type?.startsWith('Stripe')) {
    logger.warn(`Stripe error: ${err.message}`, { ...logContext, stripeCode: err.code });
    const statusMap = {
      card_error: 402,
      invalid_request_error: 400,
      authentication_error: 401,
      rate_limit_error: 429,
    };
    return res.status(statusMap[err.type] || 400).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // ==========================================
  // Multer File Upload Errors
  // ==========================================
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File size too large' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Unexpected file field' });
  }

  // ==========================================
  // Generic Server Errors (500)
  // ==========================================
  logger.error(`Unhandled error: ${err.message}`, {
    ...logContext,
    stack: err.stack,
  });

  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    message: isProd ? 'Internal server error' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
