// ==========================================
// 2FA Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const twoFactorController = require('../controllers/twoFactorController');

// All routes require authentication
router.use(authenticate);

// GET /api/2fa/status
router.get('/status', twoFactorController.get2FAStatus);

// POST /api/2fa/setup — Generate secret & QR code
router.post('/setup', twoFactorController.setup2FA);

// POST /api/2fa/enable — Verify token and enable 2FA
router.post('/enable', twoFactorController.enable2FA);

// POST /api/2fa/disable — Disable 2FA
router.post('/disable', twoFactorController.disable2FA);

// POST /api/2fa/verify — Verify during login (no auth required)
router.post('/verify', twoFactorController.verify2FA);

module.exports = router;
