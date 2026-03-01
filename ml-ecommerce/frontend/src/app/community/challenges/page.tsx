'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Users, Clock, ArrowRight } from 'lucide-react';
import { communityApi } from '@/lib/api';

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

export default function CommunityChallengesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    sessionStorage.setItem('community_active_tab', 'challenges');
  }, []);

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['community-challenges'],
    queryFn: async () => {
      const res = await communityApi.getChallenges();
      return res.data.data || [];
    },
  });

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Challenges</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading challenges...</div>
      ) : challenges && challenges.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge: Challenge) => (
            <div key={challenge.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{challenge.emoji}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  challenge.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : challenge.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{challenge.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{challenge.description}</p>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="flex items-center gap-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  {challenge.participants} participants
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  {new Date(challenge.endsAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                <span className="font-bold text-primary-600">{challenge.prize}</span>
                <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                  {challenge.isJoined ? 'Joined' : 'Join'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active challenges at the moment.</p>
          <p className="text-sm mt-2">Check back soon for new challenges!</p>
        </div>
      )}
    </div>
  );
}
