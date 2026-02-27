// ==========================================
// MongoDB — Mongoose Connection
// ==========================================

const mongoose = require('mongoose');
const logger = require('./logger');

async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_events';
  await mongoose.connect(uri);
  logger.info('✅ MongoDB connected via Mongoose');
}

// Event Schema for analytics
const eventSchema = new mongoose.Schema({
  userId: String,
  sessionId: String,
  eventType: String,
  productId: String,
  categoryId: String,
  eventData: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

eventSchema.index({ userId: 1, createdAt: -1 });
eventSchema.index({ productId: 1, eventType: 1 });
eventSchema.index({ createdAt: -1 });

const EventLog = mongoose.model('EventLog', eventSchema);

module.exports = { connectMongo, EventLog };
