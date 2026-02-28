// ==========================================
// PayPal Controller — IntelliCore Ecommerce
// ==========================================

const { prisma } = require('../config/database');
const logger = require('../config/logger');

// PayPal API Configuration
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

/**
 * Get PayPal Access Token
 */
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal Order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'USD' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'orderId and amount are required' 
      });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          description: `Order #${order.orderNumber}`,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        }],
        application_context: {
          brand_name: 'IntelliCore',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.FRONTEND_URL}/orders/${orderId}?payment=success`,
          cancel_url: `${process.env.FRONTEND_URL}/orders/${orderId}?payment=cancelled`,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      logger.error('PayPal create order error:', data);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to create PayPal order',
        error: data.error 
      });
    }

    // Update order with PayPal order ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: data.id },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId,
        provider: 'paypal',
        providerTxId: data.id,
        amount: parseFloat(amount),
        currency: currency.toUpperCase(),
        status: 'pending',
        metadata: { paypalOrderId: data.id },
      },
    });

    // Find approval URL
    const approvalUrl = data.links?.find(link => link.rel === 'approve')?.href;

    res.json({
      success: true,
      data: {
        orderId: data.id,
        approvalUrl,
        status: data.status,
      },
    });
  } catch (err) {
    logger.error('PayPal create order error:', err);
    next(err);
  }
};

/**
 * Capture PayPal Order (after user approval)
 */
exports.captureOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'paypalOrderId is required' 
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.error) {
      logger.error('PayPal capture error:', data);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to capture PayPal order',
        error: data.error 
      });
    }

    // Get the capture details
    const purchaseUnit = data.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    
    if (capture?.status === 'COMPLETED') {
      // Update order status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { 
            paymentStatus: 'paid', 
            status: 'confirmed',
            paymentMethod: 'paypal',
          },
        }),
        prisma.payment.updateMany({
          where: { providerTxId: paypalOrderId },
          data: { 
            status: 'paid',
            providerTxId: capture.id,
          },
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
            message: `Your payment for order #${order.orderNumber} has been confirmed via PayPal.`,
            actionUrl: `/orders/${orderId}`,
          },
        });
      }

      res.json({
        success: true,
        data: {
          status: 'completed',
          captureId: capture.id,
          orderId,
        },
      });
    } else {
      res.json({
        success: false,
        data: {
          status: capture?.status || 'pending',
          orderId,
        },
      });
    }
  } catch (err) {
    logger.error('PayPal capture error:', err);
    next(err);
  }
};

/**
 * Get PayPal Order Details
 */
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error('PayPal get order details error:', err);
    next(err);
  }
};

/**
 * Create PayPal Refund
 */
exports.createRefund = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Find PayPal capture ID from payments
    const payment = await prisma.payment.findFirst({
      where: { 
        orderId,
        provider: 'paypal',
        status: 'paid',
      },
    });

    if (!payment || !payment.providerTxId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No PayPal payment found for this order' 
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${payment.providerTxId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount ? {
          value: amount.toFixed(2),
          currency_code: payment.currency || 'USD',
        } : undefined,
        note_to_payer: reason || 'Refund requested by customer',
      }),
    });

    const data = await response.json();

    if (data.error) {
      logger.error('PayPal refund error:', data);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to process PayPal refund',
        error: data.error 
      });
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'refunded', status: 'refunded' },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'refunded' },
    });

    res.json({
      success: true,
      data: {
        refundId: data.id,
        status: data.status,
      },
    });
  } catch (err) {
    logger.error('PayPal refund error:', err);
    next(err);
  }
};

/**
 * Handle PayPal Webhook
 */
exports.webhook = async (req, res, next) => {
  try {
    const event = req.body;
    
    logger.info('PayPal webhook received:', event.event_type);

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED': {
        logger.info('PayPal order approved:', event.resource.id);
        break;
      }

      case 'PAYMENT.CAPTURE.COMPLETED': {
        const capture = event.resource;
        const orderId = capture.custom_id;
        
        if (orderId) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: orderId },
              data: { paymentStatus: 'paid', status: 'confirmed' },
            }),
            prisma.payment.updateMany({
              where: { providerTxId: capture.id },
              data: { status: 'paid' },
            }),
          ]);
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        const capture = event.resource;
        const orderId = capture.custom_id;
        
        if (orderId) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: orderId },
              data: { paymentStatus: 'failed', status: 'cancelled' },
            }),
            prisma.payment.updateMany({
              where: { providerTxId: capture.id },
              data: { status: 'failed' },
            }),
          ]);
        }
        break;
      }

      case 'REFUND.COMPLETED': {
        const refund = event.resource;
        const capture = refund.links?.find(l => l.rel === 'up');
        
        if (capture?.href) {
          const captureId = capture.href.split('/').pop();
          const payment = await prisma.payment.findFirst({
            where: { providerTxId: captureId },
          });
          
          if (payment) {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: { paymentStatus: 'refunded', status: 'refunded' },
            });
            
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'refunded' },
            });
          }
        }
        break;
      }

      default:
        logger.info('Unhandled PayPal webhook event:', event.event_type);
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('PayPal webhook error:', err);
    next(err);
  }
};
