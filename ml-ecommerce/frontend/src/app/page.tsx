'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import {
  ShoppingBag, Zap, Star, TrendingUp, Shield, Truck, RefreshCw,
  ArrowRight, Sparkles, Users, Award, ChevronRight, Brain,
  Tag, Heart, Search, ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Picks',
    desc: 'Our ML engine learns your preferences and delivers hyper-personalised recommendations in real-time.',
    color: 'text-primary-600',
    bg: 'bg-primary-50 dark:bg-primary-900/10',
    border: 'border-primary-100 dark:border-primary-900/20',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    desc: 'Real reviews from verified buyers with photos, detailed ratings, and authenticity checks.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-100 dark:border-amber-900/20',
  },
  {
    icon: TrendingUp,
    title: 'Trending Now',
    desc: 'Stay ahead with real-time trending products, viral deals, and flash sales.',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-100 dark:border-green-900/20',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Join thousands of shoppers sharing tips, reviews, and exclusive community-only deals.',
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/10',
    border: 'border-violet-100 dark:border-violet-900/20',
  },
];

const trustBadges = [
  { icon: Shield, text: 'Secure Payments', sub: 'SSL & PCI-DSS encrypted' },
  { icon: Truck, text: 'Fast Delivery', sub: '2-5 business days' },
  { icon: RefreshCw, text: 'Easy Returns', sub: '30-day hassle-free policy' },
  { icon: Award, text: 'Quality Guarantee', sub: 'All products verified' },
];

const categories = [
  { name: 'Electronics', emoji: '💻', href: '/products?category=electronics', count: '2.4k+' },
  { name: 'Fashion', emoji: '👗', href: '/products?category=fashion', count: '5.1k+' },
  { name: 'Home', emoji: '🏠', href: '/products?category=home', count: '1.8k+' },
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
  { value: '4.9★', label: 'Avg Rating' },
];

