'use client';

import Link from 'next/link';
import { Tag, Timer, Zap, TrendingDown, ArrowRight } from 'lucide-react';

const deals = [
    {
        id: '1',
        title: 'Flash Sale — Electronics',
        discount: '30% OFF',
        description: 'Huge discounts on laptops, phones, and accessories. Limited time only!',
        endsIn: '2h 30m',
        color: 'from-red-500 to-orange-500',
        href: '/products?category=electronics&sale=true',
        icon: Zap,
    },
    {
        id: '2',
        title: 'Fashion Week',
        discount: 'Up to 50% OFF',
        description: 'Trending fashion items at unbeatable prices. New arrivals daily.',
        endsIn: '1d 12h',
        color: 'from-purple-500 to-pink-500',
        href: '/products?category=fashion&sale=true',
        icon: Tag,
    },
    {
        id: '3',
        title: 'Home & Living Deals',
        discount: '20-40% OFF',
        description: 'Upgrade your home with our curated selection of home essentials.',
        endsIn: '3d',
        color: 'from-blue-500 to-cyan-500',
        href: '/products?category=home&sale=true',
        icon: TrendingDown,
    },
];

export default function DealsPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Zap className="w-4 h-4" />
                    Limited Time Offers
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Today's Best Deals
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Don't miss out on our handpicked deals and exclusive offers. Updated daily!
                </p>
            </div>

            {/* Deal Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-12">
                {deals.map((deal) => {
                    const Icon = deal.icon;
                    return (
                        <Link
                            key={deal.id}
                            href={deal.href}
                            className="group relative overflow-hidden rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${deal.color}`} />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                            <div className="relative p-6">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold mb-1">{deal.discount}</div>
                                <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
                                <p className="text-white/80 text-sm mb-4">{deal.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-white/90 text-xs">
                                        <Timer className="w-3.5 h-3.5" />
                                        Ends in {deal.endsIn}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        Shop now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* CTA to all products */}
            <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Want to browse all products?</p>
                <Link href="/products" className="btn-primary btn-lg inline-flex items-center gap-2">
                    View All Products <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
