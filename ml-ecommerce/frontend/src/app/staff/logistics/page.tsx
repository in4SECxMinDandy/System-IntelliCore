'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, Package, MapPin, Navigation, Clock, Search,
  CheckCircle, Phone, MessageSquare, ChevronRight
} from 'lucide-react';

const deliveryRoutes = [
  { id: 'RT-001', driver: 'John Doe', vehicle: 'Van ABC-123', orders: 12, status: 'in_transit', eta: '2:30 PM', distance: '45 km' },
  { id: 'RT-002', driver: 'Sarah Smith', vehicle: 'Van DEF-456', orders: 8, status: 'in_transit', eta: '3:15 PM', distance: '32 km' },
  { id: 'RT-003', driver: 'Mike Johnson', vehicle: 'Bike GHI-789', orders: 5, status: 'starting', eta: '4:00 PM', distance: '15 km' },
  { id: 'RT-004', driver: 'Emily Brown', vehicle: 'Van JKL-012', orders: 15, status: 'completed', eta: 'Done', distance: '0 km' },
];

const activeDeliveries = [
  { id: '#ORD-1234', customer: 'John Doe', address: '123 Main St, City', status: 'out_for_delivery', time: '10 min ago' },
  { id: '#ORD-1235', customer: 'Sarah Smith', address: '456 Oak Ave, Town', status: 'out_for_delivery', time: '25 min ago' },
  { id: '#ORD-1236', customer: 'Mike Johnson', address: '789 Pine Rd, Village', status: 'pending', time: '1 hour ago' },
  { id: '#ORD-1237', customer: 'Emily Brown', address: '321 Elm St, City', status: 'delivered', time: '2 hours ago' },
];

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-[#181411] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A100A] border-r border-[#393028] flex flex-col">
        <div className="p-4 border-b border-[#393028]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f27f0d] flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Logistics</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <Truck className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/staff/warehouse" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Warehouse</span>
          </Link>
          <Link href="/staff/logistics" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f27f0d] text-white">
            <Navigation className="w-5 h-5" />
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
            <h1 className="text-2xl font-bold text-white">Logistics Management</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#baab9c]" />
                <input
                  type="text"
                  placeholder="Search routes, drivers..."
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
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-xs text-[#baab9c]">Active Routes</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-[#baab9c]">Deliveries Today</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">45</p>
                  <p className="text-xs text-[#baab9c]">Avg Delivery Time</p>
                </div>
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-xs text-[#baab9c]">On-Time Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl w-fit">
            {['routes', 'deliveries', 'map'].map((tab) => (
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

          {/* Routes Table */}
          {activeTab === 'routes' && (
            <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#181411]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Route ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Driver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">ETA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Distance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393028]">
                  {deliveryRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-[#2D241B]/50">
                      <td className="px-4 py-3 text-white font-medium">{route.id}</td>
                      <td className="px-4 py-3 text-white">{route.driver}</td>
                      <td className="px-4 py-3 text-white">{route.vehicle}</td>
                      <td className="px-4 py-3 text-white">{route.orders}</td>
                      <td className="px-4 py-3 text-white">{route.eta}</td>
                      <td className="px-4 py-3 text-white">{route.distance}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          route.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
                          route.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {route.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Deliveries Table */}
          {activeTab === 'deliveries' && (
            <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#181411]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393028]">
                  {activeDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-[#2D241B]/50">
                      <td className="px-4 py-3 text-white font-medium">{delivery.id}</td>
                      <td className="px-4 py-3 text-white">{delivery.customer}</td>
                      <td className="px-4 py-3 text-white">{delivery.address}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          delivery.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          delivery.status === 'out_for_delivery' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">{delivery.time}</td>
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

          {/* Map Placeholder */}
          {activeTab === 'map' && (
            <div className="bg-[#221910] rounded-xl border border-[#393028] h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#baab9c] mx-auto mb-4" />
                <p className="text-[#baab9c]">Interactive map view coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
