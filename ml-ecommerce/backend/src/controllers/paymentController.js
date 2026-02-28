// ==========================================
// Payment Controller — Stripe + PayPal
// ==========================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { prisma } = require('../config/database');
const logger = require('../config/logger');

/**
 * Create Stripe Payment Intent
 */
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'usd' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ success: false, message: 'orderId and amount are required' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      metadata: {
        orderId,
        orderNumber: order.orderNumber,
        userId: order.userId || 'guest',
      },
      automatic_payment_methods: { enabled: true },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: paymentIntent.id },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId,
        provider: 'stripe',
        providerTxId: paymentIntent.id,
        amount: amount / 100,
        currency: currency.toUpperCase(),
        status: 'pending',
        metadata: { paymentIntentId: paymentIntent.id },
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (err) {
    logger.error('Stripe payment intent error:', err);
    next(err);
  }
};

/**
 * Confirm payment (webhook handler)
 */
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'paid', status: 'confirmed' },
          }),
          prisma.payment.updateMany({
            where: { providerTxId: paymentIntent.id },
            data: { status: 'paid' },
          }),
        ]);

        // Send notification
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order?.userId) {
          await prisma.notification.create({
            data: {
              userId: order.userId,
              type: 'order',
              title: 'Payment Confirmed! ✅',
              message: `Your payment for order #${order.orderNumber} has been confirmed.`,
              actionUrl: `/orders/${orderId}`,
            },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'failed' },
          }),
          prisma.payment.updateMany({
            where: { providerTxId: paymentIntent.id },
            data: { status: 'failed' },
          }),
        ]);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
        const { orderId } = paymentIntent.metadata;

        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'refunded', status: 'refunded' },
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Stripe webhook processing error:', err);
    next(err);
  }
};

/**
 * Create refund
 */
exports.createRefund = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.paymentIntentId) {
      return res.status(400).json({ success: false, message: 'No payment found for this order' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer',
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'refunded', status: 'refunded' },
    });

    res.json({ success: true, data: { refundId: refund.id, status: refund.status } });
  } catch (err) {
    logger.error('Stripe refund error:', err);
    next(err);
  }
};

/**
 * Get payment methods for user
 */
exports.getPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // In production, store Stripe customer ID in user record
    // For now, return empty list
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};

/**
 * Get payment history
 */
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count(),
    ]);

    res.json({
      success: true,
      data: {
        items: payments,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};
