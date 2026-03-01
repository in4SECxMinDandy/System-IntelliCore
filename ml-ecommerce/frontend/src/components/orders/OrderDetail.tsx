'use client';

import Link from 'next/link';
import { MapPin, Phone, CreditCard, Star } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

interface PaymentInfo {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  cardLast4: string;
}

interface OrderDetailProps {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  showRating?: boolean;
  onRate?: (rating: number) => void;
}

export function OrderDetail({ items, shippingAddress, payment, showRating = false, onRate }: OrderDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Items in Order */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Items in Order</h3>
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex gap-4 items-center ${index > 0 ? 'border-t border-gray-100 dark:border-gray-800 pt-4' : ''}`}
            >
              <div className="size-16 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
                <img 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  src={item.image}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.variant ? `${item.variant} • ` : ''}Qty: {item.quantity}
                </p>
                <p className="text-sm font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shipping Details</h3>
        <div className="flex gap-3 mb-4">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{shippingAddress.label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
              {shippingAddress.country}
            </p>
          </div>
        </div>
        {shippingAddress.phone && (
          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Contact Info</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{shippingAddress.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${payment.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Shipping</span>
            <span>${payment.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Tax</span>
            <span>${payment.tax.toFixed(2)}</span>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${payment.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <CreditCard className="w-4 h-4" />
          <span>Paid with Visa ending in {payment.cardLast4}</span>
        </div>
      </div>

      {/* Rate Experience Nudge */}
      {showRating && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-20 h-20 text-white fill-current" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 relative z-10">Rate your experience</h3>
          <p className="text-sm text-gray-300 mb-4 relative z-10">Help us improve by rating your delivery experience once it arrives.</p>
          <div className="flex gap-1 relative z-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate?.(star)}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
