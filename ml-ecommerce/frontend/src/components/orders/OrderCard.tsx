'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Package, Clock, ChevronRight } from 'lucide-react';

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderCardProps {
  orderId: string;
  status: OrderStatus;
  placedDate: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  totalAmount: number;
  isActive?: boolean;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: 'Order Placed', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  processing: { label: 'Processing', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  shipped: { label: 'Shipped', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-primary-500/20 text-primary-500 border-primary-500/30' },
  delivered: { label: 'Delivered', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function OrderCard({
  orderId,
  status,
  placedDate,
  estimatedDelivery,
  items,
  totalAmount,
  isActive = false,
  className,
}: OrderCardProps) {
  const statusInfo = statusConfig[status];
  const mainItem = items[0];

  return (
    <div
      className={cn(
        'bg-card-dark dark:bg-surface-dark rounded-xl overflow-hidden transition-all duration-300',
        isActive
          ? 'border border-primary-500/50 shadow-[0_0_15px_-3px_rgba(242,127,13,0.15)]'
          : 'border border-border-dark dark:border-border-dark hover:border-primary-500/30',
        className
      )}
    >
      {/* Card Header */}
      <div className={cn(
        'flex flex-wrap items-center justify-between p-4 border-b gap-4',
        isActive ? 'bg-background-dark/50 dark:bg-background-dark/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
      )}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className={cn(
            'px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border',
            statusInfo.className
          )}>
            {statusInfo.label}
          </span>
          <span className="text-text-light dark:text-text-muted text-sm">Order #{orderId}</span>
          <span className="text-text-light dark:text-text-muted text-sm hidden sm:block">•</span>
          <span className="text-text-light dark:text-text-muted text-sm hidden sm:block">
            Placed on {placedDate}
          </span>
        </div>
        {estimatedDelivery && (
          <div className="flex items-center gap-2 text-primary-500 font-medium text-sm">
            {status === 'out_for_delivery' && (
              <>
                <Clock className="w-4 h-4 animate-pulse" />
                <span>AI Est: {estimatedDelivery}</span>
              </>
            )}
            {status === 'shipped' && (
              <>
                <Package className="w-4 h-4" />
                <span>AI Est: {estimatedDelivery}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Product Info */}
        <div className="flex gap-4 flex-1">
          <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-lg bg-background-dark dark:bg-gray-800 border border-border-dark dark:border-border-dark shrink-0 overflow-hidden relative">
            {mainItem.image && (
              <Image
                src={mainItem.image}
                alt={mainItem.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-white font-bold text-lg mb-1">{mainItem.name}</h4>
              {mainItem.variant && (
                <p className="text-text-light dark:text-text-muted text-sm">Variant: {mainItem.variant}</p>
              )}
              <p className="text-text-light dark:text-text-muted text-sm">Qty: {mainItem.quantity}</p>
              {items.length > 1 && (
                <p className="text-primary-500 text-sm mt-1">+{items.length - 1} more items</p>
              )}
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 md:w-48 shrink-0">
          <Link
            href={`/orders/${orderId}/tracking`}
            className={cn(
              'w-full py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors',
              isActive || status === 'out_for_delivery'
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            )}
          >
            <MapPin className="w-4 h-4" />
            {status === 'out_for_delivery' || status === 'delivered' ? 'Track Order' : 'Track Order'}
          </Link>
          <Link
            href={`/orders/${orderId}`}
            className="w-full py-2.5 px-4 bg-transparent border border-border-dark dark:border-border-dark hover:border-text-light dark:hover:border-text-muted text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
