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

interface TrackingStep {
    id: string;
    label: string;
    description: string;
    time: string;
    status: 'done' | 'active' | 'pending';
    icon: React.ElementType;
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

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const idx = statusOrder.indexOf(status);

    return [
        {
            id: 'placed', label: 'Order Placed', icon: CheckCircle,
            description: fmt(base),
            status: 'done',
            time: fmt(base),
        },
        {
            id: 'processing', label: 'Processing', icon: Package,
            description: 'Warehouse is preparing your items',
            status: idx >= 1 ? 'done' : 'pending',
            time: fmt(new Date(base.getTime() + 4 * 3600000)),
        },
        {
            id: 'shipped', label: 'Out for Delivery', icon: Truck,
            description: 'Your package is on the way',
            status: idx >= 2 ? (idx === 2 ? 'active' : 'done') : 'pending',
            time: fmt(new Date(base.getTime() + 24 * 3600000)),
        },
        {
            id: 'delivered', label: 'Delivered', icon: Home,
            description: 'Estimated delivery today by 6:00 PM',
            status: idx >= 3 ? 'done' : 'pending',
            time: 'Estimated today',
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
            <Loader2 className="w-8 h-8 animate-spin text-[#f27f0d]" />
        </div>
    );

    if (!order) return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Order not found</h2>
            <Link href="/orders" className="btn-primary btn-md">Back to Orders</Link>
        </div>
    );

    const steps = buildSteps(order.status, order.createdAt);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#221910]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-400 mb-6">
                    <Link href="/" className="hover:text-[#f27f0d]">Home</Link>
                    <span>/</span>
                    <Link href="/orders" className="hover:text-[#f27f0d]">Orders</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f241a] transition-colors text-gray-500 dark:text-slate-400">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Order #{order.id.slice(0, 8).toUpperCase()} Tracking
                            </h1>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f27f0d]/20 text-[#f27f0d] border border-[#f27f0d]/30">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 ml-11">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3 ml-11 md:ml-0">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#2f241a] text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-sm font-semibold">
                            <FileText className="w-4 h-4" /> Get Invoice
                        </button>
                        <Link href={`/orders/${order.id}/return`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f27f0d] hover:bg-[#d16b08] text-white transition-colors text-sm font-bold shadow-lg shadow-[#f27f0d]/20">
                            <Zap className="w-4 h-4" /> Return / Cancel
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Stepper + Map */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Tracking Stepper */}
                        <div className="bg-white dark:bg-[#2f241a] rounded-xl border border-gray-200 dark:border-neutral-800 p-6 shadow-sm">
                            <div className="relative">
                                {steps.map((step, i) => {
                                    const Icon = step.icon;
                                    const isLast = i === steps.length - 1;
                                    return (
                                        <div key={step.id} className={`flex gap-4 ${!isLast ? 'pb-8' : ''} relative`}>
                                            <div className="flex flex-col items-center">
                                                <div className={`z-10 flex items-center justify-center rounded-full transition-all ${step.status === 'done'
                                                        ? 'w-8 h-8 bg-[#f27f0d] text-white shadow-[0_0_15px_rgba(242,127,13,0.5)]'
                                                        : step.status === 'active'
                                                            ? 'w-10 h-10 -ml-1 bg-white dark:bg-[#221910] border-2 border-[#f27f0d] text-[#f27f0d] shadow-[0_0_20px_rgba(242,127,13,0.4)] animate-pulse'
                                                            : 'w-8 h-8 bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-slate-600'
                                                    }`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-0.5 flex-1 mt-1 ${step.status === 'done' ? 'bg-[#f27f0d]' : 'border-l border-dashed border-gray-300 dark:border-neutral-600'
                                                        }`} style={{ minHeight: '2rem' }} />
                                                )}
                                            </div>
                                            <div className={`flex-1 pt-1 ${step.status === 'pending' ? 'opacity-50' : ''}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className={`font-bold text-base ${step.status === 'active' ? 'text-[#f27f0d]' : 'text-gray-900 dark:text-white'}`}>
                                                            {step.label}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                                                    </div>
                                                    {step.status === 'active' && (
                                                        <span className="bg-[#f27f0d]/10 text-[#f27f0d] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Live</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-neutral-800 bg-gray-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="relative mx-auto w-16 h-16 mb-3">
                                        <div className="absolute inset-0 bg-[#f27f0d] rounded-full animate-ping opacity-50" />
                                        <div className="relative w-16 h-16 bg-[#221910] rounded-full border-2 border-[#f27f0d] flex items-center justify-center text-[#f27f0d] shadow-[0_0_30px_rgba(242,127,13,0.6)]">
                                            <Truck className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-700">
                                        <p className="text-white text-sm font-bold">Live Tracking Active</p>
                                        <p className="text-gray-400 text-xs">Real-time map would appear here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col gap-5">
                        {/* Items */}
                        <div className="bg-white dark:bg-[#2f241a] rounded-xl border border-gray-200 dark:border-neutral-800 p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Items in Order
                            </h3>
                            <div className="flex flex-col gap-4">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 overflow-hidden shrink-0">
                                            {item.product?.imageUrl
                                                ? <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-400" /></div>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.product?.name || 'Product'}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-[#f27f0d] mt-0.5">{formatPrice(item.unitPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping */}
                        {order.shippingAddress && (
                            <div className="bg-white dark:bg-[#2f241a] rounded-xl border border-gray-200 dark:border-neutral-800 p-5 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shipping Details</h3>
                                <div className="flex gap-3 mb-3">
                                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </p>
                                    </div>
                                </div>
                                {order.shippingAddress.phone && (
                                    <div className="flex gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                                        <p className="text-sm text-gray-500 dark:text-slate-400">{order.shippingAddress.phone}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Summary */}
                        <div className="bg-white dark:bg-[#2f241a] rounded-xl border border-gray-200 dark:border-neutral-800 p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500 dark:text-slate-400">
                                    <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-slate-400">
                                    <span>Shipping</span>
                                    <span>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span>
                                </div>
                                {order.taxAmount > 0 && (
                                    <div className="flex justify-between text-gray-500 dark:text-slate-400">
                                        <span>Tax</span><span>{formatPrice(order.taxAmount)}</span>
                                    </div>
                                )}
                                <div className="pt-2 mt-2 border-t border-gray-100 dark:border-neutral-700 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                                    <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-neutral-800 p-2 rounded-lg">
                                <CreditCard className="w-4 h-4" />
                                <span className="capitalize">Paid via {order.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Rate experience */}
                        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-5 border border-neutral-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Star className="w-20 h-20 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 relative z-10">Rate your experience</h3>
                            <p className="text-sm text-neutral-300 mb-4 relative z-10">Help us improve by rating your delivery.</p>
                            <div className="flex gap-1 relative z-10">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-7 h-7 transition-colors ${star <= (hoverRating || rating) ? 'text-[#f27f0d] fill-[#f27f0d]' : 'text-neutral-500'}`} />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-[#f27f0d] text-sm mt-2 font-medium relative z-10">Thank you for your rating!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
