'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import { useState } from 'react';
import { Filter } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, sort, order, search, category }],
    queryFn: () => api.get('/products', {
      params: { page, limit: 20, sort, order, search: search || undefined, category: category || undefined },
    }).then(r => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {search ? `Results for "${search}"` : 'All Products'}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={`${sort}-${order}`}
            onChange={e => {
              const [s, o] = e.target.value.split('-');
              setSort(s); setOrder(o);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="purchaseCount-desc">Best Selling</option>
            <option value="basePrice-asc">Price: Low to High</option>
            <option value="basePrice-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <ProductGrid products={data?.data || []} />
          {data?.pagination && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.pages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
