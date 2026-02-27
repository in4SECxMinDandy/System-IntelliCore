const { prisma } = require('../config/database');
const { cacheGet, cacheSet, cacheDelPattern } = require('../config/redis');
const slugify = require('slugify');

exports.list = async (req, res, next) => {
  try {
    const cached = await cacheGet('categories:all');
    if (cached) return res.json({ success: true, data: cached });

    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
    });

    await cacheSet('categories:all', categories, 600);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { children: true, products: { where: { isActive: true }, take: 20 } },
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await prisma.category.create({ data: { name, slug, ...rest } });
    await cacheDelPattern('categories:*');
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const data = { ...rest };
    if (name) { data.name = name; data.slug = slugify(name, { lower: true, strict: true }); }
    const category = await prisma.category.update({ where: { id: req.params.id }, data });
    await cacheDelPattern('categories:*');
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } });
    await cacheDelPattern('categories:*');
    res.json({ success: true, message: 'Category deactivated' });
  } catch (err) {
    next(err);
  }
};
