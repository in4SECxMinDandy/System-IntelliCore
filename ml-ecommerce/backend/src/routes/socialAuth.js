// ==========================================
// Social Auth Routes — IntelliCore Ecommerce
// ==========================================

const express = require('express');
const router = express.Router();
const socialAuthController = require('../controllers/socialAuthController');
const { authenticate } = require('../middleware/auth');

// OAuth callbacks (redirect from Google/Facebook)
router.get('/google', socialAuthController.googleCallback);
router.get('/facebook', socialAuthController.facebookCallback);

// Get OAuth URLs for frontend
router.get('/urls', socialAuthController.getOAuthUrls);

// Link/unlink social accounts (authenticated users)
router.post('/link', authenticate, socialAuthController.linkAccount);
router.post('/unlink', authenticate, socialAuthController.unlinkAccount);

module.exports = router;
