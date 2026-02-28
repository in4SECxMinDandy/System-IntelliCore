// ==========================================
// PayPal Routes — IntelliCore Ecommerce
// ==========================================

const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication (except webhook)
router.post('/create-order', authenticate, paypalController.createOrder);
router.post('/capture-order/:orderId', authenticate, paypalController.captureOrder);
router.get('/order/:orderId', authenticate, paypalController.getOrderDetails);
router.post('/refund', authenticate, paypalController.createRefund);

// Webhook - no authentication (PayPal calls this)
router.post('/webhook', express.raw({ type: 'application/json' }), paypalController.webhook);

module.exports = router;
