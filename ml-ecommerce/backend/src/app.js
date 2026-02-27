// ==========================================
// Express App Configuration
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

// Prometheus metrics
collectDefaultMetrics({ prefix: 'ml_ecommerce_' });

const app = express();

// ==========================================
// Security & Middleware
// ==========================================
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// ==========================================
// Rate Limiting
// ==========================================
app.use('/api/', rateLimiter);

// ==========================================
// Health Check
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// Prometheus Metrics Endpoint
// ==========================================
app.get('/metrics', async (req, res) => {
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

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
