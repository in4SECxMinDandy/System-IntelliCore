import { MetadataRoute } from 'next';

// ==========================================
// Dynamic Sitemap (Phase 2.3 - SEO)
// Generates sitemap with static + dynamic routes
// ==========================================

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://intellicore.shop';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // ==========================================
    // Static routes
    // ==========================================
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/categories`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/community`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    // ==========================================
    // Dynamic product routes (fetch from API)
    // ==========================================
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/products?limit=1000&isActive=true`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });
        if (res.ok) {
            const data = await res.json();
            productRoutes = (data.data || []).map((product: any) => ({
                url: `${BASE_URL}/products/${product.slug}`,
                lastModified: new Date(product.updatedAt || now),
                changeFrequency: 'daily' as const,
                priority: product.isFeatured ? 0.9 : 0.7,
            }));
        }
    } catch {
        // Fallback: static sitemap if API unavailable during build
        console.warn('[sitemap] Could not fetch products — using static sitemap only');
    }

    // ==========================================
    // Dynamic category routes
    // ==========================================
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/categories`, {
            next: { revalidate: 86400 }, // Revalidate daily
        });
        if (res.ok) {
            const data = await res.json();
            categoryRoutes = (data.data || []).map((cat: any) => ({
                url: `${BASE_URL}/categories/${cat.slug}`,
                lastModified: now,
                changeFrequency: 'daily' as const,
                priority: 0.6,
            }));
        }
    } catch {
        console.warn('[sitemap] Could not fetch categories');
    }

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
