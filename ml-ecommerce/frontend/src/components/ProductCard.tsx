'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images?: { url: string; isPrimary?: boolean }[];
  category?: { name: string };
  purchaseCount?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const image = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || 'https://picsum.photos/300/300';
  const price = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    await addItem(product.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      await api.post(`/wishlist/${product.id}`);
      toast.success('Added to wishlist');
    } catch {}
  };

  return (
    <Link href={`/products/${product.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{Math.round((1 - Number(product.salePrice) / Number(product.basePrice)) * 100)}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition hover:text-red-500"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        {product.category && (
          <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">
              {Number(price).toLocaleString('vi-VN')}₫
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-1">
                {Number(product.basePrice).toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
