// ==========================================
// Cache Service — Redis cache helper (Phase 1.2)
// Centralized cache with TTL, pattern invalidation, 
// and cache-aside pattern helpers
// ==========================================

const { redis } = require('../config/redis');
const logger = require('../config/logger');

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get a cached value by key. Returns null on miss or error.
 */
async function cacheGet(key) {
    try {
        const value = await redis.get(key);
        if (!value) return null;
        return JSON.parse(value);
    } catch (err) {
        logger.warn(`Cache GET failed for key "${key}": ${err.message}`);
        return null; // graceful degradation
    }
}

/**
 * Set a value in cache with optional TTL (seconds).
 */
async function cacheSet(key, value, ttl = DEFAULT_TTL) {
    try {
        const serialized = JSON.stringify(value);
        await redis.setex(key, ttl, serialized);
    } catch (err) {
        logger.warn(`Cache SET failed for key "${key}": ${err.message}`);
        // graceful degradation — don't throw
    }
}

/**
 * Delete a specific key.
 */
async function cacheDel(key) {
    try {
        await redis.del(key);
    } catch (err) {
        logger.warn(`Cache DEL failed for key "${key}": ${err.message}`);
    }
}

/**
 * Delete all keys matching a glob pattern (e.g., 'products:*').
 * Uses SCAN to avoid blocking Redis.
 */
async function cacheDelPattern(pattern) {
    try {
        let cursor = 0;
        let deletedCount = 0;
        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = parseInt(nextCursor);
            if (keys.length > 0) {
                await redis.del(...keys);
                deletedCount += keys.length;
            }
        } while (cursor !== 0);

        if (deletedCount > 0) {
            logger.debug(`Cache: cleared ${deletedCount} keys matching "${pattern}"`);
        }
    } catch (err) {
        logger.warn(`Cache DEL pattern failed for "${pattern}": ${err.message}`);
    }
}

/**
 * Cache-aside pattern helper: get from cache or execute and cache the result.
 * @param {string} key Cache key
 * @param {Function} fetchFn Async function to call on cache miss
 * @param {number} ttl Optional TTL in seconds
 * @returns Cached or freshly fetched value
 */
async function cacheGetOrSet(key, fetchFn, ttl = DEFAULT_TTL) {
    const cached = await cacheGet(key);
    if (cached !== null) return cached;

    const value = await fetchFn();
    if (value !== null && value !== undefined) {
        await cacheSet(key, value, ttl);
    }
    return value;
}

/**
 * Increment a counter in Redis (for rate limiting / counters).
 */
async function cacheIncr(key, ttl = 3600) {
    try {
        const count = await redis.incr(key);
        if (count === 1) {
            // Set TTL only when key is first created
            await redis.expire(key, ttl);
        }
        return count;
    } catch (err) {
        logger.warn(`Cache INCR failed for key "${key}": ${err.message}`);
        return 0;
    }
}

/**
 * Common cache key patterns (centralized to avoid typos)
 */
const cacheKeys = {
    productList: (query) => `products:list:${JSON.stringify(query)}`,
    productDetail: (slug) => `product:${slug}`,
    productFeatured: () => 'products:featured',
    productFilters: () => 'products:filters',
    categoryList: () => 'categories:list',
    trending: (limit) => `products:trending:${limit}`,
    userCart: (userId) => `cart:${userId}`,
    userNotifications: (userId) => `notifications:count:${userId}`,
    recommendations: (userId, strategy) => `recs:${userId}:${strategy}`,
};

module.exports = {
    cacheGet,
    cacheSet,
    cacheDel,
    cacheDelPattern,
    cacheGetOrSet,
    cacheIncr,
    cacheKeys,
};
