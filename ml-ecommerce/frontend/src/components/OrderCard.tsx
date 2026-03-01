'use client';

import Link from 'next/link';
import Image from 'next/image';

// Material Symbols icon component
const MaterialIcon = ({ icon, className, children }: { icon?: string; className?: string; children?: React.ReactNode }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon || children}</span>
);

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: {
    name: string;
    imageUrl?: string;
    variant?: string;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

interface OrderCardProps {
  order: Order;
  showEstimatedDelivery?: boolean;
  estimatedDelivery?: string;
}

const STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}> = {
  pending: {
    label: 'Pending Payment',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: 'schedule'
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: 'inventory_2'
  },
  shipped: {
    label: 'Shipped',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    icon: 'local_shipping'
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'text-primary',
    bg: 'bg-primary/20',
    border: 'border-primary/30',
    icon: 'local_shipping'
  },
  delivered: {
    label: 'Completed',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: 'check_circle'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: 'cancel'
  }
};

export default function OrderCard({ order, showEstimatedDelivery, estimatedDelivery }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
  const firstItem = order.items?.[0];
  const extraCount = (order.items?.length || 0) - 1;
  
  const isActive = ['processing', 'shipped', 'out_for_delivery'].includes(order.status);
  const isCompleted = order.status === 'delivered';
  const isNeon = order.status === 'out_for_delivery';

  return (
    <div
      className={`
        bg-card-dark dark:bg-[#221910] rounded-xl border overflow-hidden transition-all duration-300
        ${isNeon 
          ? 'border-primary/50 shadow-[0_0_15px_-3px_rgba(242,127,13,0.15)]' 
          : isActive
            ? 'border-border-dark dark:border-[#393028] hover:border-primary/30'
            : 'border-border-dark dark:border-[#393028] hover:border-primary/20'
        }
        ${isCompleted ? 'opacity-80 hover:opacity-100' : ''}
      `}
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-background-dark/50 dark:bg-[#181411]/60 border-b border-border-dark dark:border-[#393028] gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`${statusConfig.color} ${statusConfig.bg} ${statusConfig.border} px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border`}>
            {statusConfig.label}
          </span>
          <span className="text-text-light dark:text-[#baab9c] text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</span>
          <span className="text-text-light dark:text-[#393028] hidden sm:block">•</span>
          <span className="text-text-light dark:text-[#baab9c] text-sm hidden sm:block">
            {order.status === 'delivered' && order.updatedAt 
              ? `Delivered ${new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : `Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            }
          </span>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <MaterialIcon 
              icon={statusConfig.icon} 
              className={`text-lg ${order.status === 'out_for_delivery' ? 'animate-pulse' : ''}`}
            />
            <span>
              {showEstimatedDelivery && estimatedDelivery 
                ? `AI Est: ${estimatedDelivery}` 
                : order.status === 'out_for_delivery' 
                  ? 'Arriving Today by 8 PM'
                  : 'In transit'
              }
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Product image + info */}
        <div className="flex gap-4 flex-1 min-w-0">
          <div className={`
            size-24 sm:size-32 rounded-lg bg-background-dark dark:bg-[#181411] border border-border-dark dark:border-[#393028] 
            overflow-hidden shrink-0 relative
            ${isCompleted ? 'grayscale hover:grayscale-0 transition-all' : ''}
          `}>
            {firstItem?.product?.imageUrl ? (
              <Image 
                src={firstItem.product.imageUrl} 
                alt={firstItem.product?.name || 'Product'} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MaterialIcon className="text-3xl text-text-light dark:text-[#baab9c]">inventory_2</MaterialIcon>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between min-w-0">
            <div>
              <h4 className="text-white dark:text-white font-bold text-lg mb-1 line-clamp-1">
                {firstItem?.product?.name || 'Order Items'}
              </h4>
              {firstItem?.product?.variant && (
                <p className="text-text-light dark:text-[#baab9c] text-sm">Variant: {firstItem.product.variant}</p>
              )}
              <p className="text-text-light dark:text-[#baab9c] text-sm">
                {firstItem?.quantity && firstItem.quantity > 1 ? `Qty: ${firstItem.quantity}` : `${order.items?.length || 0} item${(order.items?.length || 0) !== 1 ? 's' : ''}`}
              </p>
              {extraCount > 0 && (
                <p className="text-text-light dark:text-[#baab9c] text-xs">+ {extraCount} more item{extraCount > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white dark:text-white">
                ${Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 md:w-48 shrink-0">
          {['shipped', 'processing', 'out_for_delivery'].includes(order.status) ? (
            <>
              <Link
                href={`/orders/${order.id}/tracking`}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-700 dark:hover:bg-[#d16b08] text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                <MaterialIcon className="text-lg">map</MaterialIcon>
                Track Order
              </Link>
              <Link 
                href={`/orders/${order.id}`} 
                className="w-full py-2.5 px-4 bg-transparent border border-border-dark dark:border-[#393028] hover:border-text-light dark:hover:border-[#baab9c] text-white font-medium rounded-lg transition-all duration-200 text-center text-sm"
              >
                View Details
              </Link>
            </>
          ) : order.status === 'delivered' ? (
            <>
              <button 
                className="w-full py-2.5 px-4 bg-background-dark dark:bg-[#181411] border border-primary text-primary hover:bg-primary hover:text-white dark:hover:text-background-dark font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <MaterialIcon className="text-lg">shopping_cart</MaterialIcon>
                Buy Again
              </button>
              <Link 
                href={`/orders/${order.id}/return`} 
                className="w-full py-2.5 px-4 bg-transparent border border-border-dark dark:border-[#393028] hover:border-text-light dark:hover:border-[#baab9c] text-white font-medium rounded-lg transition-all duration-200 text-center text-sm"
              >
                Return Item
              </Link>
            </>
          ) : (
            <Link 
              href={`/orders/${order.id}`} 
              className="w-full py-2.5 px-4 bg-transparent border border-border-dark dark:border-[#393028] hover:border-text-light dark:hover:border-[#baab9c] text-white font-medium rounded-lg transition-all duration-200 text-center text-sm"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
