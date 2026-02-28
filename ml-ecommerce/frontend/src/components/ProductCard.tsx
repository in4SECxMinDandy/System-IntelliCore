'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye, Share2, Zap, TrendingUp } from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  salePrice?: number | string | null;
  images?: { url: string; isPrimary?: boolean }[];
  category?: { name: string; slug: string };
  brand?: { name: string };
  rating?: number;
  reviewCount?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  tags?: string[];
  purchaseCount?: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal' | 'featured';
  showWishlist?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  variant = 'default',
  showWishlist = true,
  className,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  const primaryImage = product.images?.find(img => img.isPrimary)?.url
    || product.images?.[0]?.url
    || '/placeholder-product.jpg';

  const secondaryImage = product.images?.[1]?.url;

  const basePrice = typeof product.basePrice === 'string'
    ? parseFloat(product.basePrice)
    : product.basePrice;

  const salePrice = product.salePrice
    ? typeof product.salePrice === 'string'
      ? parseFloat(product.salePrice)
      : product.salePrice
    : null;

  const discount = salePrice ? calculateDiscount(basePrice, salePrice) : 0;
  const displayPrice = salePrice || basePrice;
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice as number,
      image: primaryImage,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: `/products/${product.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`);
      toast.success('Link copied!');
    }
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/products/${product.slug}`} className={cn('flex gap-4 card p-4 card-hover group', className)}>
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
          <Image
            src={imageError ? '/placeholder-product.jpg' : primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(displayPrice as number)}</span>
            {salePrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(basePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.slug}`} className={cn('card card-hover group overflow-hidden', className)}>
        <div className="relative aspect-square bg-gray-100 dark:bg-dark-700 overflow-hidden">
          <Image
            src={imageError ? '/placeholder-product.jpg' : primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 badge-danger text-[10px]">-{discount}%</span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{formatPrice(displayPrice as number)}</span>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <div
      className={cn('card card-hover group overflow-hidden relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-100 dark:bg-dark-700" style={{ aspectRatio: '4/3' }}>
        <Image
          src={imageError ? '/placeholder-product.jpg' : (isHovered && secondaryImage ? secondaryImage : primaryImage)}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge-danger text-xs font-bold">-{discount}%</span>
          )}
          {product.isNew && (
            <span className="badge-success text-xs font-bold">NEW</span>
          )}
          {product.isFeatured && (
            <span className="badge-primary text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Featured
            </span>
          )}
          {isLowStock && (
            <span className="badge-warning text-xs font-bold">Low Stock</span>
          )}
          {isOutOfStock && (
            <span className="badge-gray text-xs font-bold">Out of Stock</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={cn(
          'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-200',
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        )}>
          {showWishlist && (
            <button
              onClick={handleWishlist}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200',
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
            </button>
          )}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center justify-center shadow-md transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-8 h-8 rounded-full bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center justify-center shadow-md transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className={cn(
          'absolute bottom-0 left-0 right-0 p-3 transition-all duration-200',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-full'
        )}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              'w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
              isOutOfStock
                ? 'bg-gray-200 dark:bg-dark-700 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-1.5">
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {product.category.name}
            </Link>
          )}
          {product.brand && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{product.brand.name}</span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 dark:text-dark-600'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.rating.toFixed(1)}
              {product.reviewCount !== undefined && (
                <span className="ml-1">({product.reviewCount})</span>
              )}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(displayPrice as number)}
            </span>
            {salePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(basePrice)}
              </span>
            )}
          </div>

          {/* Purchase count indicator */}
          {product.purchaseCount !== undefined && product.purchaseCount > 100 && (
            <div className="flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
              <TrendingUp className="w-3 h-3" />
              <span>{product.purchaseCount > 1000 ? `${Math.floor(product.purchaseCount / 1000)}k` : product.purchaseCount}+ sold</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
