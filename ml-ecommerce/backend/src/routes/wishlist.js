const router = require('express').Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', wishlistController.list);
router.post('/:productId', wishlistController.add);
router.delete('/:productId', wishlistController.remove);

module.exports = router;
