'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, Mail, ChevronRight, Loader2, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-purple-600 bg-purple-50 border-purple-200',
  shipped: 'text-orange-600 bg-orange-50 border-orange-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
};

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [email, setEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showLookup, setShowLookup] = useState(!orderId);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then(r => r.data.data),
    enabled: !!orderId,
  });

  // Auto-populate from URL params
  useEffect(() => {
    const tracking = searchParams.get('tracking');
    if (tracking) setTrackingNumber(tracking);
  }, [searchParams]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber) {
      router.push(`/orders/tracking?id=${trackingNumber}`);
    }
  };

  if (showLookup || (!orderId)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Track Your Order
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your order ID or tracking number to see the status
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order ID / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., ORD-123456 or TRACK123"
                  className="input w-full"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Track Order
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Or track with email
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input flex-1"
                />
                <button type="button" className="btn-secondary">
                  Find
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>Call us: +1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>Email: support@intellicore.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't find an order with that ID. Please check and try again.
            </p>
            <button 
              onClick={() => setShowLookup(true)}
              className="btn-primary"
            >
              Try Again
            </button>
        </div>
          </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Tracking
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Order #{order.orderNumber}
            </p>
          </div>
          <Link 
            href={`/orders/${order.id}`}
            className="btn-secondary"
          >
            View Details
          </Link>
        </div>

        {/* Status Timeline */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex-1 relative">
                  {/* Connector Line */}
                  {index < statusSteps.length - 1 && (
                    <div 
                      className={cn(
                        "absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2",
                        index < currentStepIndex 
                          ? "bg-primary-500" 
                          : "bg-gray-200 dark:bg-dark-700"
                      )}
                    />
                  )}
                  
                  {/* Step Circle */}
                  <div 
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all",
                      isCompleted 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-200 dark:bg-dark-700 text-gray-400",
                      isCurrent && "ring-4 ring-primary-500/20"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Step Label */}
                  <p 
                    className={cn(
                      "text-xs text-center mt-2 font-medium",
                      isCompleted 
                        ? "text-primary-600 dark:text-primary-400" 
                        : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Status */}
          <div className={cn(
            "p-4 rounded-lg border text-center",
            statusColors[order.status] || 'bg-gray-50 border-gray-200'
          )}>
            <p className="font-semibold">
              {order.status === 'delivered' 
                ? 'Your order has been delivered!' 
                : order.status === 'cancelled'
                ? 'This order has been cancelled'
                : `Your order is currently ${order.status}`
              }
            </p>
            {order.trackingNumber && (
              <p className="text-sm mt-1 opacity-80">
                Tracking: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-gray-400">No shipping address available</p>
            )}
          </div>

          {/* Order Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Order Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Order Date</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment Status</span>
                <span className={cn(
                  "font-medium",
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                )}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tracking #</span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Preview */}
        <div className="card p-6 mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Items in This Order
          </h3>
          <div className="space-y-4">
            {order.orderItems?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ${item.unitPrice?.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${item.totalPrice?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setShowLookup(true)}
            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Track Another Order
          </button>
        </div>
      </div>
    </div>
  );
}
