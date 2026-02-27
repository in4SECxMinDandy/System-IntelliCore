const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', orderController.list);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.patch('/:id/cancel', orderController.cancel);

// Admin
router.patch('/:id/status', authorize('admin', 'superadmin', 'staff'), orderController.updateStatus);
router.get('/admin/all', authorize('admin', 'superadmin', 'staff'), orderController.adminList);

module.exports = router;
