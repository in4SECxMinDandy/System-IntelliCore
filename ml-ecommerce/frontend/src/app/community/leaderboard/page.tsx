'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Award, Star, ShoppingCart } from 'lucide-react';
import { communityApi } from '@/lib/api';
import { getInitials } from '@/lib/utils';

// Simple number formatter to avoid hydration mismatch
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  reviews: number;
  purchases: number;
  badge: string;
}

export default function CommunityLeaderboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    sessionStorage.setItem('community_active_tab', 'leaderboard');
  }, []);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['community-leaderboard'],
    queryFn: async () => {
      const res = await communityApi.getLeaderboard({ limit: 20 });
      return res.data.data || [];
    },
  });

  if (!mounted) return null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Leaderboard</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading leaderboard...</div>
      ) : leaderboard && leaderboard.length > 0 ? (
        <div className="bg-white dark:bg-dark-900 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700">
          {/* Top 3 */}
          {leaderboard.slice(0, 3).length > 0 && (
            <div className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                {leaderboard[1] && (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-3xl mb-2 ring-4 ring-gray-300 dark:ring-dark-600">
                      {leaderboard[1].avatar ? (
                        <img src={leaderboard[1].avatar} alt={leaderboard[1].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(leaderboard[1].name)
                      )}
                    </div>
                    <span className="text-2xl">🥈</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-2">{leaderboard[1].name}</p>
                    <p className="text-sm text-gray-500">{formatNumber(leaderboard[1].points)} pts</p>
                  </div>
                )}
                {/* 1st place */}
                {leaderboard[0] && (
                  <div className="text-center -mt-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-4xl mb-2 ring-4 ring-yellow-400">
                      {leaderboard[0].avatar ? (
                        <img src={leaderboard[0].avatar} alt={leaderboard[0].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(leaderboard[0].name)
                      )}
                    </div>
                    <span className="text-3xl">👑</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-2">{leaderboard[0].name}</p>
                    <p className="text-sm text-gray-500">{formatNumber(leaderboard[0].points)} pts</p>
                  </div>
                )}
                {/* 3rd place */}
                {leaderboard[2] && (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-3xl mb-2 ring-4 ring-amber-600">
                      {leaderboard[2].avatar ? (
                        <img src={leaderboard[2].avatar} alt={leaderboard[2].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(leaderboard[2].name)
                      )}
                    </div>
                    <span className="text-2xl">🥉</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-2">{leaderboard[2].name}</p>
                    <p className="text-sm text-gray-500">{formatNumber(leaderboard[2].points)} pts</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Full Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Award className="w-4 h-4" /> Points</span>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Reviews</span>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4" /> Purchases</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {leaderboard.map((user: LeaderboardUser) => (
                  <tr key={user.rank} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-2xl ${user.rank <= 3 ? '' : 'text-gray-500'}`}>
                        {getRankBadge(user.rank)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-primary-600 dark:text-primary-400 font-medium">
                              {getInitials(user.name)}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary-600">{formatNumber(user.points)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{user.reviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{user.purchases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No leaderboard data available yet.</p>
          <p className="text-sm mt-2">Be active in the community to climb the ranks!</p>
        </div>
      )}
    </div>
  );
}
