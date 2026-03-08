// ==========================================
// Token Store — Redis-backed token storage
// Replaces in-memory Map() for production safety
// ==========================================

const { redis } = require('../config/redis');
const logger = require('../config/logger');

const PREFIX_RESET = 'pwd_reset:';
const PREFIX_LOCK = 'login_fail:';
const PREFIX_LOCK_TS = 'login_fail_first:';

// ==========================================
// Password Reset Token Store
// ==========================================

/**
 * Store a password reset token in Redis with TTL.
 * @param {string} userId
 * @param {string} tokenHash - SHA-256 hash of the reset token
 * @param {number} ttlSeconds - default 1 hour
 */
async function setResetToken(userId, tokenHash, ttlSeconds = 3600) {
    const key = `${PREFIX_RESET}${userId}`;
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify({ token: tokenHash, attempts: 0 }));
    } catch (err) {
        logger.error('tokenStore.setResetToken failed:', err);
        throw err;
    }
}

/**
 * Get stored reset token data.
 * @returns {Object|null} { token, attempts } or null
 */
async function getResetToken(userId) {
    const key = `${PREFIX_RESET}${userId}`;
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        logger.error('tokenStore.getResetToken failed:', err);
        return null;
    }
}

/**
 * Increment failed attempt count on a reset token.
 * @returns {number} new attempt count
 */
async function incrementResetAttempts(userId) {
    const key = `${PREFIX_RESET}${userId}`;
    try {
        const data = await redis.get(key);
        if (!data) return 0;
        const parsed = JSON.parse(data);
        parsed.attempts = (parsed.attempts || 0) + 1;
        const ttl = await redis.ttl(key);
        if (ttl > 0) {
            await redis.setex(key, ttl, JSON.stringify(parsed));
        }
        return parsed.attempts;
    } catch (err) {
        logger.error('tokenStore.incrementResetAttempts failed:', err);
        return 0;
    }
}

/**
 * Delete a reset token (after use or too many attempts).
 */
async function deleteResetToken(userId) {
    const key = `${PREFIX_RESET}${userId}`;
    try {
        await redis.del(key);
    } catch (err) {
        logger.error('tokenStore.deleteResetToken failed:', err);
    }
}

// ==========================================
// Login Lockout Store
// ==========================================

const LOCKOUT_CONFIG = {
    maxAttempts: 5,
    lockoutDuration: 900,  // 15 minutes
    windowDuration: 300,   // 5 minute window
};

/**
 * Record a failed login attempt.
 * @returns {number} total failed attempts in current window
 */
async function recordFailedAttempt(userId) {
    const countKey = `${PREFIX_LOCK}${userId}`;
    const tsKey = `${PREFIX_LOCK_TS}${userId}`;
    try {
        // Ensure first attempt timestamp exists
        const exists = await redis.exists(tsKey);
        if (!exists) {
            await redis.setex(tsKey, LOCKOUT_CONFIG.windowDuration, Date.now().toString());
        }

        const count = await redis.incr(countKey);
        // Set TTL on first increment
        if (count === 1) {
            await redis.expire(countKey, LOCKOUT_CONFIG.lockoutDuration);
        }
        return count;
    } catch (err) {
        logger.error('tokenStore.recordFailedAttempt failed:', err);
        return 0;
    }
}

/**
 * Check if account is locked.
 * @returns {{ locked: boolean, retryAfter: number }}
 */
async function isAccountLocked(userId) {
    const countKey = `${PREFIX_LOCK}${userId}`;
    try {
        const count = parseInt(await redis.get(countKey) || '0', 10);
        if (count >= LOCKOUT_CONFIG.maxAttempts) {
            const ttl = await redis.ttl(countKey);
            return { locked: true, retryAfter: ttl > 0 ? ttl : LOCKOUT_CONFIG.lockoutDuration };
        }
        return { locked: false, retryAfter: 0 };
    } catch (err) {
        logger.error('tokenStore.isAccountLocked failed:', err);
        return { locked: false, retryAfter: 0 };
    }
}

/**
 * Get remaining attempts before lockout.
 */
async function getRemainingAttempts(userId) {
    const countKey = `${PREFIX_LOCK}${userId}`;
    try {
        const count = parseInt(await redis.get(countKey) || '0', 10);
        return Math.max(0, LOCKOUT_CONFIG.maxAttempts - count);
    } catch {
        return LOCKOUT_CONFIG.maxAttempts;
    }
}

/**
 * Clear failed attempts on successful login.
 */
async function clearFailedAttempts(userId) {
    try {
        await redis.del(`${PREFIX_LOCK}${userId}`, `${PREFIX_LOCK_TS}${userId}`);
    } catch (err) {
        logger.error('tokenStore.clearFailedAttempts failed:', err);
    }
}

module.exports = {
    // Reset tokens
    setResetToken,
    getResetToken,
    incrementResetAttempts,
    deleteResetToken,
    // Login lockout
    recordFailedAttempt,
    isAccountLocked,
    getRemainingAttempts,
    clearFailedAttempts,
    LOCKOUT_CONFIG,
};
