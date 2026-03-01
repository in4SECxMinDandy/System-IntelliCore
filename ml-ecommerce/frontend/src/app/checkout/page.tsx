'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import {
  CreditCard, Lock, ChevronRight, MapPin, Package,
  CheckCircle, Truck, Shield, Tag, Loader2, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: Package },
];

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentForm {
  method: 'stripe' | 'paypal' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Force dark theme only on client after hydration
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [payment, setPayment] = useState<PaymentForm>({
    method: 'stripe',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const subtotal = totalPrice();
  const shippingFee = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = couponDiscount;
  const total = subtotal + shippingFee + tax - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, orderAmount: subtotal });
      const { discountAmount } = res.data.data;
      setCouponDiscount(discountAmount);
      toast.success(`Coupon applied! You save ${formatPrice(discountAmount)}`);
    } catch {
      toast.error('Invalid or expired coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingAddress: shipping,
        paymentMethod: payment.method,
        couponCode: couponCode || undefined,
        subtotal,
        shippingFee,
        taxAmount: tax,
        discountAmount: discount,
        totalAmount: total,
      };

      const res = await api.post('/orders', orderData);
      const newOrderId = res.data.data.id;
      setOrderId(newOrderId);

      // If Stripe, create payment intent
      if (payment.method === 'stripe') {
        const paymentRes = await api.post('/payments/create-intent', {
          orderId: newOrderId,
          amount: Math.round(total * 100),
        });
        // In production, use Stripe.js to confirm payment
        // For now, simulate success
      }

      clearCart();
      setOrderComplete(true);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-8">
          Order ID: #{orderId || 'ORD-' + Date.now()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/orders/${orderId}`} className="btn-primary btn-lg">
            <Package className="w-5 h-5" />
            Track Order
          </Link>
          <Link href="/products" className="btn-outline btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 dark:text-dark-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products before checking out</p>
        <Link href="/products" className="btn-primary btn-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart" className="btn-ghost btn-sm p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                currentStep === step.id
                  ? 'bg-primary-600 text-white'
                  : step.id < currentStep
                    ? 'text-primary-600 dark:text-primary-400 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
              )}
            >
              <step.icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className={cn(
                'w-4 h-4 mx-1',
                step.id < currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-300 dark:text-dark-600'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={e => setShipping(prev => ({ ...prev, fullName: e.target.value }))}
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={e => setShipping(prev => ({ ...prev, email: e.target.value }))}
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={e => setShipping(prev => ({ ...prev, phone: e.target.value }))}
                    className="input"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <select
                    value={shipping.country}
                    onChange={e => setShipping(prev => ({ ...prev, country: e.target.value }))}
                    className="input"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="VN">Vietnam</option>
                  </select>
                </div>
                <div className="form-group sm:col-span-2">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={e => setShipping(prev => ({ ...prev, address: e.target.value }))}
                    className="input"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={e => setShipping(prev => ({ ...prev, city: e.target.value }))}
                    className="input"
                    placeholder="New York"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State/Province *</label>
                  <input
                    type="text"
                    value={shipping.state}
                    onChange={e => setShipping(prev => ({ ...prev, state: e.target.value }))}
                    className="input"
                    placeholder="NY"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    value={shipping.zipCode}
                    onChange={e => setShipping(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="input"
                    placeholder="10001"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Shipping Method</h3>
                <div className="space-y-2">
                  {[
                    { id: 'standard', label: 'Standard Shipping', time: '5-7 business days', price: subtotal > 50 ? 'FREE' : '$9.99' },
                    { id: 'express', label: 'Express Shipping', time: '2-3 business days', price: '$19.99' },
                    { id: 'overnight', label: 'Overnight Shipping', time: 'Next business day', price: '$39.99' },
                  ].map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-dark-600 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                      <input type="radio" name="shipping" value={method.id} defaultChecked={method.id === 'standard'} className="text-primary-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{method.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> {method.time}
                        </p>
                      </div>
                      <span className={cn(
                        'text-sm font-semibold',
                        method.price === 'FREE' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                      )}>
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!shipping.fullName || !shipping.email || !shipping.address}
                className="btn-primary btn-lg w-full mt-6"
              >
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Payment Method
              </h2>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'stripe', label: 'Credit Card', icon: '💳' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPayment(prev => ({ ...prev, method: method.id as PaymentForm['method'] }))}
                    className={cn(
                      'p-4 rounded-xl border-2 text-center transition-all',
                      payment.method === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                    )}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{method.label}</p>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {payment.method === 'stripe' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">Your payment is secured with 256-bit SSL encryption</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={e => setPayment(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="input"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      value={payment.cardName}
                      onChange={e => setPayment(prev => ({ ...prev, cardName: e.target.value }))}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        value={payment.expiryDate}
                        onChange={e => setPayment(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="input"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        value={payment.cvv}
                        onChange={e => setPayment(prev => ({ ...prev, cvv: e.target.value }))}
                        className="input"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {payment.method === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You'll be redirected to PayPal to complete your payment</p>
                  <div className="text-4xl">🅿️</div>
                </div>
              )}

              {payment.method === 'cod' && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Pay with cash when your order is delivered. Additional fee of $2.00 applies.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep(1)} className="btn-outline btn-lg flex-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setCurrentStep(3)} className="btn-primary btn-lg flex-1">
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Review Your Order
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                    <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-dark-700 overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                      {formatPrice((item.price as number) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Summary */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Shipping to:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {shipping.fullName}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.zipCode}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(2)} className="btn-outline btn-lg flex-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn-primary btn-lg flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order ({formatPrice(total)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h3>

            {/* Items */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-thin">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 shrink-0">
                    {formatPrice((item.price as number) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider mb-4" />

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="input flex-1 text-sm"
              />
              <button
                onClick={applyCoupon}
                disabled={couponLoading || !couponCode}
                className="btn-outline btn-sm px-3"
              >
                {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className={shippingFee === 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-900 dark:text-gray-100'}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax (8%)</span>
                <span className="text-gray-900 dark:text-gray-100">{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="divider" />
              <div className="flex justify-between font-bold text-base">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'PayPal', 'Stripe', 'Apple Pay'].map(method => (
                <span key={method} className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 text-xs rounded font-medium">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
