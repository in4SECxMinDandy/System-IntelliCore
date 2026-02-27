// ==========================================
// Product Controller
// ==========================================

const { prisma } = require('../config/database');
const { cacheGet, cacheSet, cacheDelPattern } = require('../config/redis');
const slugify = require('slugify');

const PRODUCT_SELECT = {
  id: true, name: true, slug: true, shortDescription: true,
  basePrice: true, salePrice: true, stockQuantity: true,
  isFeatured: true, viewCount: true, purchaseCount: true,
  tags: true, createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  images: { select: { url: true, altText: true, isPrimary: true }, orderBy: { sortOrder: 'asc' } },
};

exports.list = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, category, brand, minPrice, maxPrice,
      sort = 'createdAt', order = 'desc', search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where = { isActive: true };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: Number(limit),
        select: PRODUCT_SELECT,
        orderBy: { [sort]: order },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

exports.featured = async (req, res, next) => {
  try {
    const cacheKey = 'products:featured';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: PRODUCT_SELECT,
      take: 12,
      orderBy: { purchaseCount: 'desc' },
    });

    await cacheSet(cacheKey, products, 300);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      },
      select: PRODUCT_SELECT,
      take: Number(limit),
    });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cacheKey = `product:${slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        attributes: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
      },
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Increment view count
    await prisma.product.update({ where: { slug }, data: { viewCount: { increment: 1 } } });

    await cacheSet(cacheKey, product, 120);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: { name, slug, ...rest },
      select: PRODUCT_SELECT,
    });

    await cacheDelPattern('products:*');
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, ...rest } = req.body;
    const data = { ...rest };
    if (name) {
      data.name = name;
      data.slug = slugify(name, { lower: true, strict: true });
    }

    const product = await prisma.product.update({ where: { id }, data, select: PRODUCT_SELECT });
    await cacheDelPattern('products:*');
    await cacheDelPattern(`product:${product.slug}`);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    await cacheDelPattern('products:*');
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
};
