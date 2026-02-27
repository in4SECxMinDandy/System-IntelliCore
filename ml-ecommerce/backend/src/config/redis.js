// ==========================================
// Redis — ioredis Client
// ==========================================

const Redis = require('ioredis');
const logger = require('./logger');

let redis;

async function connectRedis() {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  await redis.connect();
  logger.info('✅ Redis connected');
  return redis;
}

function getRedis() {
  if (!redis) throw new Error('Redis not initialized');
  return redis;
}

// Cache helpers
async function cacheGet(key) {
  const val = await getRedis().get(key);
  return val ? JSON.parse(val) : null;
}

async function cacheSet(key, value, ttlSeconds = 300) {
  await getRedis().setex(key, ttlSeconds, JSON.stringify(value));
}

async function cacheDel(key) {
  await getRedis().del(key);
}

async function cacheDelPattern(pattern) {
  const keys = await getRedis().keys(pattern);
  if (keys.length > 0) await getRedis().del(...keys);
}

module.exports = { connectRedis, getRedis, cacheGet, cacheSet, cacheDel, cacheDelPattern };
