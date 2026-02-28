'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, Package, Star,
  AlertTriangle, Activity, BarChart2, Settings, ChevronRight,
  ArrowUpRight, ArrowDownRight, Eye, RefreshCw, Database,
  Shield, Bell, Cpu, Globe
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '@/lib/api';
import { formatPrice, formatNumber, formatDate } from '@/lib/utils';

const COLORS = ['#3b82f6', '#d946ef', '#22c55e', '#f59e0b', '#ef4444'];

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 320 },
  { month: 'Feb', revenue: 52000, orders: 380 },
  { month: 'Mar', revenue: 48000, orders: 350 },
  { month: 'Apr', revenue: 61000, orders: 420 },
  { month: 'May', revenue: 55000, orders: 390 },
  { month: 'Jun', revenue: 67000, orders: 460 },
  { month: 'Jul', revenue: 72000, orders: 510 },
  { month: 'Aug', revenue: 69000, orders: 490 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Sports', value: 12 },
  { name: 'Other', value: 8 },
];

function MetricCard({ icon: Icon, label, value, change, changeType, color, href }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down';
  color: string;
  href?: string;
}) {
  const content = (
    <div className="card p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

const adminNavItems = [
  { icon: BarChart2, label: 'Analytics', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
  { icon: Database, label: 'Inventory', href: '/admin/inventory' },
  { icon: Cpu, label: 'ML Models', href: '/admin/ml' },
  { icon: Globe, label: 'Integrations', href: '/admin/integrations' },
  { icon: Shield, label: 'Security', href: '/admin/security' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders'>('revenue');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data.data),
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'superadmin'),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin', 'orders', 'recent'],
    queryFn: () => api.get('/admin/orders?limit=10&sort=newest').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: () => api.get('/admin/inventory/low-stock').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-dark-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Admin Panel</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">IntelliCore Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-item ${href === '/admin' ? 'sidebar-item-active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {formatDate(new Date())} · Real-time data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-outline btn-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link href="/admin/settings" className="btn-primary btn-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatPrice(analytics?.totalRevenue || 469000)}
              change="12.5%"
              changeType="up"
              color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              href="/admin/analytics"
            />
            <MetricCard
              icon={ShoppingBag}
              label="Total Orders"
              value={formatNumber(analytics?.totalOrders || 3420)}
              change="8.2%"
              changeType="up"
              color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              href="/admin/orders"
            />
            <MetricCard
              icon={Users}
              label="Active Users"
              value={formatNumber(analytics?.activeUsers || 12840)}
              change="3.1%"
              changeType="up"
              color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
              href="/admin/users"
            />
            <MetricCard
              icon={Package}
              label="Products"
              value={formatNumber(analytics?.totalProducts || 50240)}
              change="2.4%"
              changeType="down"
              color="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              href="/admin/products"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Revenue & Orders</h3>
                <div className="flex gap-2">
                  {(['revenue', 'orders'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        activeTab === tab
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => activeTab === 'revenue' ? formatPrice(value) : value}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeTab}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-6">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h3>
                <Link href="/admin/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recentOrders?.items || Array.from({ length: 5 }, (_, i) => ({
                      id: `order-${i}`,
                      orderNumber: `ORD-${1000 + i}`,
                      user: { fullName: `Customer ${i + 1}` },
                      totalAmount: Math.random() * 500 + 50,
                      status: ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
                    }))).slice(0, 5).map((order: {
                      id: string;
                      orderNumber: string;
                      user?: { fullName?: string };
                      totalAmount: number;
                      status: string;
                    }) => (
                      <tr key={order.id}>
                        <td className="font-medium text-primary-600 dark:text-primary-400">#{order.orderNumber}</td>
                        <td>{order.user?.fullName || 'Guest'}</td>
                        <td className="font-medium">{formatPrice(order.totalAmount)}</td>
                        <td>
                          <span className={`badge text-xs ${
                            order.status === 'delivered' ? 'badge-success' :
                            order.status === 'shipped' ? 'badge-primary' :
                            order.status === 'cancelled' ? 'badge-danger' :
                            'badge-warning'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Low Stock Alert
                </h3>
                <Link href="/admin/inventory" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Manage <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {(lowStockProducts || Array.from({ length: 5 }, (_, i) => ({
                  id: `prod-${i}`,
                  name: `Product ${i + 1}`,
                  stockQuantity: Math.floor(Math.random() * 5),
                  sku: `SKU-${1000 + i}`,
                }))).slice(0, 5).map((product: {
                  id: string;
                  name: string;
                  stockQuantity: number;
                  sku?: string;
                }) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{product.stockQuantity} left</p>
                      <Link href={`/admin/inventory/${product.id}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="mt-6 card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              System Health
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'API Response', value: '45ms', status: 'good', icon: Cpu },
                { label: 'DB Queries', value: '12ms', status: 'good', icon: Database },
                { label: 'ML Service', value: '98.9%', status: 'good', icon: TrendingUp },
                { label: 'Error Rate', value: '0.02%', status: 'good', icon: Shield },
              ].map(({ label, value, status, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
