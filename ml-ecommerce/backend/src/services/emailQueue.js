// ==========================================
// Email Queue Service using BullMQ (Phase 1.3)
// Async email dispatch — non-blocking main thread
// ==========================================

const { Queue, Worker } = require('bullmq');
const emailService = require('./emailService');
const logger = require('../config/logger');
const { redis } = require('../config/redis');

const QUEUE_NAME = 'email-queue';

// ==========================================
// Queue definition
// ==========================================
const emailQueue = new Queue(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,               // Retry up to 3 times
        backoff: {
            type: 'exponential',
            delay: 2000,             // 2s, 4s, 8s
        },
        removeOnComplete: 100,     // Keep last 100 completed jobs
        removeOnFail: 50,          // Keep last 50 failed jobs
    },
});

// ==========================================
// Worker — processes queued emails
// ==========================================
let worker;

function startWorker() {
    worker = new Worker(
        QUEUE_NAME,
        async (job) => {
            const { type, to, data } = job.data;
            logger.info(`📧 Processing email job: ${type} → ${to}`);

            switch (type) {
                case 'welcome':
                    await emailService.sendWelcomeEmail(to, data);
                    break;
                case 'password_reset':
                    await emailService.sendPasswordReset(to, data);
                    break;
                case 'order_confirmation':
                    await emailService.sendOrderConfirmation(to, data);
                    break;
                case 'order_shipped':
                    await emailService.sendOrderShipped(to, data);
                    break;
                case 'order_delivered':
                    await emailService.sendOrderDelivered(to, data);
                    break;
                case 'refund_processed':
                    await emailService.sendRefundProcessed(to, data);
                    break;
                case 'email_verification':
                    await emailService.sendVerificationEmail(to, data);
                    break;
                case 'low_stock_alert':
                    await emailService.sendLowStockAlert(to, data);
                    break;
                default:
                    logger.warn(`⚠️ Unknown email type: ${type}`);
            }
        },
        {
            connection: redis,
            concurrency: 5,  // Process up to 5 emails in parallel
        }
    );

    worker.on('completed', (job) => {
        logger.info(`✅ Email sent: ${job.data.type} → ${job.data.to} (job #${job.id})`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`❌ Email failed: ${job?.data?.type} → ${job?.data?.to}: ${err.message}`);
    });

    worker.on('error', (err) => {
        logger.error(`Email worker error: ${err.message}`);
    });

    logger.info('📬 Email queue worker started');
    return worker;
}

// ==========================================
// Queue Helper Methods
// ==========================================

/**
 * Queue a welcome email (non-blocking)
 */
const sendWelcome = (to, data) =>
    emailQueue.add('welcome', { type: 'welcome', to, data }, { priority: 5 });

/**
 * Queue a password reset email (high priority)
 */
const sendPasswordReset = (to, data) =>
    emailQueue.add('password_reset', { type: 'password_reset', to, data }, { priority: 1 });

/**
 * Queue an order confirmation email
 */
const sendOrderConfirmation = (to, data) =>
    emailQueue.add('order_confirmation', { type: 'order_confirmation', to, data }, { priority: 3 });

/**
 * Queue an order shipped email
 */
const sendOrderShipped = (to, data) =>
    emailQueue.add('order_shipped', { type: 'order_shipped', to, data }, { priority: 3 });

/**
 * Queue an order delivered email
 */
const sendOrderDelivered = (to, data) =>
    emailQueue.add('order_delivered', { type: 'order_delivered', to, data }, { priority: 4 });

/**
 * Queue a refund processed email (high priority)
 */
const sendRefundProcessed = (to, data) =>
    emailQueue.add('refund_processed', { type: 'refund_processed', to, data }, { priority: 2 });

/**
 * Queue an email verification email (high priority)
 */
const sendEmailVerification = (to, data) =>
    emailQueue.add('email_verification', { type: 'email_verification', to, data }, { priority: 1 });

/**
 * Queue a low stock alert for admins
 */
const sendLowStockAlert = (to, data) =>
    emailQueue.add('low_stock_alert', { type: 'low_stock_alert', to, data }, { priority: 5 });

/**
 * Get queue metrics (for admin dashboard)
 */
const getQueueStats = async () => {
    const [waiting, active, completed, failed] = await Promise.all([
        emailQueue.getWaitingCount(),
        emailQueue.getActiveCount(),
        emailQueue.getCompletedCount(),
        emailQueue.getFailedCount(),
    ]);
    return { waiting, active, completed, failed };
};

/**
 * Graceful shutdown
 */
const shutdown = async () => {
    logger.info('📬 Shutting down email queue...');
    await worker?.close();
    await emailQueue.close();
};

module.exports = {
    emailQueue,
    startWorker,
    shutdown,
    // Helper methods
    sendWelcome,
    sendPasswordReset,
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderDelivered,
    sendRefundProcessed,
    sendEmailVerification,
    sendLowStockAlert,
    getQueueStats,
};
