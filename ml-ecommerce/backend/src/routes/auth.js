const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('fullName').optional().trim().isLength({ max: 255 }),
  ],
  authController.register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

// Password reset routes
router.post('/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  authController.forgotPassword
);

router.post('/reset-password',
  authLimiter,
  [
    body('token').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('newPassword').isLength({ min: 8 }),
  ],
  authController.resetPassword
);

router.post('/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ],
  authController.changePassword
);

// Email verification routes
router.post('/send-verification',
  authenticate,
  authController.sendVerificationEmail
);

router.post('/verify-email',
  authLimiter,
  [
    body('token').notEmpty(),
  ],
  authController.verifyEmail
);

module.exports = router;
