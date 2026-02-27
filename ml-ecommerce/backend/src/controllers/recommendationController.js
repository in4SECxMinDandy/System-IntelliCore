// ==========================================
// Recommendation Controller
// ==========================================

const axios = require('axios');
const { prisma } = require('../config/database');
const { cacheGet, cacheSet } = require('../config/redis');
const { EventLog } = require('../config/mongo');
const logger = require('../config/logger');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

async function callMLService(endpoint, params = {}) {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}${endpoint}`, { params, timeout: 3000 });
    return response.data;
  } catch (err) {
    logger.warn(`ML service unavailable: ${err.message}`);
    return null;
  }
}

exports.forYou = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const cacheKey = userId ? `recs:for-you:${userId}` : 'recs:popular';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    let productIds = [];
    if (userId) {
      const mlResult = await callMLService('/recommendations/user', { user_id: userId, limit: 12 });
      if (mlResult?.product_ids) productIds = mlResult.product_ids;
    }

    // Fallback to popular products
    if (productIds.length === 0) {
      const popular = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { purchaseCount: 'desc' },
        take: 12,
        select: { id: true },
      });
      productIds = popular.map(p => p.id);
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
    });

    await cacheSet(cacheKey, products, 300);
    res.json({ success: true, data: products, strategy: userId ? 'personalized' : 'popular' });
  } catch (err) {
    next(err);
  }
};

exports.similar = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cacheKey = `recs:similar:${productId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    let productIds = [];
    const mlResult = await callMLService('/recommendations/similar', { product_id: productId, limit: 8 });
    if (mlResult?.product_ids) productIds = mlResult.product_ids;

    if (productIds.length === 0) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (product) {
        const similar = await prisma.product.findMany({
          where: { categoryId: product.categoryId, id: { not: productId }, isActive: true },
          take: 8,
          orderBy: { purchaseCount: 'desc' },
          select: { id: true },
        });
        productIds = similar.map(p => p.id);
      }
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
    });

    await cacheSet(cacheKey, products, 300);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.trending = async (req, res, next) => {
  try {
    const cacheKey = 'recs:trending';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ viewCount: 'desc' }, { purchaseCount: 'desc' }],
      take: 12,
      include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
    });

    await cacheSet(cacheKey, products, 600);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.frequentlyBought = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cacheKey = `recs:fbt:${productId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const mlResult = await callMLService('/recommendations/frequently-bought', { product_id: productId, limit: 4 });
    let productIds = mlResult?.product_ids || [];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    await cacheSet(cacheKey, products, 600);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.trackEvent = async (req, res, next) => {
  try {
    const { eventType, productId, categoryId, eventData, sessionId } = req.body;
    const userId = req.user?.id;

    // Save to MongoDB for ML training
    await EventLog.create({
      userId,
      sessionId,
      eventType,
      productId,
      categoryId,
      eventData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
    });

    // Also save to PostgreSQL for structured queries
    if (userId) {
      await prisma.userEvent.create({
        data: { userId, sessionId, eventType, productId, categoryId, eventData, ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      }).catch(() => {}); // Non-blocking
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.logClick = async (req, res, next) => {
  try {
    const { recommendationLogId, clickedProductId } = req.body;
    if (recommendationLogId) {
      await prisma.recommendationLog.update({
        where: { id: recommendationLogId },
        data: { clickedProductId, converted: true },
      }).catch(() => {});
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
