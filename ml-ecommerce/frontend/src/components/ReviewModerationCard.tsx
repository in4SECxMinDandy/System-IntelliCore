'use client';

import { CheckCircle, Close, Warning, Mood, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  productName: string;
  content: string;
  rating: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  fakeProbability: number;
  createdAt: string;
  verifiedPurchase: boolean;
}

interface ReviewModerationCardProps {
  review: Review;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function ReviewModerationCard({ 
  review, 
  onApprove, 
  onReject 
}: ReviewModerationCardProps) {
  const sentimentConfig = {
    positive: { 
      label: 'Positive', 
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      icon: TrendingUp 
    },
    negative: { 
      label: 'Negative', 
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
      icon: TrendingDown 
    },
    neutral: { 
      label: 'Neutral', 
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      icon: Mood 
    },
  };

  const config = sentimentConfig[review.sentiment];
  const SentimentIcon = config.icon;
  const isHighFakeRisk = review.fakeProbability > 50;

  return (
    <div className="group flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-stitch-card border border-stitch-border shadow-sm hover:border-primary-500/50 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div 
          className="w-12 h-12 rounded-full bg-stitch-surface bg-cover bg-center"
          style={{ backgroundImage: review.reviewerAvatar ? `url('${review.reviewerAvatar}')` : undefined }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-white truncate">{review.reviewerName}</h4>
            <div className="flex items-center gap-2 text-xs text-stitch-muted">
              <span>{review.productName}</span>
              <span className="w-1 h-1 rounded-full bg-stitch-muted" />
              <span>{review.createdAt}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className={cn('px-2 py-1 rounded-md text-xs font-bold border', config.color)}>
              {config.label}
            </span>
            <span className={cn(
              'px-2 py-1 rounded-md text-xs font-bold border',
              isHighFakeRisk 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-stitch-surface text-stitch-muted border-stitch-border'
            )}>
              Fake Prob: {review.fakeProbability}%
            </span>
          </div>
        </div>

        <p className="text-sm text-stitch-muted leading-relaxed mb-3">
          {review.content}
        </p>

        <div className="flex gap-2">
          <button 
            onClick={() => onReject?.(review.id)}
            className="flex-1 py-1.5 rounded-lg bg-stitch-surface text-stitch-muted hover:bg-red-500 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <Close className="w-3 h-3" />
            Reject
          </button>
          <button 
            onClick={() => onApprove?.(review.id)}
            className="flex-1 py-1.5 rounded-lg bg-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
