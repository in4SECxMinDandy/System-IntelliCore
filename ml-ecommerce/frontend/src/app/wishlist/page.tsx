'use client';

import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// Demo wishlist items (in a real app this would come from backend)
const DEMO_WISHLIST = [
    {
        id: 'demo-1',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 1299000,
        image: 'https://picsum.photos/seed/headphones/300/300',
        slug: 'wireless-headphones',
        category: 'Electronics',
    },
    {
        id: 'demo-2',
        name: 'Premium Running Shoes',
        price: 890000,
        image: 'https://picsum.photos/seed/shoes/300/300',
        slug: 'running-shoes',
        category: 'Sports',
    },
];

export default function WishlistPage() {
    const { isAuthenticated } = useAuthStore();
    const { addItem } = useCartStore();
    const [wishlist, setWishlist] = useState(DEMO_WISHLIST);

    const handleRemove = (id: string) => {
        setWishlist((w) => w.filter((item) => item.id !== id));
        toast.success('Removed from wishlist');
    };

    const handleAddToCart = (item: typeof DEMO_WISHLIST[0]) => {
        addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
        toast.success(`${item.name} added to cart`);
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Sign in to view your wishlist</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Save your favorite items and come back anytime.</p>
                <Link href="/login" className="btn-primary btn-lg inline-flex items-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Your wishlist is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Start adding items you love!</p>
                <Link href="/products" className="btn-primary btn-lg inline-flex items-center gap-2">
                    Browse Products <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    My Wishlist
                    <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        ({wishlist.length} items)
                    </span>
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="card group overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-700">
                            <Link href={`/products/${item.slug}`}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                                    }}
                                />
                            </Link>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-colors"
                                aria-label="Remove from wishlist"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{item.category}</p>
                            <Link href={`/products/${item.slug}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 text-sm mb-2 block">
                                {item.name}
                            </Link>
                            <p className="font-bold text-primary-600 dark:text-primary-400 mb-3">
                                {formatPrice(item.price)}
                            </p>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className="btn-primary btn-sm w-full flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
