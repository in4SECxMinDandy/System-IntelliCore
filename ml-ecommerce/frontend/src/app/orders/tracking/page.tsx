'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, Mail, ChevronRight, Loader2, AlertCircle, Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackingStepper } from '@/components/orders/TrackingStepper';
import { MapView } from '@/components/orders/MapView';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  items: OrderItem[];
  createdAt: string;
  deliveredAt?: string;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const trackingSteps = [
  { key: 'placed', label: 'Order Placed', description: 'Order has been placed successfully', timestamp: 'Oct 24, 10:00 AM' },
  { key: 'processing', label: 'Processing', description: 'Order is being prepared', timestamp: 'Oct 24, 2:30 PM' },
  { key: 'shipped', label: 'Out for Delivery', description: 'On the way to your location', timestamp: 'Oct 25, 9:00 AM' },
  { key: 'delivered', label: 'Delivered', description: 'Estimated by 6:00 PM', timestamp: '' },
];

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const [showLookup, setShowLookup] = useState(!orderId);

  // Mock data
  const mockOrder: Order = {
    id: '8932',
    orderNumber: 'ML-883921',
    status: 'shipped',
    paymentStatus: 'paid',
    totalAmount: 428.00,
    shippingFee: 15.00,
    tax: 32.10,
    createdAt: '2023-10-24T10:00:00Z',
    estimatedDelivery: 'Today by 6:00 PM',
    trackingNumber: 'TRK-2023-883921',
    shippingAddress: {
      fullName: 'Jane Doe',
      street: '425 Market Street, Suite 500',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    items: [
      { id: '1', productName: 'Neon Runner X1 - Red', productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOwFjNtYWhX5Llmi1Ct5JRK6DWp6d-g7CmoCgdl21fpP0w2vfcHn0UYWW4ON1-BPlGETwNKtJur3ZgRbEQ5x_z8pK3kzbWY9t8rEjBhrj8WYlKiGqG4twg5PkgTaPaiVfiP7D2cMtKVgpOl84VwsNSFEDEZLdtV-bX7NR4_tsvqerPqNtzPwEF8AQGz9zmUVZSvZZUMDsIC51ERcFvN__QI1CycEa_ocX90p-j_X0LZIY3E25p2wYYwgx9uwIOJe5wHfn2U2UFaOk', quantity: 1, unitPrice: 129.00 },
      { id: '2', productName: 'Quantum Watch Series 4', productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjc4Ghs-IxbJW-gCaclvss2lG1TU0g5z_depmp4RtlJZNOGkA7sQL4qXGGKdnWmI1Fgj95fgC6Mpz6Ej63OnW7-x1o2K6kNTFRVkXOlI1HU-reT7YFfSDGTc16PZzkxoOyTp2tIbGNPYotMdTwi6z6zdA5-MpYUnZm6jZCYNmdyE2Pk07uKF4kmCg38n7zEnM-lBqOE_egJ7Pncz8Sf-r4oN64vTCbLX15rpX0yHkvnkEjSXF8phcrbu0RR6tx_4fqts9WytMVaD8', quantity: 1, unitPrice: 299.00 },
    ],
  };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      setTimeout(() => {
        setOrder(mockOrder);
        setLoading(false);
      }, 500);
    }
  }, [orderId]);

  const currentStepIndex = order ? trackingSteps.findIndex(s => s.key === order.status) : 0;

  if (showLookup || !orderId) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#181411] py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-[#221910] rounded-xl border border-[#393028] p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Track Your Order
              </h1>
              <p className="text-[#baab9c]">
                Enter your order ID or tracking number to see the status
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#baab9c] mb-1">
                  Order ID / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., ML-883921"
                  className="w-full bg-[#181411] border border-[#393028] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-[#baab9c]/50"
                />
              </div>

              <button 
                type="button"
                onClick={() => router.push('/orders/tracking?id=ML-883921')}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors"
              >
                Track Order
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#393028]">
              <p className="text-sm text-[#baab9c] text-center mb-4">
                Need help?
              </p>
              <div className="flex items-center gap-3 text-sm text-[#baab9c]">
                <Phone className="w-4 h-4" />
                <span>Call us: +1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#181411] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#181411] py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-[#221910] rounded-xl border border-[#393028] p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Order Not Found
            </h2>
            <p className="text-[#baab9c] mb-6">
              We couldn't find an order with that ID.
            </p>
            <button 
              onClick={() => setShowLookup(true)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#181411] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          <Link href="/" className="text-[#baab9c] hover:text-white transition-colors">Home</Link>
          <span className="text-[#baab9c]">/</span>
          <Link href="/orders" className="text-[#baab9c] hover:text-white transition-colors">Orders</Link>
          <span className="text-[#baab9c]">/</span>
          <span className="text-white font-medium">Order #{order.orderNumber}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Order #{order.orderNumber} Tracking
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-500 border border-primary-500/30">
                In Transit
              </span>
            </div>
            <p className="text-[#baab9c] text-base md:text-lg">
              Estimated delivery: <span className="text-white font-medium">{order.estimatedDelivery}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#221910] border border-[#393028] text-white hover:bg-[#393028] transition-colors text-sm font-semibold">
              <Receipt className="w-4 h-4" />
              <span>Get Invoice</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors text-sm font-bold shadow-lg shadow-primary-500/20">
              <span className="material-symbols-outlined text-lg">smart_toy</span>
              <span>AI Support</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tracking & Map */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Tracking Stepper */}
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <TrackingStepper 
                steps={trackingSteps} 
                currentStep={currentStepIndex >= 0 ? currentStepIndex : 1} 
              />
            </div>

            {/* Map View */}
            <MapView driverName="Michael D." />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col gap-6">
            {/* Item List */}
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Items in Order</h3>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-[#181411] border border-[#393028] overflow-hidden flex-shrink-0">
                      <img 
                        alt={item.productName} 
                        className="w-full h-full object-cover" 
                        src={item.productImage} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.productName}</p>
                      <p className="text-xs text-[#baab9c]">Size: 10 • Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary-500 mt-1">${item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Shipping Details</h3>
              <div className="flex gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#baab9c] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">{order.shippingAddress?.fullName}</p>
                  <p className="text-sm text-[#baab9c] leading-relaxed">
                    {order.shippingAddress?.street}<br/>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-[#baab9c] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Contact Info</p>
                  <p className="text-sm text-[#baab9c]">{order.shippingAddress?.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#baab9c]">
                  <span>Subtotal</span>
                  <span>${(order.totalAmount - order.shippingFee - order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#baab9c]">
                  <span>Shipping</span>
                  <span>${order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#baab9c]">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-[#393028] flex justify-between font-bold text-lg text-white">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#baab9c] bg-[#181411] p-2 rounded">
                <span className="material-symbols-outlined text-base">credit_card</span>
                <span>Paid with Visa ending in 4242</span>
              </div>
            </div>

            {/* Rate Experience */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-6 border border-neutral-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl text-white">star</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Rate your experience</h3>
              <p className="text-sm text-neutral-300 mb-4 relative z-10">Help us improve by rating your delivery experience.</p>
              <div className="flex gap-1 relative z-10">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} className="text-neutral-500 hover:text-primary-500 transition-colors">
                    <span className="material-symbols-outlined text-2xl">star</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
