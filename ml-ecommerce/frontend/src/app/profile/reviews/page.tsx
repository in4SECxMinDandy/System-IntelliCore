'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp, Filter, MessageSquare } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import { formatRelativeTime, getInitials } from '@/lib/utils';

interface UserReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  };
}

export default function ProfileReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['user-reviews'],
    queryFn: async () => {
      const res = await reviewsApi.getUserReviews();
      return res.data.data || [];
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: UserReview) => (
            <div key={review.id} className="bg-gray-50 dark:bg-dark-900 p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-dark-800 rounded-lg flex-shrink-0 overflow-hidden">
                  {review.product?.image && (
                    <img src={review.product.image} alt={review.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/products/${review.product?.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600">
                    {review.product?.name || 'Product'}
                  </Link>
                  <div className="flex items-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{review.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{review.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{formatRelativeTime(review.createdAt)}</span>
                    <button className="flex items-center gap-1 hover:text-primary-600">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful || 0})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You haven't written any reviews yet.</p>
          <Link href="/products" className="text-primary-600 hover:underline mt-2 inline-block">
            Browse products and share your experience!
          </Link>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/profile" className="text-primary-600 hover:underline">← Back to Profile</Link>
      </div>
    </div>
  );
}
