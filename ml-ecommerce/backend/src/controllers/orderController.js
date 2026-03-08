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

    // UUID validation regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Merge duplicate productId entries to prevent stock bypass
    const mergedItemsMap = {};
    for (const item of items) {
      if (!item.productId || !uuidRegex.test(item.productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID format: ${item.productId}. Expected UUID.`
        });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${item.productId}`
        });
      }
      if (mergedItemsMap[item.productId]) {
        mergedItemsMap[item.productId].quantity += item.quantity;
      } else {
        mergedItemsMap[item.productId] = { ...item };
      }
    }
    const mergedItems = Object.values(mergedItemsMap);

    // Fetch products and calculate totals
    const productIds = mergedItems.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));
    let subtotal = 0;
    const orderItems = mergedItems.map(item => {
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

    // Check stock availability and deduct inventory ATOMICALLY in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Atomic stock check + deduct using updateMany with conditional where
      // This prevents race conditions (no gap between read and write)
      for (const item of mergedItems) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stockQuantity: { gte: item.quantity }, // Atomic: only update if stock sufficient
          },
          data: {
            stockQuantity: { decrement: item.quantity },
            purchaseCount: { increment: item.quantity },
          },
        });

        if (result.count === 0) {
          // Stock insufficient or product became inactive — fetch details for error message
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { name: true, stockQuantity: true, isActive: true },
          });
          const reason = !product || !product.isActive
            ? `Product not available`
            : `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`;
          throw Object.assign(new Error(reason), { status: 409 });
        }

        // Create inventory log
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stockQuantity: true },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            userId: req.user.id,
            type: 'sale',
            quantity: -item.quantity,
            previousQty: (currentProduct?.stockQuantity ?? 0) + item.quantity,
            newQty: currentProduct?.stockQuantity ?? 0,
            reason: 'Order placed',
            reference: generateOrderNumber(),
          },
        });
      }

      // Create order
      return await tx.order.create({
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
      include: { orderItems: { select: { productId: true, quantity: true } } },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    // Cancel order AND restore stock atomically
    await prisma.$transaction([
      prisma.order.update({
        where: { id: req.params.id },
        data: { status: 'cancelled' },
      }),
      // Restore inventory for each item
      ...order.orderItems.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        })
      ),
    ]);

    res.json({ success: true, message: 'Order cancelled and stock restored' });
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
