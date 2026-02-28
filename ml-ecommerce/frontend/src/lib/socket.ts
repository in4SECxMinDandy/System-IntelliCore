// ==========================================
// Socket.io Client — IntelliCore Frontend
// Real-time notifications and events
// ==========================================

import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  joinNotifications: () => void;
  leaveNotifications: () => void;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinCommunityRoom: (postId: string) => void;
  leaveCommunityRoom: (postId: string) => void;
  setUnreadCount: (count: number) => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  unreadCount: 0,

  connect: (userId: string, token: string) => {
    const { socket: existingSocket } = get();
    
    // Already connected
    if (existingSocket?.connected) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      set({ isConnected: true });
      
      // Authenticate user
      socket.emit('authenticate', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      set({ isConnected: false });
    });

    // Notification events
    socket.on('notifications:unread-count', (count: number) => {
      set({ unreadCount: count });
    });

    socket.on('notification:new', (notification: any) => {
      set((state) => ({ 
        unreadCount: state.unreadCount + 1 
      }));
      
      // Show browser notification if permitted
      if (typeof window !== 'undefined' && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    // Order status updates
    socket.on('order:status-changed', (data: any) => {
      console.log('Order status changed:', data);
      // Could trigger a toast or update order state
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('order-status-update', { detail: data }));
      }
    });

    // Community events
    socket.on('community:new-comment', (data: any) => {
      console.log('New comment:', data);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('community-new-comment', { detail: data }));
      }
    });

    socket.on('community:new-like', (data: any) => {
      console.log('New like:', data);
    });

    socket.on('community:user-typing', (data: any) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('community-typing', { detail: data }));
      }
    });

    // Chatbot
    socket.on('chatbot:response', (data: any) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chatbot-response', { detail: data }));
      }
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinNotifications: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('notifications:join');
    }
  },

  leaveNotifications: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('notifications:leave');
    }
  },

  joinOrderRoom: (orderId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('order:join', orderId);
    }
  },

  leaveOrderRoom: (orderId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('order:leave', orderId);
    }
  },

  joinCommunityRoom: (postId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('community:join', postId);
    }
  },

  leaveCommunityRoom: (postId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('community:leave', postId);
    }
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },
}));

// ==========================================
// Hook for using socket in components
// ==========================================

import { useEffect } from 'react';

export function useSocket(userId: string | null, token: string | null) {
  const { connect, disconnect, isConnected } = useSocketStore();

  useEffect(() => {
    if (userId && token) {
      connect(userId, token);
    }

    return () => {
      disconnect();
    };
  }, [userId, token, connect, disconnect]);

  return { isConnected };
}

// ==========================================
// Request browser notification permission
// ==========================================

export function requestNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}
