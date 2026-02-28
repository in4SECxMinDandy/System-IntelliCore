'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface RecommendedProductsProps {
  products: Product[];
  className?: string;
}

export function RecommendedProducts({ products, className }: RecommendedProductsProps) {
  return (
    <div className={cn('bg-surface-dark dark:bg-[#221910] rounded-xl p-5 border border-border-dark dark:border-[#393028]', className)}>
      <div className="flex items-center gap-2 mb-4 text-primary-500">
        <span className="material-symbols-outlined fill-current">auto_awesome</span>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group flex gap-3 items-start"
          >
            <div 
              className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-border-dark dark:border-[#393028] group-hover:border-primary-500 transition-colors"
              style={{ backgroundImage: product.image ? `url("${product.image}")` : undefined }}
            >
              {!product.image && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined">image</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary-500 transition-colors">
                {product.name}
              </p>
              <p className="text-primary-500 font-bold text-sm mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
