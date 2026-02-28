'use client';

import { cn } from '@/lib/utils';
import { Package, Truck, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  icon: React.ElementType;
  color: string; 
  bg: string; 
  border: string;
  textColor: string;
}> = {
  pending: { 
    label: 'Pending Payment', 
    icon: Clock, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/20', 
    border: 'border-yellow-500/30',
    textColor: 'text-yellow-400'
  },
  processing: { 
    label: 'Processing', 
    icon: Package, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20', 
    border: 'border-blue-500/30',
    textColor: 'text-blue-400'
  },
  shipped: { 
    label: 'Shipped', 
    icon: Truck, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/20', 
    border: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  out_for_delivery: { 
    label: 'Out for Delivery', 
    icon: Truck, 
    color: 'text-primary-500', 
    bg: 'bg-primary-500/20', 
    border: 'border-primary-500/30',
    textColor: 'text-primary-500'
  },
  delivered: { 
    label: 'Completed', 
    icon: CheckCircle, 
    color: 'text-green-400', 
    bg: 'bg-green-500/20', 
    border: 'border-green-500/30',
    textColor: 'text-green-400'
  },
  cancelled: { 
    label: 'Cancelled', 
    icon: XCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/20', 
    border: 'border-red-500/30',
    textColor: 'text-red-400'
  },
  returned: { 
    label: 'Returned', 
    icon: RotateCcw, 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/20', 
    border: 'border-gray-500/30',
    textColor: 'text-gray-400'
  },
};

export function OrderStatusBadge({ status, showIcon = true, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.processing;
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border',
      config.bg,
      config.border,
      config.textColor,
      className
    )}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
