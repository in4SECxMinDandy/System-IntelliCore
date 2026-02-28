// ==========================================
// Payment Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Stripe webhook (raw body required)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

// Authenticated routes
router.use(authenticate);

// POST /api/payments/create-intent
router.post('/create-intent', paymentController.createPaymentIntent);

// GET /api/payments/methods
router.get('/methods', paymentController.getPaymentMethods);

// Admin routes
router.get('/history', authorize('admin', 'superadmin'), paymentController.getPaymentHistory);
router.post('/refund', authorize('admin', 'superadmin'), paymentController.createRefund);

module.exports = router;
