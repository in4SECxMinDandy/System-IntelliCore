const router = require('express').Router();
const recommendationController = require('../controllers/recommendationController');
const { optionalAuth, authenticate } = require('../middleware/auth');

router.get('/for-you', optionalAuth, recommendationController.forYou);
router.get('/similar/:productId', optionalAuth, recommendationController.similar);
router.get('/trending', recommendationController.trending);
router.get('/frequently-bought/:productId', recommendationController.frequentlyBought);
router.post('/track', optionalAuth, recommendationController.trackEvent);
router.post('/log-click', authenticate, recommendationController.logClick);

module.exports = router;
