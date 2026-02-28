'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const subtotal = totalPrice();
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Please sign in</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to view and manage your shopping cart</p>
        <Link
          href="/login"
          className="btn-primary btn-lg inline-flex items-center gap-2"
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet!</p>
        <Link href="/products" className="btn-primary btn-lg inline-flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Shopping Cart
          <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variantId ?? 'default'}`}
              className="card p-4 flex gap-4"
            >
              {/* Product Image */}
              <Link href={`/products/${item.id}`} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700">
                <Image
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }}
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                {item.variantName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.variantName}
                  </p>
                )}
                <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Item Total + Delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id, item.variantId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-900 dark:text-gray-100 font-medium'}>
                  {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  Add {formatPrice(500000 - subtotal)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-100 dark:border-dark-700 pt-3 flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary btn-lg w-full justify-center flex items-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/products"
              className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mt-4 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
