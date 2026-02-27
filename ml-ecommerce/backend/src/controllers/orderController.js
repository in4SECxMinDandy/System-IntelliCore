// ==========================================
// Order Controller
// ==========================================

const { prisma } = require('../config/database');

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: { orderItems: { include: { product: { select: { name: true, images: { take: 1 } } } } } },
        orderBy: { createdAt: 'desc' },
        skip, take: Number(limit),
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { orderItems: { include: { product: true, variant: true } } },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    // Fetch products and calculate totals
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.productId];
      if (!product) throw Object.assign(new Error(`Product ${item.productId} not found`), { status: 400 });
      const unitPrice = Number(product.salePrice || product.basePrice);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: item.productId,
        variantId: item.variantId || null,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderNumber: generateOrderNumber(),
        shippingAddress,
        paymentMethod,
        couponCode,
        notes,
        subtotal,
        shippingFee,
        totalAmount,
        orderItems: { create: orderItems },
      },
      include: { orderItems: true },
    });

    // Clear user cart
    await prisma.cart.deleteMany({ where: { userId: req.user.id } });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const data = { status };
    if (trackingNumber) data.trackingNumber = trackingNumber;
    if (status === 'shipped') data.shippedAt = new Date();
    if (status === 'delivered') data.deliveredAt = new Date();

    const order = await prisma.order.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.adminList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { email: true, fullName: true } }, orderItems: true },
        orderBy: { createdAt: 'desc' },
        skip, take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    next(err);
  }
};
