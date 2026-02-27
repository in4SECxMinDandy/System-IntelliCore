const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', categoryController.list);
router.get('/:slug', categoryController.getBySlug);
router.post('/', authenticate, authorize('admin', 'superadmin'), categoryController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), categoryController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), categoryController.remove);

module.exports = router;
