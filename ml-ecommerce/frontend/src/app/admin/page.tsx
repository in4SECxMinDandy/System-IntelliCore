'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  DollarSign, Package, Star, ArrowUp, ArrowDown,
  Loader2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

// Chart colors
const COLORS = ['#ea2a33', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType,
  icon: Icon 
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center mt-3">
          {changeType === 'increase' ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : changeType === 'decrease' ? (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          ) : null}
          <span className={cn(
            "text-sm font-medium",
            changeType === 'increase' ? 'text-green-500' : 
            changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
          )}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-400 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}

// Revenue Chart
function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea2a33" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ea2a33" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#ea2a33" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Orders Chart
function OrdersChart({ data }: { data: any[] }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Orders Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
          />
          <Bar dataKey="orders" fill="#ea2a33" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Category Distribution
function CategoryChart({ data }: { data: any[] }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Top Products Table
function TopProducts({ products }: { products: any[] }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Product</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Sales</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-dark-800">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{index + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{product.sales}</td>
                <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Recent Orders
function RecentOrders({ orders }: { orders: any[] }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.map((order, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">${order.total.toLocaleString()}</p>
              <span className={cn("text-xs px-2 py-1 rounded-full", statusColors[order.status])}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // Fetch analytics data
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data.data),
    // Mock data for demo
    queryFn: async () => ({
      stats: {
        revenue: 125430,
        revenueChange: 12.5,
        orders: 1847,
        ordersChange: 8.3,
        customers: 9234,
        customersChange: 15.2,
        avgOrderValue: 67.89,
        avgOrderValueChange: -2.1,
      },
      revenueChart: [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 5500 },
        { name: 'Jul', revenue: 7000 },
      ],
      ordersChart: [
        { name: 'Mon', orders: 24, completed: 20 },
        { name: 'Tue', orders: 35, completed: 30 },
        { name: 'Wed', orders: 28, completed: 25 },
        { name: 'Thu', orders: 42, completed: 38 },
        { name: 'Fri', orders: 55, completed: 48 },
        { name: 'Sat', orders: 38, completed: 35 },
        { name: 'Sun', orders: 22, completed: 20 },
      ],
      categoryChart: [
        { name: 'Electronics', value: 35 },
        { name: 'Fashion', value: 25 },
        { name: 'Home', value: 20 },
        { name: 'Sports', value: 10 },
        { name: 'Books', value: 5 },
        { name: 'Other', value: 5 },
      ],
      topProducts: [
        { name: 'Premium Headphones', sales: 234, revenue: 69966 },
        { name: 'Smart Watch Pro', sales: 189, revenue: 56611 },
        { name: 'Wireless Earbuds', sales: 156, revenue: 23344 },
        { name: 'Laptop Stand', sales: 123, revenue: 6147 },
        { name: 'USB-C Hub', sales: 98, revenue: 4802 },
      ],
      recentOrders: [
        { orderNumber: 'ORD-2024-001', customer: 'John Doe', total: 299.99, status: 'pending' },
        { orderNumber: 'ORD-2024-002', customer: 'Jane Smith', total: 149.99, status: 'processing' },
        { orderNumber: 'ORD-2024-003', customer: 'Bob Wilson', total: 89.99, status: 'shipped' },
        { orderNumber: 'ORD-2024-004', customer: 'Alice Brown', total: 459.99, status: 'delivered' },
        { orderNumber: 'ORD-2024-005', customer: 'Charlie Davis', total: 199.99, status: 'cancelled' },
      ],
    }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenueChangeType = stats.revenueChange >= 0 ? 'increase' : 'decrease';
  const ordersChangeType = stats.ordersChange >= 0 ? 'increase' : 'decrease';
  const customersChangeType = stats.customersChange >= 0 ? 'increase' : 'decrease';
  const avgOrderChangeType = stats.avgOrderValueChange >= 0 ? 'increase' : 'decrease';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.revenue?.toLocaleString() || 0}`}
            change={stats.revenueChange}
            changeType={revenueChangeType}
            icon={DollarSign}
          />
          <StatCard 
            title="Total Orders" 
            value={stats.orders?.toLocaleString() || 0}
            change={stats.ordersChange}
            changeType={ordersChangeType}
            icon={ShoppingCart}
          />
          <StatCard 
            title="Total Customers" 
            value={stats.customers?.toLocaleString() || 0}
            change={stats.customersChange}
            changeType={customersChangeType}
            icon={Users}
          />
          <StatCard 
            title="Avg Order Value" 
            value={`$${stats.avgOrderValue?.toFixed(2) || 0}`}
            change={stats.avgOrderValueChange}
            changeType={avgOrderChangeType}
            icon={Package}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart data={data?.revenueChart || []} />
          <OrdersChart data={data?.ordersChart || []} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CategoryChart data={data?.categoryChart || []} />
          <div className="lg:col-span-2">
            <TopProducts products={data?.topProducts || []} />
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={data?.recentOrders || []} />
      </div>
    </div>
  );
}
