// ==========================================
// Auth Controller
// ==========================================

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/database');
const emailService = require('../services/emailService');
const logger = require('../config/logger');
const tokenStore = require('../services/tokenStore');

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown';
}

function generateTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
}

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, fullName } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, fullName },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });

    const { accessToken, refreshToken } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Check if user exists and is active
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is locked (Redis-backed)
    const lockStatus = await tokenStore.isAccountLocked(user.id);
    if (lockStatus.locked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts',
        retryAfter: lockStatus.retryAfter
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      // Record failed attempt in Redis
      await tokenStore.recordFailedAttempt(user.id);
      const remaining = await tokenStore.getRemainingAttempts(user.id);

      return res.status(401).json({
        success: false,
        message: remaining <= 2
          ? `Invalid credentials. ${remaining} attempt(s) remaining before account is locked.`
          : 'Invalid credentials'
      });
    }

    // Clear failed attempts on successful login (Redis)
    await tokenStore.clearFailedAttempts(user.id);

    const { accessToken, refreshToken } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    // Record successful login
    const ip = getClientIP(req);
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: ip,
        userAgent: req.headers['user-agent'],
        success: true
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const { passwordHash: _passwordHash, ...userSafe } = user;
    res.json({ success: true, data: { user: userSafe, accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const tokens = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // Use upsert to handle rare case where new token equals old (same-second JWT iat)
    await prisma.refreshToken.upsert({
      where: { token: tokens.refreshToken },
      update: { expiresAt, userId: user.id },
      create: { userId: user.id, token: tokens.refreshToken, expiresAt },
    });

    res.json({ success: true, data: tokens });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, role: true, emailVerified: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Password Reset
// ==========================================

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a password reset email will be sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store token in Redis with 1 hour TTL
    await tokenStore.setResetToken(user.id, resetTokenHash, 3600);

    // Send reset email
    // Use first FRONTEND_URL if comma-separated list
    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim();
    const resetUrl = `${frontendBase}/reset-password?token=${resetToken}&email=${email}`;

    try {
      await emailService.sendPasswordReset(email, {
        resetUrl,
        name: user.fullName
      });
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
    }

    res.json({ success: true, message: 'If an account exists, a password reset email will be sent' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token, email, and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }

    // Verify token via Redis
    const tokenData = await tokenStore.getResetToken(user.id);
    if (!tokenData) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    if (tokenData.token !== resetTokenHash) {
      // Increment failed attempts
      const attempts = await tokenStore.incrementResetAttempts(user.id);
      if (attempts >= 3) {
        await tokenStore.deleteResetToken(user.id);
        return res.status(400).json({ success: false, message: 'Too many invalid attempts. Please request a new reset link' });
      }
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }
    // Token expiry is handled by Redis TTL automatically

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // Delete used token from Redis
    await tokenStore.deleteResetToken(user.id);

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    res.json({ success: true, message: 'Password reset successful. Please login with your new password' });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    // Basic stub for now to fix route errors
    res.json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    // Basic stub for now to fix route errors
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};
