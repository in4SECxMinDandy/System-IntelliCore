const { prisma } = require('../config/database');

exports.get = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        cartItems: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, basePrice: true, salePrice: true, stockQuantity: true,
                images: { where: { isPrimary: true }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { cartItems: true },
      });
    }

    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });

    // Check if item already in cart
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId || null },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId: variantId || null, quantity },
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { cartItems: { include: { product: { select: { id: true, name: true, basePrice: true, salePrice: true, images: { take: 1 } } }, variant: true } } },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    } else {
      await prisma.cartItem.update({ where: { id: req.params.itemId }, data: { quantity } });
    }
    res.json({ success: true, message: 'Cart updated' });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    next(err);
  }
};

exports.clear = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};
