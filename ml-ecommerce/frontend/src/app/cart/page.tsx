'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Heart, X, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center py-20">
          <div className="w-20 h-20 bg-[#f27f0d]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#f27f0d]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Please sign in</h2>
          <p className="text-[#baab9c] mb-8">Sign in to view and manage your shopping cart</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f27f0d] text-white rounded-xl font-medium hover:bg-[#d16b08] transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center py-20">
          <div className="w-20 h-20 bg-[#2D241B] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#baab9c]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
          <p className="text-[#baab9c] mb-8">Looks like you haven't added anything yet!</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#f27f0d] text-white rounded-xl font-medium hover:bg-[#d16b08] transition-colors">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f27f0d] flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-lg font-bold text-white">ML Market</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <Heart className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="text-[#baab9c] mt-1">You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#221910] rounded-xl border border-[#393028] p-4 flex gap-4">
                <div className="w-24 h-24 bg-[#2D241B] rounded-lg flex-shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                      {item.variantName && (
                        <p className="text-sm text-[#baab9c] mt-1">{item.variantName}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-[#393028] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-[#baab9c]" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-[#2D241B] rounded-lg flex items-center justify-center hover:bg-[#393028] transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-[#2D241B] rounded-lg flex items-center justify-center hover:bg-[#393028] transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#f27f0d]">{formatPrice(item.price * item.quantity)}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-[#baab9c] line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#baab9c]">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#baab9c]">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                  </span>
                </div>
                {subtotal < 500000 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Free shipping</span>
                    <span>Add {formatPrice(500000 - subtotal)} more</span>
                  </div>
                )}
                <div className="border-t border-[#393028] pt-3 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-xl font-bold text-[#f27f0d]">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3 bg-[#f27f0d] text-white text-center rounded-xl font-medium hover:bg-[#d16b08] transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full py-3 mt-3 text-center text-[#baab9c] hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>

              {/* AI Recommendation */}
              <div className="mt-6 p-4 bg-gradient-to-br from-[#f27f0d]/10 to-transparent rounded-xl border border-[#f27f0d]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#f27f0d]" />
                  <span className="text-sm font-medium text-white">AI Recommendation</span>
                </div>
                <p className="text-xs text-[#baab9c]">
                  Based on your cart, you might like these items that are frequently bought together!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
