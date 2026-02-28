'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  labels?: { [key: number]: string };
}

export default function StarRating({
  value,
  onChange,
  maxStars = 5,
  size = 'md',
  readonly = false,
  showLabel = false,
  labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={readonly}
            className={cn(
              'transition-all duration-200',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              star <= value ? 'text-primary-500' : 'text-stitch-border hover:text-primary-500'
            )}
          >
            <Star
              className={cn(
                iconSizes[size],
                star <= value ? 'fill-current' : 'fill-none'
              )}
            />
          </button>
        ))}
      </div>
      {showLabel && value > 0 && (
        <span className={cn(
          'ml-2 font-medium',
          value >= 4 ? 'text-primary-500' : 'text-stitch-muted'
        )}>
          {labels[value] || ''}
        </span>
      )}
    </div>
  );
}
