'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  User, Package, MapPin, Bell, Heart, CreditCard, 
  Settings, LogOut, ChevronRight, Wallet, Gift,
  Star, Clock, Truck, Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) setForm({ fullName: user.fullName || '', phone: '' });
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data || []);
    } catch {}
  };

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setUser(data.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'vouchers', label: 'Vouchers', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f27f0d] flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-bold text-white">ML Market</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 rounded-lg hover:bg-[#2D241B]">
              <Package className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-4 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#393028] mb-4">
                <div className="w-16 h-16 rounded-full bg-[#f27f0d] flex items-center justify-center text-2xl font-bold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.fullName || 'User'}</p>
                  <p className="text-sm text-[#baab9c]">{user?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      tab === item.id
                        ? 'bg-[#f27f0d] text-white'
                        : 'text-[#baab9c] hover:text-white hover:bg-[#2D241B]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Overview Tab */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
                    <Package className="w-6 h-6 text-[#f27f0d] mb-2" />
                    <p className="text-2xl font-bold text-white">12</p>
                    <p className="text-sm text-[#baab9c]">Total Orders</p>
                  </div>
                  <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
                    <Heart className="w-6 h-6 text-[#f27f0d] mb-2" />
                    <p className="text-2xl font-bold text-white">8</p>
                    <p className="text-sm text-[#baab9c]">Wishlist</p>
                  </div>
                  <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
                    <Gift className="w-6 h-6 text-[#f27f0d] mb-2" />
                    <p className="text-2xl font-bold text-white">5</p>
                    <p className="text-sm text-[#baab9c]">Vouchers</p>
                  </div>
                  <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
                    <Star className="w-6 h-6 text-[#f27f0d] mb-2" />
                    <p className="text-2xl font-bold text-white">4.8</p>
                    <p className="text-sm text-[#baab9c]">Avg Rating</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/orders" className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8 text-[#f27f0d]" />
                      <div>
                        <p className="font-medium text-white">Recent Orders</p>
                        <p className="text-sm text-[#baab9c]">View your order history</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#baab9c]" />
                  </Link>
                  <Link href="/wallet" className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Wallet className="w-8 h-8 text-[#f27f0d]" />
                      <div>
                        <p className="font-medium text-white">Digital Wallet</p>
                        <p className="text-sm text-[#baab9c]">Manage your funds</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#baab9c]" />
                  </Link>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-[#baab9c] mb-2">Email</label>
                    <input 
                      value={user?.email || ''} 
                      disabled 
                      className="w-full bg-[#181411] border border-[#393028] rounded-lg px-4 py-2.5 text-[#baab9c]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                    <input
                      value={form.fullName}
                      onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full bg-[#181411] border border-[#393028] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#f27f0d]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone</label>
                    <input
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-[#181411] border border-[#393028] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#f27f0d]"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-[#f27f0d] text-white px-6 py-2.5 rounded-lg hover:bg-[#d16b08] disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="bg-[#221910] rounded-xl border border-[#393028] p-8 text-center">
                    <Package className="w-12 h-12 text-[#393028] mx-auto mb-4" />
                    <p className="text-[#baab9c]">No orders yet</p>
                    <Link href="/products" className="inline-block mt-4 text-[#f27f0d] hover:text-white">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="bg-[#221910] rounded-xl border border-[#393028] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-white">{order.orderId || `#ORD-${order.id}`}</p>
                            <p className="text-sm text-[#baab9c]">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[#f27f0d] font-medium">{order.total} VND</p>
                          <Link href={`/orders/${order.id}`} className="text-sm text-[#f27f0d] hover:text-white">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {tab === 'wishlist' && (
              <div className="bg-[#221910] rounded-xl border border-[#393028] p-8 text-center">
                <Heart className="w-12 h-12 text-[#393028] mx-auto mb-4" />
                <p className="text-[#baab9c]">Your wishlist is empty</p>
                <Link href="/products" className="inline-block mt-4 text-[#f27f0d] hover:text-white">
                  Browse Products
                </Link>
              </div>
            )}

            {/* Wallet Tab */}
            {tab === 'wallet' && (
              <Link href="/wallet" className="block">
                <div className="bg-gradient-to-r from-[#f27f0d] to-[#d16b08] rounded-xl p-6">
                  <p className="text-white/80 text-sm">Balance</p>
                  <p className="text-4xl font-bold text-white mt-2">2,545,500 VND</p>
                  <div className="flex items-center gap-1 mt-2 text-white/80 text-sm">
                    <Truck className="w-4 h-4" />
                    <span>+12.5% this month</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Vouchers Tab */}
            {tab === 'vouchers' && (
              <Link href="/vouchers" className="block bg-[#221910] rounded-xl border border-[#393028] p-8 text-center hover:border-[#f27f0d] transition-colors">
                <Gift className="w-12 h-12 text-[#f27f0d] mx-auto mb-4" />
                <p className="text-white font-medium">You have 5 vouchers</p>
                <p className="text-sm text-[#baab9c] mt-2">View all vouchers</p>
              </Link>
            )}

            {/* Settings Tab */}
            {tab === 'settings' && (
              <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Notifications', desc: 'Manage notification preferences' },
                    { label: 'Privacy', desc: 'Privacy and security settings' },
                    { label: 'Help Center', desc: 'Get help and support' },
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-4 bg-[#181411] rounded-lg hover:bg-[#2D241B] transition-colors">
                      <div className="text-left">
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-[#baab9c]">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#baab9c]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
