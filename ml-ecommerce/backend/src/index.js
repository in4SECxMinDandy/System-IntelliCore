// ==========================================
// ML Ecommerce Backend — Entry Point
// ==========================================

require('dotenv').config();
const app = require('./app');
const { connectPostgres } = require('./config/database');
const { connectMongo } = require('./config/mongo');
const { connectRedis } = require('./config/redis');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Connect to databases
    await connectPostgres();
    await connectMongo();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
