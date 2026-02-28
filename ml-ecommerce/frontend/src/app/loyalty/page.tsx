'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, Star, Gift, Clock, CheckCircle, ArrowRight,
  Zap, Target, Award, Crown, Users, Calendar
} from 'lucide-react';

const quests = [
  { id: 1, title: 'Complete 3 Orders', progress: 2, target: 3, points: 150, category: 'shopping' },
  { id: 2, title: 'Spend $100 This Month', progress: 75, target: 100, points: 300, category: 'spending' },
  { id: 3, title: 'Write 5 Reviews', progress: 3, target: 5, points: 200, category: 'reviews' },
  { id: 4, title: 'Refer 2 Friends', progress: 1, target: 2, points: 500, category: 'referral' },
  { id: 5, title: 'Daily Login', progress: 1, target: 1, points: 10, category: 'daily' },
];

const rewards = [
  { id: 1, title: '$5 Off Voucher', points: 500, image: null },
  { id: 2, title: 'Free Shipping', points: 300, image: null },
  { id: 3, title: '$10 Off Voucher', points: 1000, image: null },
  { id: 4, title: 'Exclusive T-Shirt', points: 2500, image: null },
  { id: 5, title: '$25 Off Voucher', points: 5000, image: null },
  { id: 6, title: 'Premium Membership', points: 10000, image: null },
];

const tiers = [
  { name: 'Bronze', minPoints: 0, color: 'from-amber-700 to-amber-900', icon: Star },
  { name: 'Silver', minPoints: 1000, color: 'from-gray-400 to-gray-600', icon: Award },
  { name: 'Gold', minPoints: 5000, color: 'from-yellow-400 to-yellow-600', icon: Crown },
  { name: 'Platinum', minPoints: 15000, color: 'from-purple-400 to-purple-600', icon: Trophy },
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState('quests');
  const currentPoints = 2450;
  const currentTier = tiers[2]; // Gold

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f27f0d] flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-lg font-bold text-white">ML Market</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/vouchers" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <Gift className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Banner */}
        <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <currentTier.icon className="w-6 h-6 text-white" />
                <span className="text-white/80 text-sm font-medium">{currentTier.name} Member</span>
              </div>
              <p className="text-white/60 text-sm">Your Points Balance</p>
              <p className="text-5xl font-bold text-white mt-1">{currentPoints.toLocaleString()}</p>
              <p className="text-white/60 text-sm mt-2">{tiers[tiers.indexOf(currentTier) + 1]?.minPoints - currentPoints || 0} points to next tier</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Member since</p>
              <p className="text-white font-medium">Jan 2024</p>
            </div>
          </div>
          
          {/* Progress to next tier */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>{currentTier.name}</span>
              <span>{tiers[tiers.indexOf(currentTier) + 1]?.name || 'Max'}</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${(currentPoints / (tiers[tiers.indexOf(currentTier) + 1]?.minPoints || currentPoints)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#221910] rounded-xl p-4 border border-[#393028] text-center">
            <Zap className="w-6 h-6 text-[#f27f0d] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{currentPoints}</p>
            <p className="text-xs text-[#baab9c]">Points</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-4 border border-[#393028] text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-[#baab9c]">Completed</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-4 border border-[#393028] text-center">
            <Gift className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-xs text-[#baab9c]">Rewards</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-4 border border-[#393028] text-center">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-[#baab9c]">Referrals</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl">
          {['quests', 'rewards', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-[#f27f0d] text-white' 
                  : 'text-[#baab9c] hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Quests Tab */}
        {activeTab === 'quests' && (
          <div className="space-y-4">
            {quests.map((quest) => (
              <div key={quest.id} className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{quest.title}</h3>
                    <p className="text-xs text-[#baab9c] mt-1">+{quest.points} points</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quest.category === 'daily' ? 'bg-yellow-500/20 text-yellow-400' :
                    quest.category === 'shopping' ? 'bg-blue-500/20 text-blue-400' :
                    quest.category === 'spending' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {quest.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#393028] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#f27f0d] rounded-full transition-all"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-[#baab9c] whitespace-nowrap">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
                {quest.progress >= quest.target && (
                  <button className="mt-3 w-full py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Claim Rewards
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors">
                <div className="aspect-square bg-[#2D241B] rounded-lg mb-3 flex items-center justify-center">
                  <Gift className="w-12 h-12 text-[#f27f0d]" />
                </div>
                <h3 className="text-white font-medium text-center">{reward.title}</h3>
                <p className="text-[#f27f0d] text-sm text-center mt-1">{reward.points} points</p>
                <button 
                  disabled={currentPoints < reward.points}
                  className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPoints >= reward.points
                      ? 'bg-[#f27f0d] text-white hover:bg-[#d16b08]'
                      : 'bg-[#393028] text-[#baab9c] cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-[#221910] rounded-xl border border-[#393028]">
            <div className="divide-y divide-[#393028]">
              {[
                { type: 'earned', points: 150, description: 'Completed "Complete 3 Orders" quest', date: '2024-01-15' },
                { type: 'earned', points: 10, description: 'Daily login bonus', date: '2024-01-15' },
                { type: 'redeemed', points: 500, description: 'Redeemed "$5 Off Voucher"', date: '2024-01-14' },
                { type: 'earned', points: 300, description: 'Completed "Spend $100" quest', date: '2024-01-13' },
                { type: 'earned', points: 200, description: 'Completed "Write 5 Reviews" quest', date: '2024-01-12' },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{item.description}</p>
                    <p className="text-xs text-[#baab9c] mt-1">{item.date}</p>
                  </div>
                  <span className={`font-semibold ${
                    item.type === 'earned' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.type === 'earned' ? '+' : '-'}{item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
