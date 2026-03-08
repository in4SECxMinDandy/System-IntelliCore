// ==========================================
// RecentlyViewed Component (Phase 2.1)
// Tracks and displays recently viewed products
// using localStorage + product API
// ==========================================

'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProductCardSkeleton } from './ui/Skeleton';
import Link from 'next/link';

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 8;

export function trackProductView(productId: string) {
    if (typeof window === 'undefined') return;
    try {
        const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filtered = existing.filter((id) => id !== productId);
        const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // ignore localStorage errors
    }
}

export default function RecentlyViewed() {
    const [productIds, setProductIds] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            setProductIds(stored.slice(0, 6));
        } catch {
            setProductIds([]);
        }
    }, []);

    const { data: products, isLoading } = useQuery({
        queryKey: ['recently-viewed', productIds],
        queryFn: async () => {
            if (productIds.length === 0) return [];
            const res = await api.get('/api/products/by-ids', {
                params: { ids: productIds.join(',') },
            });
            // Reorder to match localStorage order
            const map = new Map(res.data.data.map((p: any) => [p.id, p]));
            return productIds.map((id) => map.get(id)).filter(Boolean);
        },
        enabled: productIds.length > 0,
        staleTime: 60_000,
    });

    if (productIds.length === 0) return null;

    return (
        <section className="py-8" aria-label="Recently viewed products">
            <div className="flex items-center gap-2 mb-5">
                <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-foreground">Recently Viewed</h2>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {productIds.map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            ) : products && products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {products.map((product: any) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-card p-3 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                            aria-label={`View ${product.name}`}
                        >
                            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted/30">
                                {product.images?.[0]?.url ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.images[0].altText || product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                                        <Eye className="w-8 h-8" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                                    {product.name}
                                </p>
                                <p className="text-xs text-primary font-semibold mt-1">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(Number(product.salePrice || product.basePrice))}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
