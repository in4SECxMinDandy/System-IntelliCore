'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Heart, Star, TrendingUp, Package, Bell,
  ChevronRight, Award, Users, Zap, Clock, MapPin, Settings
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/dashboard');
  }, [isAuthenticated, router]);

  const { data: orders } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => api.get('/orders?limit=5').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', 'for-you'],
    queryFn: () => api.get('/recommendations/for-you').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: () => api.get('/notifications?limit=5').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const orderStats = {
    total: orders?.total || 0,
    pending: orders?.items?.filter((o: { status: string }) => o.status === 'pending').length || 0,
    delivered: orders?.items?.filter((o: { status: string }) => o.status === 'delivered').length || 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xl font-bold shadow-glow">
            {getInitials(user?.fullName || 'User')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Here's what's happening with your account
            </p>
          </div>
        </div>
        <Link href="/profile" className="btn-outline btn-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orderStats.total}
          change="+2 this month"
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Package}
          label="Pending Orders"
          value={orderStats.pending}
          color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          icon={Heart}
          label="Wishlist Items"
          value={wishlist?.length || 0}
          color="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={Award}
          label="Loyalty Points"
          value="1,240"
          change="+120 pts"
          color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {orders?.items?.length > 0 ? (
            <div className="space-y-3">
              {orders.items.slice(0, 5).map((order: {
                id: string;
                orderNumber: string;
                status: string;
                totalAmount: number;
                createdAt: string;
                orderItems: { productImage?: string; productName?: string }[];
              }) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-dark-700 overflow-hidden shrink-0">
                    {order.orderItems?.[0]?.productImage ? (
                      <img src={order.orderItems[0].productImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)} · {order.orderItems?.length} item(s)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'delivered' ? 'badge-success' :
                      order.status === 'shipped' ? 'badge-primary' :
                      order.status === 'cancelled' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-dark-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet</p>
              <Link href="/products" className="btn-primary btn-sm mt-3 inline-flex">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h2>
              <Link href="/notifications" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </Link>
            </div>
            {notifications?.items?.length > 0 ? (
              <div className="space-y-3">
                {notifications.items.slice(0, 4).map((notif: {
                  id: string;
                  title?: string;
                  message?: string;
                  isRead: boolean;
                  createdAt: string;
                }) => (
                  <div key={notif.id} className={`flex gap-3 p-2 rounded-lg ${!notif.isRead ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.isRead ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'}`} />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{notif.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No notifications</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: Heart, label: 'My Wishlist', href: '/wishlist', count: wishlist?.length },
                { icon: MapPin, label: 'Addresses', href: '/profile/addresses' },
                { icon: Star, label: 'My Reviews', href: '/profile/reviews' },
                { icon: Users, label: 'Community', href: '/community' },
                { icon: Zap, label: 'Deals & Offers', href: '/deals' },
              ].map(({ icon: Icon, label, href, count }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {count !== undefined && (
                      <span className="badge-gray text-xs">{count}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-dark-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Recommended For You
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Based on your browsing history</p>
            </div>
            <Link href="/products" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recommendations.slice(0, 5).map((product: Parameters<typeof ProductCard>[0]['product']) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
