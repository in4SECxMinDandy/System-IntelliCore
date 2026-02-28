// ==========================================
// Admin Analytics Controller
// ==========================================

const { prisma } = require('../config/database');

/**
 * Get dashboard analytics overview
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;

    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      activeUsers,
      totalProducts,
      newOrders,
      newUsers,
      revenueByDay,
      topProducts,
      ordersByStatus,
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { totalAmount: true },
      }),

      // Total orders
      prisma.order.count(),

      // Total users
      prisma.user.count({ where: { role: 'customer' } }),

      // Active users (last 30 days)
      prisma.user.count({
        where: {
          role: 'customer',
          lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),

      // Total products
      prisma.product.count({ where: { isActive: true } }),

      // New orders in period
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),

      // New users in period
      prisma.user.count({
        where: { role: 'customer', createdAt: { gte: startDate } },
      }),

      // Revenue by day (last 30 days)
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('day', created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as orders
        FROM orders
        WHERE created_at >= ${startDate}
          AND payment_status = 'paid'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date ASC
      `,

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId).filter(Boolean);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, images: { where: { isPrimary: true }, take: 1 } },
    });

    const topProductsWithDetails = topProducts.map(tp => ({
      ...tp,
      product: productDetails.find(p => p.id === tp.productId),
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalOrders,
          totalUsers,
          activeUsers,
          totalProducts,
          newOrders,
          newUsers,
        },
        revenueByDay,
        topProducts: topProductsWithDetails,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user analytics
 */
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          emailVerified: true,
          twoFactorEnabled: true,
          loyaltyPoints: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: { orders: true, reviews: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: users,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user role/status
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * Get order analytics
 */
exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          orderItems: {
            take: 1,
            select: { productName: true, productImage: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: orders,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get ML model performance
 */
exports.getMLAnalytics = async (req, res, next) => {
  try {
    const [models, recentLogs] = await Promise.all([
      prisma.mlModel.findMany({
        orderBy: { trainedAt: 'desc' },
        take: 10,
      }),
      prisma.recommendationLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const conversionRate = recentLogs.length > 0
      ? (recentLogs.filter(l => l.converted).length / recentLogs.length * 100).toFixed(2)
      : 0;

    const clickRate = recentLogs.length > 0
      ? (recentLogs.filter(l => l.clickedProductId).length / recentLogs.length * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        models,
        metrics: {
          conversionRate: parseFloat(conversionRate),
          clickRate: parseFloat(clickRate),
          totalRecommendations: recentLogs.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get system health metrics
 */
exports.getSystemHealth = async (req, res, next) => {
  try {
    const startTime = process.hrtime();

    // Test DB connection
    await prisma.$queryRaw`SELECT 1`;
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const dbResponseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    res.json({
      success: true,
      data: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        dbResponseTime: `${dbResponseTime}ms`,
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Approve/reject community posts
 */
exports.moderatePosts = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { approved } = req.body;

    const post = await prisma.communityPost.update({
      where: { id: postId },
      data: { isApproved: approved },
    });

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * Approve/reject reviews
 */
exports.moderateReviews = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { approved, adminReply } = req.body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isApproved: approved,
        ...(adminReply && { adminReply }),
      },
    });

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};
