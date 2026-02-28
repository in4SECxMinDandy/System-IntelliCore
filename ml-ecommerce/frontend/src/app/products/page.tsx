'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import { useState } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Living' },
  { id: 'sports', name: 'Sports' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'books', name: 'Books' },
];

const priceRanges = [
  { id: 'all', label: 'All Prices' },
  { id: '0-25', label: 'Under $25' },
  { id: '25-50', label: '$25 - $50' },
  { id: '50-100', label: '$50 - $100' },
  { id: '100-250', label: '$100 - $250' },
  { id: '250+', label: '$250+' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, sort, order, search, category }],
    queryFn: () => api.get('/products', {
      params: { page, limit: 20, sort, order, search: search || undefined, category: category || undefined },
    }).then(r => r.data),
  });

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
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#baab9c]" />
              <input
                type="text"
                defaultValue={search}
                placeholder="Search products..."
                className="w-full bg-[#221910] border border-[#393028] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
              <svg className="w-5 h-5 text-[#baab9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f27f0d] rounded-full text-xs flex items-center justify-center">3</span>
            </Link>
            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <svg className="w-5 h-5 text-[#baab9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {search ? `Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
          </h1>
          <p className="text-[#baab9c] mt-1">Browse our collection of {data?.total || '0'} products</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button className="text-sm text-[#f27f0d] hover:text-white">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-[#f27f0d] text-white'
                          : 'text-[#baab9c] hover:text-white hover:bg-[#2D241B]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPrice(range.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPrice === range.id
                          ? 'bg-[#f27f0d] text-white'
                          : 'text-[#baab9c] hover:text-white hover:bg-[#2D241B]'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button key={rating} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs">& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#221910] border border-[#393028] rounded-lg text-[#baab9c]"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <span className="text-sm text-[#baab9c]">{data?.total || 0} products</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#221910] border border-[#393028] rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-[#f27f0d] text-white' : 'text-[#baab9c]'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-[#f27f0d] text-white' : 'text-[#baab9c]'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <select
                  value={`${sort}-${order}`}
                  onChange={e => {
                    const [s, o] = e.target.value.split('-');
                    setSort(s); setOrder(o);
                  }}
                  className="bg-[#221910] border border-[#393028] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f27f0d]"
                >
                  <option value="createdAt-desc">Newest</option>
                  <option value="purchaseCount-desc">Best Selling</option>
                  <option value="basePrice-asc">Price: Low to High</option>
                  <option value="basePrice-desc">Price: High to Low</option>
                  <option value="rating-desc">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-[#221910] rounded-xl border border-[#393028] p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="text-[#baab9c]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            selectedCategory === cat.id
                              ? 'bg-[#f27f0d] text-white'
                              : 'bg-[#2D241B] text-[#baab9c]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#221910] rounded-xl overflow-hidden">
                    <div className="aspect-square bg-[#2D241B] animate-pulse"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-[#2D241B] rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-[#2D241B] rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.products?.length ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                {data.products.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`bg-[#221910] rounded-xl overflow-hidden hover:ring-1 hover:ring-[#f27f0d] transition-all ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    <div className={`bg-[#2D241B] ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-[#393028]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="text-white font-medium line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-[#baab9c]">({product.reviewCount || 0})</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#f27f0d]">${product.basePrice}</span>
                          {product.originalPrice && product.originalPrice > product.basePrice && (
                            <span className="text-sm text-[#baab9c] line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      {product.discount > 0 && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-[#393028] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#baab9c]">No products found</p>
                <button onClick={() => { setSelectedCategory('all'); setSelectedPrice('all'); }} className="mt-4 text-[#f27f0d] hover:text-white">
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#221910] border border-[#393028] rounded-lg text-[#baab9c] hover:text-white disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(data.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg ${
                      page === i + 1
                        ? 'bg-[#f27f0d] text-white'
                        : 'bg-[#221910] border border-[#393028] text-[#baab9c] hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 bg-[#221910] border border-[#393028] rounded-lg text-[#baab9c] hover:text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
