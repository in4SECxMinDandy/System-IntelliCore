'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    CheckCircle, Package, Truck, Home, MapPin, CreditCard,
    Phone, Star, FileText, ArrowLeft, Loader2, AlertCircle, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import OrderTrackingStepper, { OrderTrackingMap } from '@/components/OrderTrackingStepper';

// Material Symbols icon component
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface TrackingStep {
    id: string;
    label: string;
    description: string;
    timestamp?: string;
    isCompleted: boolean;
    isActive: boolean;
    isPending: boolean;
}

interface OrderData {
    id: string;
    status: string;
    totalAmount: number;
    subtotal: number;
    shippingFee: number;
    taxAmount: number;
    paymentMethod: string;
    shippingAddress?: {
        fullName?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        phone?: string;
    };
    items: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
        product?: { name: string; imageUrl?: string };
    }>;
    createdAt: string;
}

const buildSteps = (status: string, createdAt: string): TrackingStep[] => {
    const base = new Date(createdAt);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const idx = statusOrder.indexOf(status);

    return [
        {
            id: 'placed', 
            label: 'Order Placed', 
            description: 'Your order has been received',
            timestamp: fmt(base),
            isCompleted: idx >= 0,
            isActive: false,
            isPending: idx < 0,
        },
        {
            id: 'processing', 
            label: 'Processing', 
            description: 'Warehouse is preparing your items',
            timestamp: fmt(new Date(base.getTime() + 4 * 3600000)),
            isCompleted: idx >= 1,
            isActive: idx === 1,
            isPending: idx < 1,
        },
        {
            id: 'shipped', 
            label: 'Out for Delivery', 
            description: 'On the way to your location',
            timestamp: fmt(new Date(base.getTime() + 24 * 3600000)),
            isCompleted: idx >= 2,
            isActive: idx === 2,
            isPending: idx < 2,
        },
        {
            id: 'delivered', 
            label: 'Delivered', 
            description: 'Estimated delivery today by 6:00 PM',
            timestamp: 'Estimated today',
            isCompleted: idx >= 3,
            isActive: false,
            isPending: idx < 3,
        },
    ];
};

export default function OrderTrackingPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        api.get(`/orders/${id}`)
            .then(({ data }) => setOrder(data.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id, isAuthenticated, router]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (!order) return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Order not found</h2>
            <Link href="/orders" className="px-6 py-2.5 bg-primary hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">Back to Orders</Link>
        </div>
    );

    const steps = buildSteps(order.status, order.createdAt);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark dark:border-[#393028] px-6 md:px-10 py-3 bg-background-dark dark:bg-[#181411] sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-8 text-primary">
                            <MaterialIcon className="text-4xl">local_shipping</MaterialIcon>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">NeonLogistics</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link className="text-slate-300 dark:text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="/">Dashboard</Link>
                        <Link className="text-primary text-sm font-medium" href="/orders">Orders</Link>
                        <Link className="text-slate-300 dark:text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#">Tracking</Link>
                        <Link className="text-slate-300 dark:text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#">Support</Link>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-6">
                    <div className="hidden sm:flex w-full max-w-xs items-center relative">
                        <span className="material-symbols-outlined absolute left-3 text-slate-400">search</span>
                        <input className="w-full bg-neutral-100 dark:bg-neutral-800 text-slate-900 dark:text-white rounded-lg border-none py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary placeholder:text-slate-400" placeholder="Search orders, tracking..."/>
                    </div>
                    <button className="size-10 rounded-full bg-neutral-200 dark:bg-neutral-800 bg-center bg-cover border border-neutral-300 dark:border-neutral-700" 
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBd1OdYNKZHvSANE4C_-YwOaTcv_vvgUSZCTs3gH8kvHo-8xt_RgVcAHZ4p_qZdvuz597vV5bAr3RI3U1ATe93vKl9lo1f7yjGH_pGTSTyc0AAEWdtdLf7WRF2ZYphM_m4Jdp7t06G7yoL3Sy2W1v-SbxtploBjfEPkNrH1lzQpFGd24OIAuRrwOZ5uUfn9rVZCxzxhuIbNXKMUinsWyEVWBYAitlgUUCfYsYU1JzCfz6t2Hvdh4nKbupZAtp5XI3P80G9yZuep-oU")' }}
                    />
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <Link className="text-slate-500 dark:text-slate-400 hover:text-primary" href="/">Home</Link>
                    <span className="text-slate-500 dark:text-slate-400">/</span>
                    <Link className="text-slate-500 dark:text-slate-400 hover:text-primary" href="/orders">Orders</Link>
                    <span className="text-slate-500 dark:text-slate-400">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Order #{order.id.slice(0, 8).toUpperCase()} Tracking</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">In Transit</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">Estimated delivery: <span className="text-slate-900 dark:text-white font-medium">Today by 6:00 PM</span></p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-neutral-200 dark:border-neutral-700 text-slate-700 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-semibold">
                            <MaterialIcon className="text-lg">description</MaterialIcon>
                            <span>Get Invoice</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-orange-600 text-white transition-colors text-sm font-bold shadow-lg shadow-primary/20">
                            <MaterialIcon className="text-lg">smart_toy</MaterialIcon>
                            <span>AI Support</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Tracking & Map */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Tracking Stepper */}
                        <OrderTrackingStepper steps={steps} currentStep={2} />

                        {/* Map View */}
                        <OrderTrackingMap driverName="Michael D." vehicleType="Van" />
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col gap-6">
                        {/* Item List */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Items in Order</h3>
                            <div className="flex flex-col gap-4">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="size-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0">
                                            {item.product?.imageUrl
                                                ? <img alt={item.product.name} className="w-full h-full object-cover" src={item.product.imageUrl} />
                                                : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-400" /></div>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.product?.name || 'Product'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.unitPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shipping Details</h3>
                                <div className="flex gap-3 mb-4">
                                    <MaterialIcon className="text-slate-400 mt-0.5">location_on</MaterialIcon>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </p>
                                    </div>
                                </div>
                                {order.shippingAddress.phone && (
                                    <div className="flex gap-3">
                                        <MaterialIcon className="text-slate-400 mt-0.5">call</MaterialIcon>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress.phone}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Summary */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Shipping</span>
                                    <span>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span>
                                </div>
                                {order.taxAmount > 0 && (
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Tax</span><span>{formatPrice(order.taxAmount)}</span>
                                    </div>
                                )}
                                <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                    <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                                <MaterialIcon className="text-base">credit_card</MaterialIcon>
                                <span>Paid with {order.paymentMethod} ending in 4242</span>
                            </div>
                        </div>

                        {/* Rate Experience Nudge */}
                        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-6 border border-neutral-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MaterialIcon className="text-8xl text-white">star</MaterialIcon>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Rate your experience</h3>
                            <p className="text-sm text-neutral-300 mb-4 relative z-10">Help us improve by rating your delivery experience once it arrives.</p>
                            <div className="flex gap-1 relative z-10">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <MaterialIcon className={`text-2xl transition-colors ${star <= (hoverRating || rating) ? 'text-primary fill-current' : 'text-neutral-500'}`}>star</MaterialIcon>
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-primary text-sm mt-2 font-medium relative z-10">Thank you for your rating!</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
