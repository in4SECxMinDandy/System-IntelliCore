// ==========================================
// Two-Factor Authentication Controller
// ==========================================

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { prisma } = require('../config/database');

/**
 * Generate 2FA secret and QR code for setup
 */
exports.setup2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled for this account',
      });
    }

    const secret = speakeasy.generateSecret({
      name: `IntelliCore (${user.email})`,
      issuer: 'IntelliCore Shop',
      length: 32,
    });

    // Store secret temporarily (not yet enabled)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify and enable 2FA
 */
exports.enable2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please set up 2FA first',
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    res.json({
      success: true,
      message: '2FA has been enabled successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { token, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled' });
    }

    // Verify current token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    res.json({
      success: true,
      message: '2FA has been disabled',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify 2FA token during login
 */
exports.verify2FA = async (req, res, next) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ success: false, message: 'userId and token are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ success: false, message: 'Invalid 2FA token' });
    }

    // Generate full tokens after 2FA verification
    const jwt = require('jsonwebtoken');
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get 2FA status
 */
exports.get2FAStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { twoFactorEnabled: true },
    });

    res.json({
      success: true,
      data: { enabled: user.twoFactorEnabled },
    });
  } catch (err) {
    next(err);
  }
};
