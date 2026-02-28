// ==========================================
// Socket.io Handler — IntelliCore Ecommerce
// Real-time notifications and presence
// ==========================================

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient();

// Store connected users: userId -> socketId
const connectedUsers = new Map();
// Store socket -> userId mapping
const socketToUser = new Map();

function initializeSocketIO(server) {
  const { Server } = require('socket.io');
  
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        // Allow unauthenticated connections for public features
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(new Error('Unauthorized'));
      }

      socket.user = user;
      next();
    } catch (error) {
      // Allow connection but mark as unauthenticated
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Handle user authentication after connection
    socket.on('authenticate', async (userId) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, role: true },
        });

        if (user) {
          socket.user = user;
          connectedUsers.set(user.id, socket.id);
          socketToUser.set(socket.id, user.id);
          
          // Join user's personal room
          socket.join(`user:${user.id}`);
          
          logger.info(`User ${user.id} authenticated on socket ${socket.id}`);
          
          // Send unread notifications count
          const unreadCount = await prisma.notification.count({
            where: { userId: user.id, isRead: false },
          });
          
          socket.emit('notifications:unread-count', unreadCount);
        }
      } catch (error) {
        logger.error('Socket authentication error:', error);
      }
    });

    // Handle joining notification rooms
    socket.on('notifications:join', () => {
      if (socket.user) {
        socket.join(`user:${socket.user.id}`);
        logger.info(`User ${socket.user.id} joined notifications room`);
      }
    });

    // Handle leaving notification rooms
    socket.on('notifications:leave', () => {
      if (socket.user) {
        socket.leave(`user:${socket.user.id}`);
        logger.info(`User ${socket.user.id} left notifications room`);
      }
    });

    // Handle joining community rooms
    socket.on('community:join', (postId) => {
      socket.join(`community:${postId}`);
    });

    socket.on('community:leave', (postId) => {
      socket.leave(`community:${postId}`);
    });

    // Handle joining order tracking
    socket.on('order:join', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('order:leave', (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    // Handle typing indicator in community
    socket.on('community:typing', (data) => {
      const { postId, isTyping } = data;
      socket.to(`community:${postId}`).emit('community:user-typing', {
        userId: socket.user?.id,
        userName: socket.user?.fullName || 'Anonymous',
        isTyping,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      const userId = socketToUser.get(socket.id);
      if (userId) {
        connectedUsers.delete(userId);
        socketToUser.delete(socket.id);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error: ${socket.id}`, error);
    });
  });

  // Helper function to send notification to specific user
  io.sendToUser = async (userId, event, data) => {
    const socketId = connectedUsers.get(userId);
    
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
    
    // Also save to database for persistence
    await prisma.notification.create({
      data: {
        userId,
        type: data.type || 'system',
        title: data.title,
        message: data.message,
        data: data.payload || {},
        actionUrl: data.actionUrl,
      },
    });
  };

  // Helper function to send to all admins
  io.sendToAdmins = async (event, data) => {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['admin', 'superadmin'] }, isActive: true },
      select: { id: true },
    });

    for (const admin of admins) {
      await io.sendToUser(admin.id, event, data);
    }
  };

  // Helper function to broadcast to all connected users
  io.broadcast = (event, data) => {
    io.emit(event, data);
  };

  // Helper function to send to specific room
  io.sendToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
  };

  return io;
}

/**
 * Send real-time notification
 */
async function sendNotification(userId, notification) {
  // This will be attached to the HTTP server
  // Used by controllers to send notifications
  return prisma.notification.create({
    data: {
      userId,
      type: notification.type || 'system',
      title: notification.title,
      message: notification.message,
      data: notification.data || {},
      actionUrl: notification.actionUrl,
    },
  });
}

/**
 * Notify order status change
 */
async function notifyOrderStatusChange(orderId, status, userId) {
  const io = global.io;
  if (!io) return;

  // Send real-time update
  io.sendToRoom(`order:${orderId}`, 'order:status-changed', {
    orderId,
    status,
    updatedAt: new Date().toISOString(),
  });

  // Send notification
  await sendNotification(userId, {
    type: 'order',
    title: `Order Status Updated`,
    message: `Your order status has been changed to: ${status}`,
    actionUrl: `/orders/${orderId}`,
  });
}

/**
 * Notify new review
 */
async function notifyNewReview(productId, userId, reviewData) {
  const io = global.io;
  if (!io) return;

  // Notify product owner
  await sendNotification(userId, {
    type: 'review',
    title: 'New Review Received',
    message: `You have a new ${reviewData.rating}-star review`,
    actionUrl: `/products/${reviewData.productSlug}#reviews`,
  });

  // Broadcast to admins
  await io.sendToAdmins('review:new', {
    productId,
    rating: reviewData.rating,
    userId,
  });
}

/**
 * Notify community interaction
 */
async function notifyCommunityInteraction(postId, userId, type, data) {
  const io = global.io;
  if (!io) return;

  // Send to post's room
  io.sendToRoom(`community:${postId}`, `community:${type}`, {
    postId,
    userId,
    ...data,
  });
}

module.exports = {
  initializeSocketIO,
  sendNotification,
  notifyOrderStatusChange,
  notifyNewReview,
  notifyCommunityInteraction,
};
