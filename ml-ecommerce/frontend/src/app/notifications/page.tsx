'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Package, Heart, MessageSquare, Tag, Trophy, Check, Trash2, Settings, Filter } from 'lucide-react';
import api from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

const notificationTypes = {
  order: { icon: Package, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  wishlist: { icon: Heart, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
  review: { icon: MessageSquare, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  deal: { icon: Tag, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
  community: { icon: Trophy, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
  system: { icon: Bell, color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20' },
};

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped! 📦',
    message: 'Your order #ORD-1234 has been shipped and is on its way.',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/orders/1',
    actionLabel: 'Track Order',
  },
  {
    id: '2',
    type: 'deal',
    title: 'Flash Sale Alert! ⚡',
    message: 'Items in your wishlist are now 30% off. Limited time only!',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/deals',
    actionLabel: 'View Deals',
  },
  {
    id: '3',
    type: 'community',
    title: 'Challenge Winner! 🏆',
    message: 'Congratulations! You placed 3rd in the Budget Gamer Challenge.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/community/challenges',
    actionLabel: 'View Results',
  },
  {
    id: '4',
    type: 'review',
    title: 'Review Helpful',
    message: '24 people found your review of Sony WH-1000XM5 helpful.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/profile/reviews',
    actionLabel: 'View Review',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Delivered ✅',
    message: 'Your order #ORD-1230 has been delivered. How was your experience?',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/orders/5',
    actionLabel: 'Leave Review',
  },
  {
    id: '6',
    type: 'wishlist',
    title: 'Back in Stock!',
    message: 'Apple AirPods Pro (2nd Gen) from your wishlist is back in stock.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/products/apple-airpods-pro',
    actionLabel: 'Buy Now',
  },
  {
    id: '7',
    type: 'system',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows. Was this you?',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/profile/security',
    actionLabel: 'Review Activity',
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.isRead) return false;
    if (selectedType !== 'all' && n.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
            {unreadCount > 0 && (
              <span className="badge-primary text-sm">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Stay updated on your orders, deals, and community activity</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-outline btn-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button className="btn-ghost btn-sm p-2">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Read/Unread Toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-dark-800 rounded-lg">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                filter === f
                  ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {f === 'all' ? 'All' : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'order', 'deal', 'community', 'review', 'wishlist', 'system'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                selectedType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-300 dark:text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications to show</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map(notification => {
            const typeConfig = notificationTypes[notification.type as keyof typeof notificationTypes] || notificationTypes.system;
            const Icon = typeConfig.icon;

            return (
              <div
                key={notification.id}
                className={cn(
                  'card p-4 transition-all duration-200',
                  !notification.isRead && 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/5'
                )}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeConfig.color)}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn(
                          'text-sm font-semibold',
                          !notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              {notification.actionLabel} →
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markRead(notification.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Preferences */}
      <div className="mt-8 card p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Order updates', desc: 'Shipping, delivery, and order status changes', enabled: true },
            { label: 'Flash deals & offers', desc: 'Limited-time deals on products you love', enabled: true },
            { label: 'Community activity', desc: 'Replies, likes, and challenge updates', enabled: true },
            { label: 'Price drops', desc: 'When wishlist items go on sale', enabled: false },
            { label: 'Back in stock', desc: 'When out-of-stock items are available', enabled: true },
            { label: 'Security alerts', desc: 'Login attempts and account changes', enabled: true },
          ].map(({ label, desc, enabled }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              <button
                className={cn(
                  'relative w-10 h-5 rounded-full transition-colors',
                  enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-600'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                  enabled ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
