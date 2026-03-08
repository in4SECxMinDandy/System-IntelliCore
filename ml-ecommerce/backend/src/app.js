// ==========================================
// Express App Configuration — IntelliCore v2
// ==========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { collectDefaultMetrics, register } = require('prom-client');

const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const recommendationRoutes = require('./routes/recommendations');
const couponRoutes = require('./routes/coupons');
const twoFactorRoutes = require('./routes/twoFactor');
const communityRoutes = require('./routes/community');
const inventoryRoutes = require('./routes/inventory');
const paymentRoutes = require('./routes/payments');
const chatbotRoutes = require('./routes/chatbot');
const adminRoutes = require('./routes/admin');
const paypalRoutes = require('./routes/paypal');
const flashSaleRoutes = require('./routes/flashSales');
const socialAuthRoutes = require('./routes/socialAuth');

// Prometheus metrics
collectDefaultMetrics({ prefix: 'intellicore_' });

const app = express();

// ==========================================
// Security & Middleware
// ==========================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(compression());

// Raw body for Stripe webhooks
app.use('/api/payments/webhook/stripe', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// ==========================================
// Rate Limiting
// ==========================================
app.use('/api/', rateLimiter);

// ==========================================
// Health Check
// ==========================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// Prometheus Metrics Endpoint (protected)
// ==========================================
const metricsAuth = (req, res, next) => {
  const metricsToken = process.env.METRICS_TOKEN;
  // Only enforce auth if METRICS_TOKEN is configured
  if (metricsToken) {
    const provided = req.headers['x-metrics-token'] || req.query.token;
    if (provided !== metricsToken) {
      return res.status(403).json({ error: 'Forbidden: invalid metrics token' });
    }
  }
  next();
};

app.get('/metrics', metricsAuth, async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ==========================================
// API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/flash-sales', flashSaleRoutes);
app.use('/api/auth/social', socialAuthRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// API Documentation
// ==========================================
if (process.env.NODE_ENV !== 'production') {
  try {
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'IntelliCore ML Ecommerce API',
          version: '2.0.0',
          description: 'AI-powered ecommerce platform API',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
      },
      apis: ['./src/routes/*.js'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (_e) {
    // Swagger not available in production
  }
}

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
