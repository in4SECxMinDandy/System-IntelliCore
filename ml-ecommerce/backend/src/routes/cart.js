const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', cartController.get);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clear);

module.exports = router;
