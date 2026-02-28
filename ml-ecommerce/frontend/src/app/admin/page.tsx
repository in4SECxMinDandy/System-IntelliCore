'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, Users, ShoppingCart, BarChart3,
  Settings, Bell, Search, Menu, X, ChevronDown, LogOut,
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users2
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const stats = [
  { label: 'Total Revenue', value: '$124,563', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: ShoppingBag },
  { label: 'Total Customers', value: '8,547', change: '+15.3%', trend: 'up', icon: Users2 },
  { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: TrendingUp },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', products: 3, total: 159.99, status: 'completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Sarah Smith', products: 1, total: 89.99, status: 'processing', date: '2024-01-15' },
  { id: '#ORD-003', customer: 'Mike Johnson', products: 5, total: 299.99, status: 'pending', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'Emily Brown', products: 2, total: 75.50, status: 'completed', date: '2024-01-14' },
  { id: '#ORD-005', customer: 'David Wilson', products: 4, total: 189.99, status: 'shipped', date: '2024-01-13' },
];

const topProducts = [
  { name: 'Wireless Headphones', sales: 234, revenue: 23399.66 },
  { name: 'Smart Watch Pro', sales: 189, revenue: 37711.11 },
  { name: 'Bluetooth Speaker', sales: 156, revenue: 7798.44 },
  { name: 'Laptop Stand', sales: 134, revenue: 6693.32 },
  { name: 'USB-C Hub', sales: 123, revenue: 6137.07 },
];

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#181411] text-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1A100A] border-r border-[#393028] flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-[#393028]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f27f0d] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            {sidebarOpen && <span className="font-bold text-white">Admin Panel</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B] transition-colors"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#393028]">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-[#baab9c]">admin@mlmarket.com</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#1A100A] border-b border-[#393028] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors"
              >
                <Menu className="w-5 h-5 text-[#baab9c]" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#baab9c]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#221910] border border-[#393028] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d] w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
                <Bell className="w-5 h-5 text-[#baab9c]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#f27f0d] rounded-full"></span>
              </button>
              <Link href="/" className="flex items-center gap-2 text-sm text-[#baab9c] hover:text-white">
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-[#baab9c] mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f27f0d]/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#f27f0d]" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-[#baab9c] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-[#f27f0d] hover:text-white">View All</Link>
              </div>
              <div className="divide-y divide-[#393028]">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#2D241B]/50 transition-colors">
                    <div>
                      <p className="text-white font-medium">{order.id}</p>
                      <p className="text-sm text-[#baab9c]">{order.customer} • {order.products} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${order.total}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Top Products</h2>
                <Link href="/admin/products" className="text-sm text-[#f27f0d] hover:text-white">View All</Link>
              </div>
              <div className="divide-y divide-[#393028]">
                {topProducts.map((product, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-[#2D241B]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#2D241B] flex items-center justify-center text-xs text-[#baab9c]">
                        {i + 1}
                      </span>
                      <span className="text-white">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-[#baab9c]">{product.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
