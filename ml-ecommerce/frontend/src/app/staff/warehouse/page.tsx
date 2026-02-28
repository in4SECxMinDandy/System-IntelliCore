'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, Truck, MapPin, Clock, Search, Filter,
  CheckCircle, XCircle, AlertCircle, ChevronRight, User,
  Phone, MessageSquare, Star, Box
} from 'lucide-react';

const warehouseOrders = [
  { id: 'WH-001', orderId: '#ORD-1234', customer: 'John Doe', items: 3, status: 'processing', priority: 'high', location: 'A-12-3', date: '2024-01-15' },
  { id: 'WH-002', orderId: '#ORD-1235', customer: 'Sarah Smith', items: 1, status: 'ready', priority: 'normal', location: 'B-05-1', date: '2024-01-15' },
  { id: 'WH-003', orderId: '#ORD-1236', customer: 'Mike Johnson', items: 5, status: 'processing', priority: 'low', location: 'C-08-2', date: '2024-01-14' },
  { id: 'WH-004', orderId: '#ORD-1237', customer: 'Emily Brown', items: 2, status: 'packed', priority: 'high', location: 'A-03-4', date: '2024-01-14' },
  { id: 'WH-005', orderId: '#ORD-1238', customer: 'David Wilson', items: 4, status: 'processing', priority: 'normal', location: 'B-11-2', date: '2024-01-13' },
];

const inventoryItems = [
  { sku: 'SKU-001', name: 'Wireless Headphones', stock: 145, lowStock: false, location: 'A-12', category: 'Electronics' },
  { sku: 'SKU-002', name: 'Smart Watch Pro', stock: 23, lowStock: true, location: 'A-08', category: 'Electronics' },
  { sku: 'SKU-003', name: 'Bluetooth Speaker', stock: 89, lowStock: false, location: 'B-05', category: 'Electronics' },
  { sku: 'SKU-004', name: 'USB-C Cable', stock: 8, lowStock: true, location: 'C-01', category: 'Accessories' },
  { sku: 'SKU-005', name: 'Laptop Stand', stock: 67, lowStock: false, location: 'B-11', category: 'Accessories' },
];

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-[#181411] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A100A] border-r border-[#393028] flex flex-col">
        <div className="p-4 border-b border-[#393028]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f27f0d] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Warehouse</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/staff/warehouse" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f27f0d] text-white">
            <Box className="w-5 h-5" />
            <span className="text-sm font-medium">Inventory</span>
          </Link>
          <Link href="/staff/logistics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <Truck className="w-5 h-5" />
            <span className="text-sm font-medium">Logistics</span>
          </Link>
          <Link href="/staff/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Support</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 bg-[#1A100A] border-b border-[#393028] px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Warehouse Management</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#baab9c]" />
                <input
                  type="text"
                  placeholder="Search orders, items..."
                  className="bg-[#221910] border border-[#393028] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d] w-64"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-xs text-[#baab9c]">Processing</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-[#baab9c]">Ready to Ship</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-[#baab9c]">Low Stock</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2,547</p>
                  <p className="text-xs text-[#baab9c]">Total Items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl w-fit">
            {['orders', 'inventory'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#f27f0d] text-white' 
                    : 'text-[#baab9c] hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {activeTab === 'orders' && (
            <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#181411]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393028]">
                  {warehouseOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#2D241B]/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{order.orderId}</p>
                          <p className="text-xs text-[#baab9c]">{order.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{order.customer}</td>
                      <td className="px-4 py-3 text-white">{order.items}</td>
                      <td className="px-4 py-3 text-white">{order.location}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'packed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          order.priority === 'normal' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[#f27f0d] hover:text-white">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Inventory Table */}
          {activeTab === 'inventory' && (
            <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#181411]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Product Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393028]">
                  {inventoryItems.map((item) => (
                    <tr key={item.sku} className="hover:bg-[#2D241B]/50">
                      <td className="px-4 py-3 text-white font-medium">{item.sku}</td>
                      <td className="px-4 py-3 text-white">{item.name}</td>
                      <td className="px-4 py-3 text-white">{item.stock}</td>
                      <td className="px-4 py-3 text-white">{item.location}</td>
                      <td className="px-4 py-3 text-white">{item.category}</td>
                      <td className="px-4 py-3">
                        {item.lowStock ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Low Stock</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">In Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
