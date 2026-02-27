'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { ShoppingBag, Zap, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured').then(r => r.data.data),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', 'for-you'],
    queryFn: () => api.get('/recommendations/for-you').then(r => r.data.data),
  });

  const { data: trending } = useQuery({
    queryKey: ['recommendations', 'trending'],
    queryFn: () => api.get('/recommendations/trending').then(r => r.data.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 mb-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Smart Shopping, Powered by AI</h1>
          <p className="text-blue-100 text-lg mb-6">
            Discover products tailored just for you with our ML-powered recommendation engine.
          </p>
          <Link href="/products" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Zap className="w-6 h-6" />, title: 'Personalized Picks', desc: 'AI learns your preferences' },
          { icon: <Star className="w-6 h-6" />, title: 'Top Rated', desc: 'Curated by real customers' },
          { icon: <TrendingUp className="w-6 h-6" />, title: 'Trending Now', desc: 'What everyone is buying' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">{f.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* For You */}
      {recommendations && recommendations.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
            <Link href="/products" className="text-blue-600 hover:underline text-sm">View all</Link>
          </div>
          <ProductGrid products={recommendations.slice(0, 8)} />
        </section>
      )}

      {/* Featured */}
      {featured && featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products?featured=true" className="text-blue-600 hover:underline text-sm">View all</Link>
          </div>
          <ProductGrid products={featured.slice(0, 8)} />
        </section>
      )}

      {/* Trending */}
      {trending && trending.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Now</h2>
            <Link href="/products" className="text-blue-600 hover:underline text-sm">View all</Link>
          </div>
          <ProductGrid products={trending.slice(0, 8)} />
        </section>
      )}
    </div>
  );
}
