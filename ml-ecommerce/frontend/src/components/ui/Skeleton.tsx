// ==========================================
// Skeleton Loader Components (Phase 2.1)
// Reusable animated skeleton loaders for consistent
// loading states across the application
// ==========================================

import { cn } from '@/lib/utils';

// Base Skeleton pulse animation
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted/60',
                className
            )}
            {...props}
        />
    );
}

// ==========================================
// Product Card Skeleton
// ==========================================
export function ProductCardSkeleton() {
    return (
        <div className="group relative flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden">
            {/* Image placeholder */}
            <Skeleton className="aspect-square w-full" />

            <div className="p-4 space-y-3">
                {/* Category badge */}
                <Skeleton className="h-4 w-20" />

                {/* Product name */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-10" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Add to cart button */}
                <Skeleton className="h-10 w-full rounded-xl mt-2" />
            </div>
        </div>
    );
}

// ==========================================
// Product Grid Skeleton
// ==========================================
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

// ==========================================
// Order Card Skeleton
// ==========================================
export function OrderCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Items */}
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    );
}

// ==========================================
// Product Detail Skeleton
// ==========================================
export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image gallery */}
            <div className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Product info */}
            <div className="space-y-5">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-end gap-3">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ==========================================
// Review Card Skeleton
// ==========================================
export function ReviewCardSkeleton() {
    return (
        <div className="space-y-3 p-4 rounded-xl border border-border/40">
            <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

// ==========================================
// Stats Card Skeleton (for dashboards)
// ==========================================
export function StatsCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-3">
            <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}

// ==========================================
// Table Row Skeleton
// ==========================================
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <tr className="border-b border-border/40">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="p-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

export { Skeleton };
export default Skeleton;
