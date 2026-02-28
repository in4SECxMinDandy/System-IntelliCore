// ==========================================
// Chatbot Controller — AI Customer Support
// ==========================================

const { prisma } = require('../config/database');
const axios = require('axios');
const logger = require('../config/logger');

// FAQ Knowledge Base
const FAQ_KNOWLEDGE_BASE = [
  {
    patterns: ['shipping', 'delivery', 'how long', 'when will'],
    response: 'We offer standard shipping (5-7 days), express (2-3 days), and overnight delivery. Orders over $50 qualify for free standard shipping! 🚚',
    suggestions: ['Track my order', 'Shipping costs', 'International shipping'],
  },
  {
    patterns: ['return', 'refund', 'exchange', 'money back'],
    response: 'We have a hassle-free 30-day return policy. Items must be in original condition. Refunds are processed within 3-5 business days. 💰',
    suggestions: ['Start a return', 'Refund status', 'Exchange policy'],
  },
  {
    patterns: ['payment', 'pay', 'credit card', 'paypal', 'stripe'],
    response: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are secured with 256-bit SSL encryption. 🔒',
    suggestions: ['Payment methods', 'Payment security', 'Billing issues'],
  },
  {
    patterns: ['discount', 'coupon', 'promo', 'deal', 'offer', 'sale'],
    response: 'Check out our Deals page for current promotions! You can also subscribe to our newsletter for exclusive discount codes. 🎉',
    suggestions: ['Current deals', 'Newsletter signup', 'Loyalty points'],
  },
  {
    patterns: ['account', 'login', 'password', 'forgot', 'reset'],
    response: 'You can reset your password from the login page. If you\'re having trouble, contact our support team at support@intellicore.shop 📧',
    suggestions: ['Reset password', 'Account settings', 'Contact support'],
  },
  {
    patterns: ['track', 'order status', 'where is my order', 'tracking'],
    response: 'You can track your order in the "My Orders" section of your account. You\'ll also receive email updates with tracking information. 📦',
    suggestions: ['View my orders', 'Tracking number', 'Contact carrier'],
  },
  {
    patterns: ['recommend', 'suggest', 'best', 'popular', 'trending'],
    response: 'Our AI recommendation engine personalizes suggestions just for you! Check out the "For You" section on the homepage or browse trending products. ✨',
    suggestions: ['Show trending products', 'Personalized picks', 'Browse categories'],
  },
  {
    patterns: ['community', 'forum', 'review', 'rating'],
    response: 'Join our vibrant community! Share reviews, participate in challenges, and connect with fellow shoppers. Your reviews help others make better decisions. 👥',
    suggestions: ['Join community', 'Write a review', 'View challenges'],
  },
];

/**
 * Process chatbot message
 */
exports.processMessage = async (req, res, next) => {
  try {
    const { message, history = [], sessionId } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const userMessage = message.toLowerCase().trim();

    // Try to find FAQ match first
    let response = null;
    let suggestions = [];

    for (const faq of FAQ_KNOWLEDGE_BASE) {
      if (faq.patterns.some(pattern => userMessage.includes(pattern))) {
        response = faq.response;
        suggestions = faq.suggestions;
        break;
      }
    }

    // If no FAQ match, try ML service for product recommendations
    if (!response) {
      if (userMessage.includes('product') || userMessage.includes('find') || userMessage.includes('looking for') || userMessage.includes('buy')) {
        try {
          const mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}/recommendations/chatbot`,
            { query: message, userId },
            { timeout: 5000 }
          );

          if (mlResponse.data?.products?.length > 0) {
            const products = mlResponse.data.products.slice(0, 3);
            response = `I found some products that might interest you! Here are my top picks based on your query:\n\n${products.map(p => `• **${p.name}** - $${p.price}`).join('\n')}`;
            suggestions = ['View all results', 'Refine search', 'Browse categories'];
          }
        } catch (mlError) {
          logger.warn('ML service unavailable for chatbot:', mlError.message);
        }
      }
    }

    // Default response if nothing matched
    if (!response) {
      const defaultResponses = [
        "I'm not sure about that, but I'd be happy to help! Could you rephrase your question? 🤔",
        "That's a great question! Let me connect you with our support team for a detailed answer. 💬",
        "I can help you with orders, shipping, returns, payments, and product recommendations. What would you like to know? 😊",
      ];
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      suggestions = ['Track order', 'Shipping info', 'Return policy', 'Contact support'];
    }

    // Save chat session
    if (sessionId) {
      await prisma.chatSession.upsert({
        where: { sessionId },
        update: {
          messages: {
            push: [
              { role: 'user', content: message, timestamp: new Date() },
              { role: 'bot', content: response, timestamp: new Date() },
            ],
          },
          updatedAt: new Date(),
        },
        create: {
          sessionId,
          userId,
          messages: [
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'bot', content: response, timestamp: new Date() },
          ],
        },
      });
    }

    // Track chatbot interaction
    if (userId) {
      await prisma.userEvent.create({
        data: {
          userId,
          eventType: 'chatbot_interaction',
          eventData: { message: message.substring(0, 100), responseType: 'faq' },
        },
      }).catch(() => {}); // Non-critical
    }

    res.json({
      success: true,
      data: {
        message: response,
        suggestions,
        sessionId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get chat history
 */
exports.getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return res.json({ success: true, data: { messages: [] } });
    }

    res.json({ success: true, data: { messages: session.messages } });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear chat history
 */
exports.clearChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    await prisma.chatSession.updateMany({
      where: { sessionId },
      data: { messages: [] },
    });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    next(err);
  }
};
