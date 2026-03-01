const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

router.get('/product/:productId', optionalAuth, reviewController.listByProduct);
router.get('/user', authenticate, reviewController.listByUser);
router.post('/', authenticate, reviewController.create);
router.put('/:id', authenticate, reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);
router.patch('/:id/approve', authenticate, authorize('admin', 'superadmin'), reviewController.approve);

module.exports = router;
