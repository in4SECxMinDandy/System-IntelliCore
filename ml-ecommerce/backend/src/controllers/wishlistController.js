const { prisma } = require('../config/database');

exports.list = async (req, res, next) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
      orderBy: { addedAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.add = async (req, res, next) => {
  try {
    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
      create: { userId: req.user.id, productId: req.params.productId },
      update: {},
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) { next(err); }
};
