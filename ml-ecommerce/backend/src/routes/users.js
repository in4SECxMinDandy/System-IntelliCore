const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);

// Admin
router.get('/', authorize('admin', 'superadmin'), userController.adminList);
router.patch('/:id/status', authorize('admin', 'superadmin'), userController.toggleStatus);

module.exports = router;
