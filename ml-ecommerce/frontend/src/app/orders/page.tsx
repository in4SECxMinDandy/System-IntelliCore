'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag, Package, Truck, CheckCircle, Clock,
    XCircle, ChevronDown, RotateCcw, MapPin, Loader2, AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product?: { name: string; imageUrl?: string };
}

interface Order {
    id: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

const TABS: { label: string; value: OrderStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'To Pay', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Completed', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
    pending: { label: 'Pending Payment', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    processing: { label: 'Processing', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
    delivered: { label: 'Completed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState<OrderStatus>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        fetchOrders(1, true);
    }, [isAuthenticated, activeTab]);

    const fetchOrders = async (p: number, reset = false) => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page: p, limit: 10 };
            if (activeTab !== 'all') params.status = activeTab;
            const { data } = await api.get('/orders', { params });
            const fetched: Order[] = data.data?.orders || data.data || [];
            setOrders(prev => reset ? fetched : [...prev, ...fetched]);
            setHasMore(fetched.length === 10);
            setPage(p);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusMeta = (status: string) => STATUS_META[status] || STATUS_META['processing'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#181411]">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">

                {/* Sidebar */}
                <aside className="hidden lg:flex w-60 flex-col gap-4 shrink-0">
                    <div className="bg-white dark:bg-[#221910] rounded-xl p-5 border border-gray-200 dark:border-[#393028] shadow-sm">
                        <nav className="flex flex-col gap-1">
                            {[
                                { icon: '👤', label: 'My Profile', href: '/profile' },
                                { icon: '🛍️', label: 'My Orders', href: '/orders', active: true },
                                { icon: '❤️', label: 'Wishlist', href: '/wishlist' },
                                { icon: '💳', label: 'Payment Methods', href: '/profile' },
                                { icon: '📍', label: 'Address Book', href: '/profile' },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active
                                            ? 'bg-primary-50 dark:bg-[#f27f0d]/10 text-primary-600 dark:text-[#f27f0d] font-bold'
                                            : 'text-gray-500 dark:text-[#baab9c] hover:bg-gray-100 dark:hover:bg-[#393028] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 flex flex-col gap-6 min-w-0">
                    {/* Header */}
                    <div>
                        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-[#baab9c] mb-2">
                            <Link href="/" className="hover:text-primary-600 dark:hover:text-[#f27f0d]">Home</Link>
                            <span>/</span>
                            <span className="text-primary-600 dark:text-[#f27f0d] font-medium">My Orders</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Orders</h1>
                        <p className="text-gray-500 dark:text-[#baab9c] mt-1">Track, return, or buy things again.</p>
                    </div>

                    {/* Tabs */}
                    <div className="w-full overflow-x-auto border-b border-gray-200 dark:border-[#393028]">
                        <div className="flex min-w-max gap-6">
                            {TABS.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.value
                                            ? 'border-primary-600 dark:border-[#f27f0d] text-primary-600 dark:text-[#f27f0d] font-bold'
                                            : 'border-transparent text-gray-500 dark:text-[#baab9c] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order List */}
                    {loading && orders.length === 0 ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500 dark:text-[#f27f0d]" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#221910] flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-[#baab9c]" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No orders found</h3>
                            <p className="text-gray-500 dark:text-[#baab9c] mb-6">
                                {activeTab === 'all' ? "You haven't placed any orders yet." : `No ${activeTab} orders.`}
                            </p>
                            <Link href="/products" className="btn-primary btn-md">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {orders.map(order => {
                                const meta = getStatusMeta(order.status);
                                const StatusIcon = meta.icon;
                                const firstItem = order.items?.[0];
                                const extraCount = (order.items?.length || 0) - 1;
                                const isActive = ['processing', 'shipped'].includes(order.status);

                                return (
                                    <div
                                        key={order.id}
                                        className={`bg-white dark:bg-[#221910] rounded-xl border overflow-hidden transition-all ${isActive
                                                ? 'border-primary-400/50 dark:border-[#f27f0d]/40 shadow-[0_0_15px_-3px_rgba(242,127,13,0.15)]'
                                                : 'border-gray-200 dark:border-[#393028] hover:border-primary-300/40 dark:hover:border-[#f27f0d]/20'
                                            } ${order.status === 'delivered' ? 'opacity-80 hover:opacity-100' : ''}`}
                                    >
                                        {/* Card Header */}
                                        <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-gray-50 dark:bg-[#181411]/60 border-b border-gray-100 dark:border-[#393028] gap-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${meta.color} ${meta.bg} ${meta.border}`}>
                                                    {meta.label}
                                                </span>
                                                <span className="text-gray-400 dark:text-[#baab9c] text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-gray-300 dark:text-[#393028] hidden sm:block">•</span>
                                                <span className="text-gray-400 dark:text-[#baab9c] text-sm hidden sm:block">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <div className="flex items-center gap-1.5 text-[#f27f0d] text-sm font-medium">
                                                    <Truck className="w-4 h-4 animate-pulse" />
                                                    <span>In transit</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex flex-col sm:flex-row gap-5">
                                            {/* Product image + info */}
                                            <div className="flex gap-4 flex-1 min-w-0">
                                                <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-[#181411] border border-gray-200 dark:border-[#393028] overflow-hidden shrink-0">
                                                    {firstItem?.product?.imageUrl ? (
                                                        <img src={firstItem.product.imageUrl} alt={firstItem.product?.name} className={`w-full h-full object-cover ${order.status === 'delivered' ? 'grayscale hover:grayscale-0 transition-all' : ''}`} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-gray-400 dark:text-[#baab9c]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <h4 className="text-gray-900 dark:text-white font-bold text-base mb-0.5 line-clamp-1">
                                                            {firstItem?.product?.name || 'Order Items'}
                                                        </h4>
                                                        {extraCount > 0 && (
                                                            <p className="text-gray-400 dark:text-[#baab9c] text-xs">+ {extraCount} more item{extraCount > 1 ? 's' : ''}</p>
                                                        )}
                                                        <p className="text-gray-500 dark:text-[#baab9c] text-sm mt-0.5">
                                                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {formatPrice(order.totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col justify-center gap-2 sm:w-44 shrink-0">
                                                {['shipped', 'processing'].includes(order.status) ? (
                                                    <>
                                                        <Link
                                                            href={`/orders/${order.id}/tracking`}
                                                            className="w-full py-2.5 px-4 bg-primary-600 dark:bg-[#f27f0d] hover:bg-primary-700 dark:hover:bg-[#d16b08] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary-600/20 dark:shadow-[#f27f0d]/20"
                                                        >
                                                            <MapPin className="w-4 h-4" /> Track Order
                                                        </Link>
                                                        <Link href={`/orders/${order.id}`} className="w-full py-2.5 px-4 bg-transparent border border-gray-200 dark:border-[#393028] hover:border-gray-400 dark:hover:border-[#baab9c] text-gray-700 dark:text-white font-medium rounded-xl transition-colors text-center text-sm">
                                                            View Details
                                                        </Link>
                                                    </>
                                                ) : order.status === 'delivered' ? (
                                                    <>
                                                        <button className="w-full py-2.5 px-4 bg-transparent border border-primary-500 dark:border-[#f27f0d] text-primary-600 dark:text-[#f27f0d] hover:bg-primary-600 dark:hover:bg-[#f27f0d] hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                                                            <RotateCcw className="w-4 h-4" /> Buy Again
                                                        </button>
                                                        <Link href={`/orders/${order.id}/return`} className="w-full py-2.5 px-4 bg-transparent border border-gray-200 dark:border-[#393028] hover:border-gray-400 dark:hover:border-[#baab9c] text-gray-700 dark:text-white font-medium rounded-xl transition-colors text-center text-sm">
                                                            Return Item
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <Link href={`/orders/${order.id}`} className="w-full py-2.5 px-4 bg-transparent border border-gray-200 dark:border-[#393028] hover:border-gray-400 dark:hover:border-[#baab9c] text-gray-700 dark:text-white font-medium rounded-xl transition-colors text-center text-sm">
                                                        View Details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Load More */}
                            {hasMore && (
                                <div className="flex justify-center py-4">
                                    <button
                                        onClick={() => fetchOrders(page + 1)}
                                        disabled={loading}
                                        className="flex items-center gap-2 text-gray-500 dark:text-[#baab9c] hover:text-primary-600 dark:hover:text-[#f27f0d] text-sm font-medium transition-colors"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                                        Load more orders
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
