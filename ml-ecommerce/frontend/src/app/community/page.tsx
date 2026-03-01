'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users, MessageSquare, Trophy, TrendingUp, Heart, Share2,
  Plus, Search, Filter, ChevronRight, Star, Award, Flame,
  ThumbsUp, Eye, Clock, Tag, UserPlus
} from 'lucide-react';
import api from '@/lib/api';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

const tabs = [
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

const mockPosts = [
  {
    id: '1',
    author: { name: 'Sarah Chen', avatar: null, badge: 'Top Reviewer' },
    content: 'Just got the new Sony WH-1000XM5 headphones and they are absolutely incredible! The noise cancellation is next level. Highly recommend for anyone working from home 🎧',
    images: [],
    likes: 142,
    comments: 28,
    shares: 15,
    tags: ['Electronics', 'Audio', 'WFH'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    product: { name: 'Sony WH-1000XM5', rating: 5 },
  },
  {
    id: '2',
    author: { name: 'Mike Johnson', avatar: null, badge: 'Deal Hunter' },
    content: 'Found an amazing deal on running shoes! 40% off the Nike Air Zoom Pegasus. Perfect timing for the marathon season. Link in comments 🏃‍♂️',
    images: [],
    likes: 89,
    comments: 45,
    shares: 32,
    tags: ['Sports', 'Deals', 'Running'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    product: { name: 'Nike Air Zoom Pegasus', rating: 4.5 },
  },
  {
    id: '3',
    author: { name: 'Emma Wilson', avatar: null, badge: 'Style Icon' },
    content: 'My home office setup is finally complete! Sharing my full setup guide with all the products I used. Total cost was under $800 and it looks amazing ✨',
    images: [],
    likes: 234,
    comments: 67,
    shares: 89,
    tags: ['HomeOffice', 'Setup', 'Productivity'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    product: null,
  },
];

const mockChallenges = [
  {
    id: '1',
    title: 'Budget Gamer Challenge',
    description: 'Build the best gaming setup under $500',
    participants: 1240,
    prize: '$200 store credit',
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    emoji: '🎮',
    difficulty: 'Medium',
  },
  {
    id: '2',
    title: 'Eco-Friendly Shopping',
    description: 'Share your sustainable product finds',
    participants: 890,
    prize: '$100 store credit',
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    emoji: '🌱',
    difficulty: 'Easy',
  },
  {
    id: '3',
    title: 'Home Chef Challenge',
    description: 'Best kitchen gadget collection',
    participants: 567,
    prize: '$150 store credit',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    emoji: '👨‍🍳',
    difficulty: 'Hard',
  },
];

const mockLeaderboard = [
  { rank: 1, name: 'Alex Thompson', points: 15420, badge: '👑', reviews: 234, purchases: 89 },
  { rank: 2, name: 'Sarah Chen', points: 12890, badge: '🥈', reviews: 198, purchases: 76 },
  { rank: 3, name: 'Mike Johnson', points: 11340, badge: '🥉', reviews: 167, purchases: 65 },
  { rank: 4, name: 'Emma Wilson', points: 9870, badge: '⭐', reviews: 145, purchases: 54 },
  { rank: 5, name: 'David Lee', points: 8920, badge: '⭐', reviews: 132, purchases: 48 },
  { rank: 6, name: 'Lisa Park', points: 7650, badge: '⭐', reviews: 118, purchases: 42 },
  { rank: 7, name: 'James Brown', points: 6780, badge: '⭐', reviews: 98, purchases: 38 },
  { rank: 8, name: 'Anna White', points: 5920, badge: '⭐', reviews: 87, purchases: 31 },
];

const mockForumTopics = [
  {
    id: '1',
    title: 'Best budget laptops for students in 2024?',
    category: 'Electronics',
    replies: 45,
    views: 1240,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    author: 'TechStudent99',
    isPinned: true,
    isHot: true,
  },
  {
    id: '2',
    title: 'Tips for finding the best deals on IntelliCore',
    category: 'Shopping Tips',
    replies: 32,
    views: 890,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: 'DealMaster',
    isPinned: false,
    isHot: true,
  },
  {
    id: '3',
    title: 'Review: Standing desk comparison - 5 models tested',
    category: 'Home Office',
    replies: 28,
    views: 670,
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: 'OfficeGuru',
    isPinned: false,
    isHot: false,
  },
  {
    id: '4',
    title: 'Sustainable fashion brands worth supporting',
    category: 'Fashion',
    replies: 19,
    views: 450,
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    author: 'EcoShopper',
    isPinned: false,
    isHot: false,
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Check sessionStorage for initial tab (from community sub-routes)
  useEffect(() => {
    const savedTab = sessionStorage.getItem('community_active_tab');
    if (savedTab && ['feed', 'forum', 'challenges', 'leaderboard'].includes(savedTab)) {
      setActiveTab(savedTab);
      sessionStorage.removeItem('community_active_tab');
    }
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Community</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Connect, share, and discover with fellow shoppers</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline btn-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Find Friends
          </button>
          <button className="btn-primary btn-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Members', value: '2.4M+', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
          { icon: MessageSquare, label: 'Posts Today', value: '1,240', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { icon: Trophy, label: 'Active Challenges', value: '12', color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
          { icon: Star, label: 'Reviews This Week', value: '8,920', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-dark-800 rounded-xl mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === id
                ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <div className="card p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  U
                </div>
                <button className="flex-1 text-left px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-400 dark:text-gray-500 text-sm hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
                  Share your shopping experience...
                </button>
              </div>
            </div>

            {/* Posts */}
            {mockPosts.map((post) => (
              <div key={post.id} className="card p-5">
                {/* Author */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(post.author.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.author.name}</p>
                        {post.author.badge && (
                          <span className="badge-primary text-[10px]">{post.author.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeTime(post.createdAt)}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{post.content}</p>

                {/* Product Reference */}
                {post.product && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-dark-800 mb-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{post.product.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={cn('w-3 h-3', i < Math.floor(post.product!.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="badge-gray text-xs">#{tag}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-dark-700">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-sm transition-colors',
                      likedPosts.has(post.id)
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', likedPosts.has(post.id) && 'fill-current')} />
                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    <Share2 className="w-4 h-4" />
                    {post.shares}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {['#TechDeals', '#HomeOffice', '#SustainableShopping', '#BudgetFashion', '#GamingSetup'].map((tag, i) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">{tag}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{(5 - i) * 234} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenges Preview */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Active Challenges
                </h3>
                <button onClick={() => setActiveTab('challenges')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {mockChallenges.slice(0, 2).map(challenge => (
                  <div key={challenge.id} className="p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 border border-primary-100 dark:border-primary-900/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{challenge.emoji}</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{challenge.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{challenge.participants} participants</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{challenge.prize}</span>
                      <button className="text-xs btn-primary px-2 py-1 rounded-lg">Join</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Members */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  Top Members
                </h3>
                <button onClick={() => setActiveTab('leaderboard')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Full list
                </button>
              </div>
              <div className="space-y-3">
                {mockLeaderboard.slice(0, 5).map(member => (
                  <div key={member.rank} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-5">{member.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatNumber(member.points)} pts</p>
                    </div>
                    <span className="text-lg">{member.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search forum topics..." className="input pl-9" />
            </div>
            <button className="btn-outline btn-md flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="btn-primary btn-md flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Topic
            </button>
          </div>

          {/* Topics */}
          <div className="card overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-dark-700">
              {mockForumTopics.map(topic => (
                <div key={topic.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.isPinned && <span className="badge-primary text-[10px]">📌 Pinned</span>}
                        {topic.isHot && <span className="badge-danger text-[10px]">🔥 Hot</span>}
                        <span className="badge-gray text-[10px]">{topic.category}</span>
                      </div>
                      <Link href={`/community/forum/${topic.id}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {topic.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <span>by {topic.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(topic.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {topic.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {topic.views}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChallenges.map(challenge => (
            <div key={challenge.id} className="card p-6 card-hover">
              <div className="text-4xl mb-4">{challenge.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{challenge.title}</h3>
                <span className={cn(
                  'badge text-xs',
                  challenge.difficulty === 'Easy' ? 'badge-success' :
                  challenge.difficulty === 'Medium' ? 'badge-warning' :
                  'badge-danger'
                )}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{challenge.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Participants</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatNumber(challenge.participants)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Prize</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{challenge.prize}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Ends</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatRelativeTime(challenge.endsAt)}</span>
                </div>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: `${Math.min((challenge.participants / 2000) * 100, 100)}%` }} />
              </div>
              <button className="btn-primary btn-md w-full">Join Challenge</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-dark-700">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Top Community Members</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Rankings based on reviews, purchases, and community engagement</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-dark-700">
            {mockLeaderboard.map(member => (
              <div key={member.rank} className={cn(
                'flex items-center gap-4 p-4 transition-colors',
                member.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/5' : 'hover:bg-gray-50 dark:hover:bg-dark-800'
              )}>
                <div className="w-8 text-center">
                  {member.rank <= 3 ? (
                    <span className="text-xl">{member.badge}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">#{member.rank}</span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(member.name)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{member.reviews} reviews · {member.purchases} purchases</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600 dark:text-primary-400">{formatNumber(member.points)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">points</p>
                </div>
                <button className="btn-outline btn-sm">Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
