// ==========================================
// Inventory Management Controller
// ==========================================

const { prisma } = require('../config/database');

/**
 * Get inventory overview
 */
exports.getInventoryOverview = async (req, res, next) => {
  try {
    const [totalProducts, lowStockProducts, outOfStockProducts, totalValue] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: { isActive: true, stockQuantity: { gt: 0, lte: 10 } },
      }),
      prisma.product.count({
        where: { isActive: true, stockQuantity: 0 },
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _sum: {
          stockQuantity: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockUnits: totalValue._sum.stockQuantity || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all products with inventory info
 */
exports.getInventory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      categoryId,
      sortBy = 'stockQuantity',
      sortOrder = 'asc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(status === 'low_stock' && { stockQuantity: { gt: 0, lte: 10 } }),
      ...(status === 'out_of_stock' && { stockQuantity: 0 }),
      ...(status === 'in_stock' && { stockQuantity: { gt: 10 } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          sku: true,
          stockQuantity: true,
          reservedQuantity: true,
          basePrice: true,
          costPrice: true,
          category: { select: { name: true } },
          brand: { select: { name: true } },
          images: {
            where: { isPrimary: true },
            select: { url: true },
            take: 1,
          },
          updatedAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: products.map(p => ({
          ...p,
          availableQuantity: p.stockQuantity - p.reservedQuantity,
          status: p.stockQuantity === 0 ? 'out_of_stock' :
                  p.stockQuantity <= 10 ? 'low_stock' : 'in_stock',
        })),
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
 * Get low stock products
 */
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: { lte: parseInt(threshold) },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        category: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
      orderBy: { stockQuantity: 'asc' },
      take: 50,
    });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * Update stock quantity
 */
exports.updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, type, reason, reference, notes } = req.body;
    const userId = req.user.id;

    if (!quantity || !type) {
      return res.status(400).json({ success: false, message: 'quantity and type are required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stockQuantity: true, name: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let newQuantity;
    const qty = parseInt(quantity);

    switch (type) {
      case 'restock':
        newQuantity = product.stockQuantity + qty;
        break;
      case 'adjustment':
        newQuantity = qty; // Set absolute value
        break;
      case 'damage':
      case 'transfer':
        newQuantity = Math.max(0, product.stockQuantity - qty);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    // Update product and create log in transaction
    const [updatedProduct, log] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newQuantity },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          userId,
          type,
          quantity: qty,
          previousQty: product.stockQuantity,
          newQty: newQuantity,
          reason,
          reference,
          notes,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        product: { id: updatedProduct.id, stockQuantity: updatedProduct.stockQuantity },
        log,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get inventory logs for a product
 */
exports.getInventoryLogs = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where: { productId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true } },
        },
      }),
      prisma.inventoryLog.count({ where: { productId } }),
    ]);

    res.json({
      success: true,
      data: {
        items: logs,
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
 * Bulk update stock
 */
exports.bulkUpdateStock = async (req, res, next) => {
  try {
    const { updates } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, message: 'updates array is required' });
    }

    const results = await prisma.$transaction(
      updates.map(({ productId, quantity, type, reason }) =>
        prisma.product.update({
          where: { id: productId },
          data: { stockQuantity: type === 'restock' ? { increment: quantity } : quantity },
        })
      )
    );

    res.json({ success: true, data: { updated: results.length } });
  } catch (err) {
    next(err);
  }
};
