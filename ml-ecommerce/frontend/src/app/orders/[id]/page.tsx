'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Package, CheckCircle, Clock, Truck, MapPin,
    CreditCard, ArrowLeft, Loader2, AlertCircle, RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';

interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product?: { name: string; imageUrl?: string };
}

interface Order {
    id: string;
    orderNumber?: string;
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

// Mock data for demo
const mockOrder: Order = {
    id: 'ML-883921',
    orderNumber: 'ML-883921',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Visa',
    subtotal: 381.00,
    shippingFee: 15.00,
    taxAmount: 32.10,
    discountAmount: 0,
    totalAmount: 428.10,
    createdAt: '2023-10-24T10:00:00Z',
    shippingAddress: {
        fullName: 'Jane Doe',
        address: '425 Market Street, Suite 500',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States',
    },
    items: [
        { id: '1', productId: 'p1', quantity: 1, unitPrice: 149.99, product: { name: 'CyberMech Pro Keyboard', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_PU8WIAXOKrkijveyvTQoy9Y2xOdxtEjq_Dev7tX-c8zIdHNeBTKOqdtwo4CitAiCknE-OIKIgus00ok3Xm-_fnIE2z8onEylXFmET6he9YfvlKglTQoTVAFGneh46m3zgvuw2ADHzDsNtL706wv2BodE06OBenJTqBViCLxf2Yk2bQS-v7jWdtWIZG5ruzh96qkjpH4qd3LjAOv26j5GsWKqg3l-_Rx2LweCRaR48wHgKGRzzTvsVZ86grTxgRnUNWQC_p4pdU' } },
        { id: '2', productId: 'p2', quantity: 2, unitPrice: 115.50, product: { name: 'Wireless Gaming Mouse', imageUrl: '' } },
    ],
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
            setLoading(true);
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.data);
                setError('');
            } catch (err: any) {
                console.error('Failed to fetch order:', err);
                // Fallback to mock data if API fails
                setOrder({ ...mockOrder, id: id || mockOrder.id });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-background-light dark:bg-[#181411]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-background-light dark:bg-[#181411]">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Order not found</h2>
                <p className="text-[#baab9c] mb-6">{error || 'The order you are looking for does not exist.'}</p>
                <Link href="/products" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-background-light dark:bg-[#181411] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/orders" className="flex items-center gap-2 text-[#baab9c] hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Orders</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Order Details
                    </h1>
                    <p className="text-[#baab9c] mt-1">
                        Order #{order.orderNumber || order.id}
                    </p>
                </div>
                {order.status === 'delivered' && (
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#221910] border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold rounded-lg transition-colors text-sm">
                            <RotateCcw className="w-4 h-4" />
                            Buy Again
                        </button>
                        <Link 
                            href={`/orders/${order.id}/return`}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-[#393028] hover:border-[#baab9c] text-white font-medium rounded-lg transition-colors text-sm"
                        >
                            Return Item
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Items + Shipping */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status */}
                    <div className="bg-[#221910] rounded-xl border border-[#393028] p-5 flex flex-wrap items-center gap-4">
                        <OrderStatusBadge status={order.status as any} />
                        <div className="text-[#baab9c] text-sm">
                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {order.status === 'shipped' && (
                            <Link 
                                href={`/orders/tracking?id=${order.id}`}
                                className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                                <Truck className="w-4 h-4" />
                                Track Order
                            </Link>
                        )}
                    </div>

                    {/* Items */}
                    <div className="bg-[#221910] rounded-xl border border-[#393028] p-5">
                        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary-500" /> 
                            Items ({order.items?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {(order.items || []).map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-[#181411]/50 border border-[#393028]">
                                    <div className="w-20 h-20 rounded-lg bg-[#181411] border border-[#393028] overflow-hidden shrink-0">
                                        {item.product?.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-[#baab9c]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold line-clamp-1">
                                            {item.product?.name || `Product #${item.productId}`}
                                        </p>
                                        <p className="text-[#baab9c] text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-white font-bold shrink-0">
                                        {formatPrice(item.unitPrice * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="bg-[#221910] rounded-xl border border-[#393028] p-5">
                            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary-500" /> 
                                Shipping Address
                            </h2>
                            <div className="text-[#baab9c] space-y-0.5">
                                <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Summary */}
                <div className="space-y-4">
                    <div className="bg-[#221910] rounded-xl border border-[#393028] p-5">
                        <h2 className="font-bold text-white mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#baab9c]">Subtotal</span>
                                <span className="text-white">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#baab9c]">Shipping</span>
                                <span className={order.shippingFee === 0 ? 'text-green-400' : 'text-white'}>
                                    {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
                                </span>
                            </div>
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-[#baab9c]">Tax</span>
                                    <span className="text-white">{formatPrice(order.taxAmount)}</span>
                                </div>
                            )}
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-{formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-[#393028] pt-2 flex justify-between font-bold text-lg">
                                <span className="text-white">Total</span>
                                <span className="text-primary-500">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#221910] rounded-xl border border-[#393028] p-5">
                        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary-500" /> 
                            Payment
                        </h2>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[#baab9c]">Method</span>
                                <span className="text-white capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#baab9c]">Status</span>
                                <span className={order.paymentStatus === 'paid' ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium capitalize'}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href="/products" className="flex items-center justify-center gap-2 w-full py-3 bg-transparent border border-[#393028] hover:border-[#baab9c] text-white font-medium rounded-lg transition-colors text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
