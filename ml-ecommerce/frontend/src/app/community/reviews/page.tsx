'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Users, MessageSquare, Trophy, TrendingUp, Star, Filter, Heart,
  Share2, ThumbsUp, MessageCircle, Eye, Clock
} from 'lucide-react';
import { communityApi, reviewsApi, productsApi } from '@/lib/api';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'feed', label: 'Community Feed', icon: Users },
  { id: 'forum', label: 'Forum', icon: MessageSquare },
  { id: 'challenges', label: 'Challenges', icon: Trophy },
  { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
];

// Simple number formatter to avoid hydration mismatch
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

interface Post {
  id: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  product?: {
    name: string;
    slug: string;
    rating: number;
    image?: string;
  };
  isLiked?: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  prize: string;
  endsAt: string;
  emoji: string;
  difficulty: string;
  isJoined?: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  reviews: number;
  purchases: number;
  badge: string;
}

export default function CommunityReviewsPage() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedTab = sessionStorage.getItem('community_active_tab');
    if (savedTab && tabs.some(t => t.id === savedTab)) {
      setActiveTab(savedTab);
      sessionStorage.removeItem('community_active_tab');
    }
  }, []);

  // Fetch posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const res = await communityApi.getPosts({ limit: 20 });
      return res.data.data || [];
    },
  });

  // Fetch challenges
  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: ['community-challenges'],
    queryFn: async () => {
      const res = await communityApi.getChallenges();
      return res.data.data || [];
    },
  });

  // Fetch leaderboard
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['community-leaderboard'],
    queryFn: async () => {
      const res = await communityApi.getLeaderboard({ limit: 10 });
      return res.data.data || [];
    },
  });

  // Fetch products for reviews
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await productsApi.getFeatured();
      return res.data.data || [];
    },
  });

  // Fetch reviews for each product
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['product-reviews'],
    queryFn: async () => {
      if (!productsData || productsData.length === 0) return [];
      const reviewsPromises = productsData.slice(0, 6).map(async (product: any) => {
        try {
          const res = await reviewsApi.getProductReviews(product.id, { limit: 3 });
          return {
            product,
            reviews: res.data.data || [],
          };
        } catch {
          return { product, reviews: [] };
        }
      });
      return Promise.all(reviewsPromises);
    },
    enabled: !!productsData && productsData.length > 0,
  });

  const handleLike = async (postId: string) => {
    try {
      await communityApi.likePost(postId);
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (next.has(postId)) {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const posts: Post[] = postsData || [];
  const challenges: Challenge[] = challengesData || [];
  const leaderboard: LeaderboardUser[] = leaderboardData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Community</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Connect, share, and discover with fellow shoppers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customer Reviews</h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading reviews...</div>
          ) : reviewsData && reviewsData.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {reviewsData.map(({ product, reviews }: any) => (
                <div key={product.id} className="bg-gray-50 dark:bg-dark-900 p-4 rounded-lg">
                  <Link href={`/products/${product.slug}`} className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-600">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{reviews.length} reviews</p>
                    </div>
                  </Link>
                  <div className="space-y-3">
                    {reviews.slice(0, 2).map((review: any) => (
                      <div key={review.id} className="bg-white dark:bg-dark-800 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-xs text-primary-600 dark:text-primary-400">
                              {getInitials(review.user?.name || 'User')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.user?.name || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review a product!
            </div>
          )}
        </div>
      )}

      {/* Feed Tab Content */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {postsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-dark-900 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {getInitials(post.author?.name || 'User')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{post.author?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{formatRelativeTime(post.createdAt)}</p>
                  </div>
                </div>
                {post.product && (
                  <Link href={`/products/${post.product.slug}`} className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-dark-700 rounded">
                      {post.product.image && (
                        <img src={post.product.image} alt={post.product.name} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{post.product.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < post.product!.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                        ))}
                      </div>
                    </div>
                  </Link>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                    <Heart className={cn("w-5 h-5", (likedPosts.has(post.id) || post.isLiked) && "fill-red-500 text-red-500")} />
                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-primary-600">
                    <MessageCircle className="w-5 h-5" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-primary-600">
                    <Share2 className="w-5 h-5" />
                    {post.shares}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Be the first to share!
            </div>
          )}
        </div>
      )}

      {/* Challenges Tab Content */}
      {activeTab === 'challenges' && (
        <div className="grid md:grid-cols-2 gap-4">
          {challengesLoading ? (
            <div className="col-span-2 text-center py-8 text-gray-500">Loading challenges...</div>
          ) : challenges.length > 0 ? (
            challenges.map(challenge => (
              <div key={challenge.id} className="bg-white dark:bg-dark-900 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{challenge.emoji}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    challenge.difficulty === 'Easy' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                    challenge.difficulty === 'Medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
                    challenge.difficulty === 'Hard' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  )}>
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{challenge.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{challenge.participants} participants</span>
                  <span className="font-medium text-primary-600">{challenge.prize}</span>
                </div>
                <button className="w-full mt-4 btn-primary btn-sm">
                  {challenge.isJoined ? 'Joined' : 'Join Challenge'}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No active challenges. Check back soon!
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab Content */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-dark-900 rounded-lg overflow-hidden">
          {leaderboardLoading ? (
            <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>
          ) : leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reviews</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                  {leaderboard.map(user => (
                    <tr key={user.rank} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{user.badge}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-sm text-primary-600 dark:text-primary-400">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatNumber(user.points)}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.reviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No leaderboard data yet.
            </div>
          )}
        </div>
      )}

      {/* Forum Tab Content */}
      {activeTab === 'forum' && (
        <div className="bg-white dark:bg-dark-900 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800" 
            />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-dark-700">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{post.content}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.likes} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
