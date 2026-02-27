const router = require('express').Router();
const couponController = require('../controllers/couponController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/validate', authenticate, couponController.validate);
router.get('/', authenticate, authorize('admin', 'superadmin'), couponController.list);
router.post('/', authenticate, authorize('admin', 'superadmin'), couponController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), couponController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), couponController.remove);

module.exports = router;
