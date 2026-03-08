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

// ==========================================
// Advanced Search with Filters
// ==========================================

exports.advancedSearch = async (req, res, next) => {
  try {
    const {
      q = '',
      page = 1,
      limit = 20,
      // Category filters
      categories,
      brands,
      // Price filters
      minPrice,
      maxPrice,
      // Rating filter
      minRating,
      // Stock filter
      inStock,
      // Availability
      isFeatured,
      isNew: _isNew, // Reserved for future use (new arrivals filter)
      onSale,
      // Sort options
      sort = 'relevance',
      // Tags
      tags,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where = { isActive: true };

    // Text search
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: q.split(' ').filter(Boolean) } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    // Category filter
    if (categories) {
      const categoryList = categories.split(',');
      where.category = { slug: { in: categoryList } };
    }

    // Brand filter
    if (brands) {
      const brandList = brands.split(',');
      where.brand = { slug: { in: brandList } };
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      where.averageRating = { gte: Number(minRating) };
    }

    // Stock filter
    if (inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    // Special filters
    if (isFeatured === 'true') where.isFeatured = true;
    if (onSale === 'true') {
      where.salePrice = { not: null };
    }

    // Tags filter
    if (tags) {
      const tagList = tags.split(',');
      where.tags = { hasSome: tagList };
    }

    // Sort mapping
    const sortOptions = {
      relevance: { viewCount: 'desc' },
      price_asc: { basePrice: 'asc' },
      price_desc: { basePrice: 'desc' },
      newest: { createdAt: 'desc' },
      popular: { purchaseCount: 'desc' },
      rating: { averageRating: 'desc' },
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          ...PRODUCT_SELECT,
          description: true,
          averageRating: true,
          reviewCount: true,
        },
        orderBy: sortOptions[sort] || { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      filters: {
        q,
        categories: categories?.split(',') || [],
        brands: brands?.split(',') || [],
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || null,
        minRating: Number(minRating) || 0,
        inStock: inStock === 'true',
        isFeatured: isFeatured === 'true',
        onSale: onSale === 'true',
        sort,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all filter options (categories, brands, price range, etc.)
exports.getFilters = async (req, res, next) => {
  try {
    const cacheKey = 'products:filters';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const [categories, brands, priceRange, tags, ratingStats] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, imageUrl: true },
        orderBy: { name: 'asc' },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, logoUrl: true },
        orderBy: { name: 'asc' },
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _min: { basePrice: true },
        _max: { basePrice: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { tags: true },
        take: 100,
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _avg: { averageRating: true },
        _count: { id: true },
      }),
    ]);

    // Extract unique tags
    const allTags = [...new Set(tags.flatMap((p) => p.tags))].slice(0, 50);

    const filters = {
      categories,
      brands,
      priceRange: {
        min: priceRange._min.basePrice || 0,
        max: priceRange._max.basePrice || 1000,
      },
      tags: allTags,
      ratings: [5, 4, 3, 2, 1],
      stats: {
        avgRating: ratingStats._avg.averageRating || 0,
        totalProducts: ratingStats._count.id,
      },
    };

    await cacheSet(cacheKey, filters, 600);
    res.json({ success: true, data: filters });
  } catch (err) {
    next(err);
  }
};

// Compare products
exports.compare = async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ success: false, message: 'Product IDs required' });
    }

    const productIds = ids.split(',').slice(0, 4); // Max 4 products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        salePrice: true,
        stockQuantity: true,
        averageRating: true,
        reviewCount: true,
        description: true,
        tags: true,
        weight: true,
        dimensions: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true, logoUrl: true } },
        images: { select: { url: true, isPrimary: true }, orderBy: { sortOrder: 'asc' }, take: 5 },
        attributes: true,
      },
    });

    // Get similar products for comparison
    if (products.length > 0) {
      const categoryId = products[0].category?.id;
      const similarProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          categoryId,
          id: { notIn: productIds },
        },
        select: { id: true, name: true, slug: true, images: { select: { url: true }, take: 1 } },
        take: 5,
      });
      return res.json({ success: true, data: { products, similarProducts } });
    }

    res.json({ success: true, data: { products, similarProducts: [] } });
  } catch (err) {
    next(err);
  }
};