'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle, Cable } from 'lucide-react';

interface ReturnItemProps {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image: string;
  isReturnable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function ReturnItemCard({
  id,
  name,
  variant,
  quantity,
  price,
  image,
  isReturnable = true,
  isSelected = false,
  onSelect,
}: ReturnItemProps) {
  return (
    <label className={cn(
      'flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer group',
      isSelected
        ? 'bg-primary-500/5 border-primary-500/30 dark:bg-primary-500/10'
        : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
    )}>
      {/* Checkbox */}
      <div className="pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(id, e.target.checked)}
          className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary-500 focus:ring-0 focus:ring-offset-0 focus:border-primary-500 focus:outline-none accent-primary-500"
        />
      </div>

      {/* Image */}
      <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <Cable className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col grow gap-1">
        <div className="flex justify-between items-start w-full">
          <p className="text-gray-900 dark:text-white text-base font-semibold leading-tight">
            {name}
          </p>
          <span className="text-gray-900 dark:text-white font-bold">${price.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {variant && `${variant} • `}Qty: {quantity}
        </p>
        {isReturnable && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Returnable
          </div>
        )}
      </div>
    </label>
  );
}
