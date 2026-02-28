// ==========================================
// Social Login Controller — IntelliCore Ecommerce
// Google & Facebook OAuth
// ==========================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../config/database');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

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

async function findOrCreateUser(provider, providerId, email, name, avatarUrl) {
  // Find existing user by provider
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { [`${provider}Id`]: providerId },
      ],
    },
  });

  if (existingUser) {
    // Update provider info if not set
    if (!existingUser[`${provider}Id`]) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { [`${provider}Id`]: providerId },
      });
    }
    return existingUser;
  }

  // Create new user
  const passwordHash = await bcrypt.hash(uuidv4(), 12);
  const user = await prisma.user.create({
    data: {
      email,
      fullName: name,
      avatarUrl,
      passwordHash,
      emailVerified: true,
      [`${provider}Id`]: providerId,
    },
  });

  return user;
}

/**
 * Google OAuth - Exchange code for tokens
 */
exports.googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      logger.error('Google token exchange error:', tokens);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_exchange_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`);
    }

    // Find or create user
    const user = await findOrCreateUser(
      'google',
      googleUser.id,
      googleUser.email,
      googleUser.name,
      googleUser.picture
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ 
      data: { userId: user.id, token: refreshToken, expiresAt } 
    });

    // Redirect to frontend with tokens
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (err) {
    logger.error('Google OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

/**
 * Facebook OAuth - Exchange code for tokens
 */
exports.facebookCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `client_secret=${FACEBOOK_APP_SECRET}&` +
      `redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&` +
      `code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    const tokens = await tokenResponse.json();

    if (tokens.error) {
      logger.error('Facebook token exchange error:', tokens);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_exchange_failed`);
    }

    // Get user info from Facebook
    const userUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`;
    const userResponse = await fetch(userUrl);
    const fbUser = await userResponse.json();

    if (!fbUser.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`);
    }

    // Get avatar URL
    const avatarUrl = fbUser.picture?.data?.url || null;

    // Find or create user
    const user = await findOrCreateUser(
      'facebook',
      fbUser.id,
      fbUser.email,
      fbUser.name,
      avatarUrl
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ 
      data: { userId: user.id, token: refreshToken, expiresAt } 
    });

    // Redirect to frontend with tokens
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (err) {
    logger.error('Facebook OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

/**
 * Get OAuth URLs (for frontend)
 */
exports.getOAuthUrls = async (req, res, next) => {
  try {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
      });

    const facebookAuthUrl = 'https://www.facebook.com/v18.0/dialog/oauth?' +
      new URLSearchParams({
        client_id: FACEBOOK_APP_ID,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        scope: 'email,public_profile',
        response_type: 'code',
      });

    res.json({
      success: true,
      data: {
        google: googleAuthUrl,
        facebook: facebookAuthUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Link social account to existing user
 */
exports.linkAccount = async (req, res, next) => {
  try {
    const { provider, code } = req.body;
    const userId = req.user.id;

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid provider' 
      });
    }

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code required' 
      });
    }

    let providerUserId, email, name, avatarUrl;

    if (provider === 'google') {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const googleUser = await userResponse.json();
      providerUserId = googleUser.id;
      email = googleUser.email;
      name = googleUser.name;
      avatarUrl = googleUser.picture;
    } else {
      // Facebook
      const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${FACEBOOK_APP_ID}&` +
        `client_secret=${FACEBOOK_APP_SECRET}&` +
        `redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&` +
        `code=${code}`;

      const tokenResponse = await fetch(tokenUrl);
      const tokens = await tokenResponse.json();

      const userUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`;
      const userResponse = await fetch(userUrl);
      const fbUser = await userResponse.json();

      providerUserId = fbUser.id;
      email = fbUser.email;
      name = fbUser.name;
      avatarUrl = fbUser.picture?.data?.url;
    }

    // Check if account already linked to another user
    const existingLink = await prisma.user.findFirst({
      where: {
        [`${provider}Id`]: providerUserId,
        NOT: { id: userId },
      },
    });

    if (existingLink) {
      return res.status(400).json({ 
        success: false, 
        message: `This ${provider} account is already linked to another user` 
      });
    }

    // Link account
    await prisma.user.update({
      where: { id: userId },
      data: {
        [`${provider}Id`]: providerUserId,
        avatarUrl: avatarUrl || undefined,
      },
    });

    res.json({
      success: true,
      message: `${provider} account linked successfully`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Unlink social account
 */
exports.unlinkAccount = async (req, res, next) => {
  try {
    const { provider } = req.body;
    const userId = req.user.id;

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid provider' 
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { [`${provider}Id`]: null },
    });

    res.json({
      success: true,
      message: `${provider} account unlinked successfully`,
    });
  } catch (err) {
    next(err);
  }
};
