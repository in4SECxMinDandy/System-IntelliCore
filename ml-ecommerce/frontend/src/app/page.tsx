'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import {
  ShoppingBag, Zap, Star, TrendingUp, Shield, Truck, RefreshCw,
  ArrowRight, Sparkles, Users, Award, ChevronRight, Play
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Picks',
    desc: 'Our ML engine learns your preferences and delivers hyper-personalized recommendations.',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    desc: 'Real reviews from verified buyers with photos and detailed ratings.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: TrendingUp,
    title: 'Trending Now',
    desc: 'Stay ahead with real-time trending products and viral deals.',
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Join thousands of shoppers sharing tips, reviews, and exclusive deals.',
    color: 'from-purple-400 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
];

const trustBadges = [
  { icon: Shield, text: 'Secure Payments', sub: 'SSL encrypted' },
  { icon: Truck, text: 'Fast Delivery', sub: '2-5 business days' },
  { icon: RefreshCw, text: 'Easy Returns', sub: '30-day policy' },
  { icon: Award, text: 'Quality Guarantee', sub: 'Verified products' },
];

const categories = [
  { name: 'Electronics', emoji: '💻', href: '/products?category=electronics', count: '2.4k+' },
  { name: 'Fashion', emoji: '👗', href: '/products?category=fashion', count: '5.1k+' },
  { name: 'Home & Garden', emoji: '🏠', href: '/products?category=home', count: '1.8k+' },
  { name: 'Sports', emoji: '⚽', href: '/products?category=sports', count: '900+' },
  { name: 'Books', emoji: '📚', href: '/products?category=books', count: '3.2k+' },
  { name: 'Beauty', emoji: '💄', href: '/products?category=beauty', count: '1.5k+' },
  { name: 'Toys', emoji: '🧸', href: '/products?category=toys', count: '700+' },
  { name: 'Food', emoji: '🍕', href: '/products?category=food', count: '400+' },
];

const stats = [
  { value: '2M+', label: 'Happy Customers' },
  { value: '50K+', label: 'Products' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured').then(r => r.data.data),
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations', 'for-you'],
    queryFn: () => api.get('/recommendations/for-you').then(r => r.data.data),
  });

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['recommendations', 'trending'],
    queryFn: () => api.get('/recommendations/trending').then(r => r.data.data),
  });

  return (
    <div className="overflow-x-hidden">
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-dark-950 via-primary-950 to-dark-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Shopping Experience
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Shop Smarter
                <br />
                <span className="gradient-text">with AI</span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover products tailored just for you. Our ML engine analyzes your preferences to deliver the perfect shopping experience every time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="btn-primary btn-lg group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/community"
                  className="btn-outline btn-lg border-white/20 text-white hover:bg-white/10"
                >
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Product Showcase */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main product card */}
                <div className="absolute inset-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">🛍️</div>
                    <p className="text-white font-semibold text-lg">Personalized for You</p>
                    <p className="text-gray-400 text-sm mt-1">50,000+ products curated by AI</p>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute top-4 right-0 bg-white dark:bg-dark-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-dark-700 animate-bounce-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Sales Today</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+24% ↑</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-0 bg-white dark:bg-dark-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-dark-700 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Top Rated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">4.9/5 stars</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-4 bg-primary-600 rounded-2xl p-3 shadow-xl animate-bounce-subtle" style={{ animationDelay: '1s' }}>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">AI Match</p>
                    <p className="text-lg font-bold text-white">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRUST BADGES
          ========================================== */}
      <section className="bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CATEGORIES
          ========================================== */}
      <section className="section bg-gray-50 dark:bg-dark-950">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shop by Category</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Explore our wide range of categories</p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="card card-hover p-4 text-center group"
              >
                <div className="text-3xl mb-2 transition-transform duration-200 group-hover:scale-110">{cat.emoji}</div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{cat.name}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES
          ========================================== */}
      <section className="section bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Why IntelliCore?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              We combine cutting-edge AI with a seamless shopping experience to help you find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg, text }) => (
              <div key={title} className="card p-6 card-hover group">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', bg)}>
                  <Icon className={cn('w-6 h-6', text)} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          PERSONALIZED RECOMMENDATIONS
          ========================================== */}
      {(recommendations?.length > 0 || recsLoading) && (
        <section className="section bg-gray-50 dark:bg-dark-950">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recommended For You</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Personalized picks based on your preferences</p>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid
              products={recommendations?.slice(0, 8) || []}
              loading={recsLoading}
              columns={4}
            />
          </div>
        </section>
      )}

      {/* ==========================================
          FEATURED PRODUCTS
          ========================================== */}
      {(featured?.length > 0 || featuredLoading) && (
        <section className="section bg-white dark:bg-dark-900">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Products</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Hand-picked by our team</p>
              </div>
              <Link href="/products?featured=true" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid
              products={featured?.slice(0, 8) || []}
              loading={featuredLoading}
              columns={4}
            />
          </div>
        </section>
      )}

      {/* ==========================================
          TRENDING
          ========================================== */}
      {(trending?.length > 0 || trendingLoading) && (
        <section className="section bg-gray-50 dark:bg-dark-950">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🔥 Trending Now</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">What everyone is buying right now</p>
              </div>
              <Link href="/products?sort=popular" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid
              products={trending?.slice(0, 8) || []}
              loading={trendingLoading}
              columns={4}
            />
          </div>
        </section>
      )}

      {/* ==========================================
          COMMUNITY CTA
          ========================================== */}
      <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Join 2M+ Shoppers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Be Part of Our Community
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Share reviews, join shopping challenges, follow friends, and discover exclusive community deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-lg bg-white text-primary-600 hover:bg-primary-50 font-semibold rounded-lg px-8 py-3 inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link href="/community" className="btn-lg border border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg px-8 py-3 inline-flex items-center gap-2">
                <Users className="w-5 h-5" />
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
