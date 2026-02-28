// ==========================================
// ML Ecommerce Backend — Entry Point
// ==========================================

require('dotenv').config();
const app = require('./app');
const { connectPostgres } = require('./config/database');
const { connectMongo } = require('./config/mongo');
const { connectRedis } = require('./config/redis');
const { initializeSocketIO } = require('./services/socketService');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Connect to databases
    await connectPostgres();
    await connectMongo();
    await connectRedis();

    // Create HTTP server
    const server = require('http').createServer(app);

    // Initialize Socket.io
    const io = initializeSocketIO(server);
    
    // Make io accessible globally
    global.io = io;

    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
      logger.info(`📡 Socket.io enabled`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
