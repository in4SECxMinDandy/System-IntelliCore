'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Package, CheckCircle, Clock, Truck, MapPin,
    CreditCard, ArrowLeft, Loader2, AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product?: { name: string; imageUrl?: string };
}

interface Order {
    id: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    shippingAddress?: {
        fullName?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    items: OrderItem[];
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Package }> = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
    processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Package },
    shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: AlertCircle },
};

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.data);
            } catch (err: unknown) {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                setError(msg || 'Order not found');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order not found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'The order you are looking for does not exist.'}</p>
                <Link href="/products" className="btn-primary btn-lg">Continue Shopping</Link>
            </div>
        );
    }

    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
    const StatusIcon = statusInfo.icon;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/profile" className="btn-ghost btn-sm p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Details</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Items + Shipping */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status */}
                    <div className="card p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusInfo.color.split(' ').slice(1).join(' ')}`}>
                            <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ordered on</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="card p-5">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary-500" /> Items ({order.items?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {(order.items || []).map((item) => (
                                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                                    <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-dark-700 overflow-hidden shrink-0">
                                        {item.product?.imageUrl && (
                                            <img src={item.product.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                                            {item.product?.name || `Product #${item.productId.slice(0, 8)}`}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                                        {formatPrice(item.unitPrice * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="card p-5">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-500" /> Shipping Address
                            </h2>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Summary */}
                <div className="space-y-4">
                    <div className="card p-5">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                <span className={order.shippingFee === 0 ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'}>
                                    {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
                                </span>
                            </div>
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(order.taxAmount)}</span>
                                </div>
                            )}
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-{formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-100 dark:border-dark-700 pt-2 flex justify-between font-bold text-base">
                                <span className="text-gray-900 dark:text-gray-100">Total</span>
                                <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary-500" /> Payment
                        </h2>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Method</span>
                                <span className="text-gray-900 dark:text-gray-100 capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                <span className={order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-yellow-600 dark:text-yellow-400 font-medium capitalize'}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href="/products" className="btn-outline btn-md w-full flex items-center justify-center gap-2">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
