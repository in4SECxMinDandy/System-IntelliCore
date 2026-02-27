const { prisma } = require('../config/database');

exports.validate = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    if (orderAmount < Number(coupon.minOrderAmount)) {
      return res.status(400).json({ success: false, message: `Minimum order amount is ${coupon.minOrderAmount}` });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscountAmount) discount = Math.min(discount, Number(coupon.maxDiscountAmount));
    } else {
      discount = Number(coupon.discountValue);
    }

    res.json({ success: true, data: { coupon, discount } });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const coupon = await prisma.coupon.create({ data: req.body });
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { next(err); }
};
