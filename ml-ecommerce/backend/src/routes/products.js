const router = require('express').Router();
const productController = require('../controllers/productController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, productController.list);
router.get('/featured', productController.featured);
router.get('/search', optionalAuth, productController.search);
router.get('/:slug', optionalAuth, productController.getBySlug);

// Admin routes
router.post('/', authenticate, authorize('admin', 'superadmin'), productController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), productController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), productController.remove);

module.exports = router;
