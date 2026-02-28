'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart, Heart, Share2, Star, ChevronRight, Minus, Plus,
  Truck, Shield, RefreshCw, Package, ThumbsUp, Camera, Check,
  MessageSquare, Zap, TrendingUp, ArrowLeft, Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, calculateDiscount, formatRelativeTime, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import ProductGrid from '@/components/ProductGrid';
import toast from 'react-hot-toast';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' :
              i === Math.floor(rating) && rating % 1 >= 0.5 ? 'text-yellow-400 fill-yellow-200' :
                'text-gray-200 dark:text-dark-600'
          )}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specs'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => api.get(`/reviews?productId=${product?.id}&limit=10`).then(r => r.data.data),
    enabled: !!product?.id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', product?.id],
    queryFn: () => api.get(`/recommendations/related/${product?.id}`).then(r => r.data.data),
    enabled: !!product?.id,
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: typeof reviewForm) =>
      api.post('/reviews', { ...data, productId: product?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', product?.id] });
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', content: '' });
      toast.success('Review submitted successfully!');
    },
    onError: () => toast.error('Failed to submit review'),
  });

  const handleAddToCart = () => {
    if (!product) return;
    const price = product.salePrice || product.basePrice;
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(price),
      image: product.images?.[0]?.url,
      quantity,
      variantId: selectedVariant || undefined,
    });
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181411] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="skeleton aspect-square rounded-2xl bg-[#2D241B]" />
            <div className="space-y-4">
              <div className="skeleton h-8 rounded w-3/4 bg-[#2D241B]" />
              <div className="skeleton h-6 rounded w-1/2 bg-[#2D241B]" />
              <div className="skeleton h-10 rounded w-1/3 bg-[#2D241B]" />
              <div className="skeleton h-24 rounded bg-[#2D241B]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-[#393028] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Product not found</h2>
          <Link href="/products" className="inline-block px-6 py-3 bg-[#f27f0d] text-white rounded-lg font-medium hover:bg-[#d16b08] mt-4">Browse Products</Link>
        </div>
      </div>
    );
  }

  const basePrice = parseFloat(product.basePrice);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discount = salePrice ? calculateDiscount(basePrice, salePrice) : 0;
  const displayPrice = salePrice || basePrice;
  const isOutOfStock = product.stockQuantity === 0;
  const avgRating = reviews?.avgRating || 0;
  const reviewCount = reviews?.total || 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews?.items?.filter((r: { rating: number }) => r.rating === star).length || 0,
    percentage: reviewCount > 0
      ? Math.round((reviews?.items?.filter((r: { rating: number }) => r.rating === star).length || 0) / reviewCount * 100)
      : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-100 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-800">
            <Image
              src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge-danger text-sm font-bold px-3 py-1">
                -{discount}% OFF
              </div>
            )}
            {product.isFeatured && (
              <div className="absolute top-4 right-4 badge-primary text-sm font-bold px-3 py-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Featured
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img: { url: string }, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                    selectedImage === i
                      ? 'border-primary-500 shadow-glow'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-dark-500'
                  )}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-2 mb-2">
            {product.brand && (
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{product.brand.name}</span>
            )}
            {product.category && (
              <>
                <span className="text-gray-300 dark:text-dark-600">·</span>
                <Link href={`/products?category=${product.category.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  {product.category.name}
                </Link>
              </>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={avgRating} size="md" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
            {product.purchaseCount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {product.purchaseCount}+ sold
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(displayPrice)}
            </span>
            {salePrice && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(basePrice)}</span>
            )}
            {discount > 0 && (
              <span className="badge-danger text-sm font-bold">Save {discount}%</span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select Variant:
                {selectedVariant && (
                  <span className="font-normal text-gray-500 dark:text-gray-400 ml-2">
                    {product.variants.find((v: { id: string; variantName: string }) => v.id === selectedVariant)?.variantName}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: { id: string; variantName: string; stockQuantity: number }) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    disabled={variant.stockQuantity === 0}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                      selectedVariant === variant.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : variant.stockQuantity === 0
                          ? 'border-gray-200 dark:border-dark-600 text-gray-300 dark:text-dark-600 cursor-not-allowed line-through'
                          : 'border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
                    )}
                  >
                    {variant.variantName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quantity:</p>
            <div className="flex items-center border border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {product.stockQuantity !== undefined && product.stockQuantity <= 10 && product.stockQuantity > 0 && (
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Only {product.stockQuantity} left!
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                'flex-1 btn-lg flex items-center justify-center gap-2',
                isOutOfStock ? 'btn-secondary cursor-not-allowed' : 'btn-outline'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 btn-primary btn-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                'p-3 rounded-xl border-2 transition-all',
                isWishlisted
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
                  : 'border-gray-200 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700'
              )}
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
            </button>
            <button className="p-3 rounded-xl border-2 border-gray-200 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-dark-500 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
            {[
              { icon: Truck, text: 'Free shipping over $50' },
              { icon: Shield, text: '1-Year Warranty' },
              { icon: RefreshCw, text: '30-Day Returns' },
            ].map((Badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 text-center border border-gray-100 dark:border-dark-700 rounded-lg hover:border-primary-200 hover:bg-primary-50 dark:hover:border-primary-900/30 dark:hover:bg-primary-900/10 transition-colors">
                <Badge.icon className="w-6 h-6 text-primary-500 mb-2" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
