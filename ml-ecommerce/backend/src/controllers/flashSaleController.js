// ==========================================
// Flash Sale Controller — IntelliCore Ecommerce
// ==========================================

const { prisma } = require('../config/database');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

/**
 * Get all active flash sales
 */
exports.getActiveSales = async (req, res, next) => {
  try {
    const cacheKey = 'flash-sales:active';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const now = new Date();
    const sales = await prisma.flashSale.findMany({
      where: {
        isActive: true,
        OR: [
          { startsAt: { lte: now }, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: null },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                images: { select: { url: true, isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { startsAt: 'asc' },
    });

    await cacheSet(cacheKey, sales, 60); // Cache for 1 minute
    res.json({ success: true, data: sales });
  } catch (err) {
    next(err);
  }
};

/**
 * Get flash sale by ID
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `flash-sale:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const sale = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                stockQuantity: true,
                images: { select: { url: true, isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Flash sale not found' });
    }

    await cacheSet(cacheKey, sale, 120);
    res.json({ success: true, data: sale });
  } catch (err) {
    next(err);
  }
};

/**
 * Create flash sale (Admin)
 */
exports.create = async (req, res, next) => {
  try {
    const { name, startsAt, endsAt, isActive = true, items = [] } = req.body;

    const sale = await prisma.flashSale.create({
      data: {
        name,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive,
        items: items.length > 0 ? {
          create: items.map(item => ({
            productId: item.productId,
            salePrice: item.salePrice,
            quantityLimit: item.quantityLimit,
          })),
        } : undefined,
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    await cacheDel('flash-sales:active');
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    next(err);
  }
};

/**
 * Update flash sale (Admin)
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, startsAt, endsAt, isActive, items } = req.body;

    // If items are being updated, delete old and create new
    let updateData = {
      name,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
      isActive,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const sale = await prisma.flashSale.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Update items if provided
    if (items && items.length > 0) {
      await prisma.flashSaleItem.deleteMany({ where: { flashSaleId: id } });
      
      await prisma.flashSaleItem.createMany({
        data: items.map(item => ({
          flashSaleId: id,
          productId: item.productId,
          salePrice: item.salePrice,
          quantityLimit: item.quantityLimit,
        })),
      });
    }

    await cacheDel('flash-sales:active');
    await cacheDel(`flash-sale:${id}`);

    // Fetch updated sale
    const updatedSale = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.json({ success: true, data: updatedSale });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete flash sale (Admin)
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.flashSaleItem.deleteMany({ where: { flashSaleId: id } });
    await prisma.flashSale.delete({ where: { id } });

    await cacheDel('flash-sales:active');
    await cacheDel(`flash-sale:${id}`);

    res.json({ success: true, message: 'Flash sale deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * Add product to flash sale (Admin)
 */
exports.addItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId, salePrice, quantityLimit } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already in this flash sale
    const existing = await prisma.flashSaleItem.findFirst({
      where: { flashSaleId: id, productId },
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already in this flash sale' 
      });
    }

    const item = await prisma.flashSaleItem.create({
      data: {
        flashSaleId: id,
        productId,
        salePrice,
        quantityLimit,
      },
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    await cacheDel('flash-sales:active');
    await cacheDel(`flash-sale:${id}`);

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove product from flash sale (Admin)
 */
exports.removeItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    await prisma.flashSaleItem.delete({ where: { id: itemId } }).catch(() => {});

    await cacheDel('flash-sales:active');
    await cacheDel(`flash-sale:${id}`);

    res.json({ success: true, message: 'Product removed from flash sale' });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all flash sales (Admin)
 */
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sales, total] = await Promise.all([
      prisma.flashSale.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { items: true } },
        },
      }),
      prisma.flashSale.count(),
    ]);

    res.json({
      success: true,
      data: {
        items: sales,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};
