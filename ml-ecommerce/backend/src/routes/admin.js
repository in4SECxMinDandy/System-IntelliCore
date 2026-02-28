// ==========================================
// Admin Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin', 'superadmin'));

// Analytics
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/ml', adminController.getMLAnalytics);
router.get('/system/health', adminController.getSystemHealth);

// Users
router.get('/users', adminController.getUserAnalytics);
router.patch('/users/:userId', adminController.updateUser);

// Orders
router.get('/orders', adminController.getOrderAnalytics);

// Moderation
router.get('/reviews/queue', adminController.getReviewQueue);
router.patch('/community/posts/:postId/moderate', adminController.moderatePosts);
router.patch('/reviews/:reviewId/moderate', adminController.moderateReviews);

module.exports = router;
