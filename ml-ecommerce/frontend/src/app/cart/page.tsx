'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, fetchCart, updateItem, removeItem, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Please login to view your cart</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.product.images?.[0]?.url || 'https://picsum.photos/80/80'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                  {item.product.name}
                </Link>
                <p className="text-blue-600 font-semibold mt-1">
                  {Number(item.product.salePrice || item.product.basePrice).toLocaleString('vi-VN')}₫
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateItem(item.id, item.quantity - 1)} className="p-1 border rounded hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-1 border rounded hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{totalPrice().toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{totalPrice() >= 500000 ? 'Free' : '30,000₫'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-blue-600">
                {(totalPrice() + (totalPrice() >= 500000 ? 0 : 30000)).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 font-medium"
          >
            Proceed to Checkout
          </button>
          <Link href="/products" className="block text-center text-sm text-gray-500 mt-3 hover:text-blue-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