const promos = [
  {
    tag: 'Flash Sale',
    title: 'Up to 60% OFF',
    sub: 'Electronics & Gadgets',
    cta: 'Shop Now',
    href: '/products?category=electronics&sale=true',
    bg: 'from-primary-600 to-primary-800',
    emoji: '⚡',
  },
  {
    tag: 'New Arrivals',
    title: 'Fresh Styles',
    sub: 'Fashion & Apparel',
    cta: 'Browse',
    href: '/products?category=fashion&sort=newest',
    bg: 'from-violet-600 to-purple-700',
    emoji: '✨',
  },
  {
    tag: 'AI Picks',
    title: 'Just For You',
    sub: 'Personalised recommendations',
    cta: 'Discover',
    href: '/products?ai=true',
    bg: 'from-emerald-600 to-teal-700',
    emoji: '🤖',
  },
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
          HERO — Stitch dark hero with red accent
          ========================================== */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0505 0%, #1f0707 50%, #0d0505 100%)' }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Red glow blobs */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #ea2a33 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Diagonal accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left content */}
            <div className="text-center lg:text-left animate-slide-up">
              {/* Stitch AI badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-primary-600/15 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 text-primary-400" />
                AI-Powered Shopping Experience
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
                Shop Smarter{' '}
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover products tailored just for you. Our ML engine analyses your preferences
                to deliver the perfect shopping experience — every single time.
              </p>

              {/* Search bar — Stitch style */}
              <div className="relative max-w-md mx-auto lg:mx-0 mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search 50,000+ products..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm
                    border border-white/20 text-white placeholder:text-gray-400 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50
                    transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/products" className="btn-primary btn-lg group">
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/community"
                  className="btn-lg border border-white/20 text-white hover:bg-white/10 rounded-lg
                    inline-flex items-center justify-center gap-2 font-medium transition-all duration-200">
                  <Users className="w-4 h-4" />
                  Join Community
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Promo cards */}
            <div className="hidden lg:flex flex-col gap-4 animate-fade-in">
              {promos.map((promo) => (
                <Link key={promo.href} href={promo.href}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl p-6',
                    'bg-gradient-to-r', promo.bg,
                    'hover:scale-[1.02] transition-transform duration-300'
                  )}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                        {promo.tag}
                      </span>
                      <p className="text-2xl font-bold text-white mt-0.5">{promo.title}</p>
                      <p className="text-sm text-white/70 mt-1">{promo.sub}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-4xl">{promo.emoji}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/80
                        group-hover:text-white transition-colors">
                        {promo.cta} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          TRUST BADGES — Stitch clean white strip
          ========================================== */}
      <section className="bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-dark-800">
            {trustBadges.map(({ icon: Icon, text, sub }, i) => (
              <div key={text}
                className={cn(
                  'flex items-center gap-3 px-6 py-3',
                  i === 0 && 'pl-0',
                )}>
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/10 rounded-xl
                  flex items-center justify-center shrink-0">
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
          CATEGORIES — Stitch grid style
          ========================================== */}
      <section className="section bg-gray-50 dark:bg-dark-950">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-heading">Shop by Category</h2>
              <p className="section-subheading">Explore our wide range of categories</p>
            </div>
            <Link href="/products"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href}
                className="card card-hover p-4 text-center group cursor-pointer">
                <div className="text-3xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {cat.emoji}
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
                  {cat.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY INTELLICORE — Feature cards
          ========================================== */}
      <section className="section bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400
              text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Why IntelliCore
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Shopping, Reimagined
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              We combine cutting-edge AI with a seamless shopping experience to help you find
              exactly what you need — faster and smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div key={title}
                className={cn('card card-hover p-6 group border', border)}>
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', bg)}>
                  <Icon className={cn('w-6 h-6', color)} />
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
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="section-heading">Recommended For You</h2>
                </div>
                <p className="section-subheading">AI-personalised picks based on your preferences</p>
              </div>
              <Link href="/products"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
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
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="section-heading">Featured Products</h2>
                </div>
                <p className="section-subheading">Hand-picked by our team</p>
              </div>
              <Link href="/products?featured=true"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
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
          TRENDING — Hot this week
          ========================================== */}
      {(trending?.length > 0 || trendingLoading) && (
        <section className="section bg-gray-50 dark:bg-dark-950">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="section-heading">🔥 Trending Now</h2>
                </div>
                <p className="section-subheading">What everyone is buying right now</p>
              </div>
              <Link href="/products?sort=popular"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
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
          PROMOTION BANNER — Stitch style
          ========================================== */}
      <section className="section bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 relative overflow-hidden rounded-2xl p-8
              bg-gradient-to-r from-primary-600 to-primary-800">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
                style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-3">
                <Zap className="w-3.5 h-3.5" /> Limited Time
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">
                Flash Sale — Up to 60% OFF
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Don't miss out on today's best deals. Sale ends midnight!
              </p>
              <Link href="/products?sale=true"
                className="btn-lg bg-white text-primary-600 hover:bg-primary-50 rounded-lg
                  inline-flex items-center gap-2 font-semibold">
                <Tag className="w-4 h-4" />
                Shop Sale
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-6
              bg-gradient-to-br from-gray-900 to-gray-800 dark:from-dark-700 dark:to-dark-800">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
                Top Picks
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Wishlist Deals 💝
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Items on your wishlist are now on sale!
              </p>
              <Link href="/profile?tab=wishlist"
                className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300
                  text-sm font-semibold transition-colors">
                <Heart className="w-4 h-4" />
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          COMMUNITY CTA — Stitch red gradient
          ========================================== */}
      <section className="relative overflow-hidden py-20"
        style={{ background: 'linear-gradient(135deg, #1f0707 0%, #2d0707 50%, #1a0505 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #ea2a33 0%, transparent 70%)' }} />
          <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        </div>

        <div className="container-custom relative text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/10 text-white text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Join 2M+ Shoppers
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Be Part of Our
              <br />
              <span className="text-primary-400">Community</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Share reviews, join shopping challenges, follow friends, and discover
              exclusive community-only deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="btn-primary btn-lg">
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link href="/community"
                className="btn-lg border border-white/20 text-white hover:bg-white/10 rounded-lg
                  inline-flex items-center justify-center gap-2 font-medium transition-all duration-200">
                <Users className="w-4 h-4" />
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
