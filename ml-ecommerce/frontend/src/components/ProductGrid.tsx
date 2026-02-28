'use client';

import { useState } from 'react';
import { Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard, { type Product } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  columns?: 2 | 3 | 4 | 5;
  variant?: 'default' | 'compact';
  emptyMessage?: string;
  className?: string;
}

function ProductSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="card overflow-hidden">
        <div className="skeleton aspect-square" />
        <div className="p-3 space-y-2">
          <div className="skeleton h-4 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 rounded w-1/3" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-2/3" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton w-3.5 h-3.5 rounded" />
          ))}
        </div>
        <div className="skeleton h-5 rounded w-1/3" />
      </div>
    </div>
  );
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductGrid({
  products,
  loading = false,
  showFilters = false,
  showViewToggle = false,
  columns = 4,
  variant = 'default',
  emptyMessage = 'No products found.',
  className,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  };

  const skeletonCount = columns * 2;

  if (loading) {
    return (
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
          <SlidersHorizontal className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      {(showFilters || showViewToggle) && (
        <div className="flex items-center justify-between mb-4 gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">{products.length}</span> products
          </p>

          <div className="flex items-center gap-2">
            {/* Sort */}
            {showFilters && (
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {sortOptions.find(o => o.value === sortBy)?.label || 'Sort'}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', sortOpen && 'rotate-180')} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-xl shadow-lg py-1 w-48 z-20 animate-slide-down">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={cn(
                          'flex items-center w-full px-4 py-2 text-sm transition-colors',
                          sortBy === option.value
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex items-center border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                  )}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {viewMode === 'grid' ? (
        <div className={cn('grid gap-4', gridCols[columns])}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="horizontal"
            />
          ))}
        </div>
      )}
    </div>
  );
}
