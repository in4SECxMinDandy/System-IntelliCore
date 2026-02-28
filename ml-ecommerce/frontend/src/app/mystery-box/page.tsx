'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, Sparkles, Box, Star, ArrowRight, ChevronRight,
  Clock, Zap, Tag, ShoppingCart, Heart
} from 'lucide-react';

const mysteryBoxes = [
  { id: 1, name: 'Starter Box', price: 19.99, value: 50, items: '3-5', popularity: 85, image: null },
  { id: 2, name: 'Premium Box', price: 49.99, value: 150, items: '5-8', popularity: 92, image: null, featured: true },
  { id: 3, name: 'Elite Box', price: 99.99, value: 350, items: '8-12', popularity: 78, image: null },
  { id: 4, name: 'Legendary Box', price: 199.99, value: 800, items: '12-20', popularity: 65, image: null },
];

const recentWinners = [
  { name: 'John D.', box: 'Premium Box', prize: '$150 Gift Card', time: '2 hours ago' },
  { name: 'Sarah M.', box: 'Elite Box', prize: 'iPhone 15 Pro', time: '5 hours ago' },
  { name: 'Mike T.', box: 'Starter Box', prize: '$25 Voucher', time: '1 day ago' },
  { name: 'Emily R.', box: 'Legendary Box', prize: 'MacBook Air', time: '2 days ago' },
];

export default function MysteryBoxDiscoveryPage() {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

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
            <Link href="/cart" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-2xl p-8 mb-12 border border-[#393028] overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <Sparkles className="w-full h-full text-[#f27f0d]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Box className="w-8 h-8 text-[#f27f0d]" />
              <span className="text-[#f27f0d] font-medium">AI-POWERED</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Mystery Box Discovery</h1>
            <p className="text-[#baab9c] text-lg max-w-xl mb-6">
              Our AI analyzes your preferences to curate the perfect mystery box. 
              Unbox amazing products worth up to 10x the price!
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-[#f27f0d] text-white rounded-xl font-medium hover:bg-[#d16b08] transition-colors">
                Start Discovering
              </button>
              <Link href="/mystery-box/how-it-works" className="flex items-center gap-2 text-[#baab9c] hover:text-white">
                How it works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mystery Boxes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Your Box</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mysteryBoxes.map((box) => (
              <div 
                key={box.id}
                onClick={() => setSelectedBox(box.id)}
                className={`bg-[#221910] rounded-xl border transition-all cursor-pointer ${
                  selectedBox === box.id 
                    ? 'border-[#f27f0d] ring-2 ring-[#f27f0d]/30' 
                    : 'border-[#393028] hover:border-[#f27f0d]'
                } ${box.featured ? 'relative' : ''}`}
              >
                {box.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#f27f0d] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="aspect-square bg-gradient-to-br from-[#2D241B] to-[#181411] rounded-t-xl flex items-center justify-center">
                  <Box className={`w-24 h-24 ${box.featured ? 'text-[#f27f0d]' : 'text-[#baab9c]'}`} />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{box.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-[#f27f0d]">${box.price}</span>
                    <span className="text-sm text-[#baab9c] line-through">${box.value}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#baab9c]">
                    <div className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      <span>{box.items} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{box.popularity}% liked</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2.5 bg-[#f27f0d] text-white rounded-lg font-medium hover:bg-[#d16b08] transition-colors">
                    Open Box
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#f27f0d]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Curates</h3>
              <p className="text-[#baab9c] text-sm">Our AI analyzes your purchase history and preferences to select products you'll love.</p>
            </div>
            <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-[#f27f0d]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">You Unbox</h3>
              <p className="text-[#baab9c] text-sm">Receive a curated box of products worth significantly more than what you paid.</p>
            </div>
            <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-[#f27f0d]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">You Rate</h3>
              <p className="text-[#baab9c] text-sm">Rate your items to help our AI learn your preferences for better recommendations.</p>
            </div>
          </div>
        </div>

        {/* Recent Winners */}
        <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Winners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentWinners.map((winner, i) => (
              <div key={i} className="bg-[#181411] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f27f0d] to-[#d16b08] flex items-center justify-center">
                    <span className="text-white font-bold">{winner.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{winner.name}</p>
                    <p className="text-xs text-[#baab9c]">{winner.box}</p>
                  </div>
                </div>
                <p className="text-[#f27f0d] text-sm font-medium">{winner.prize}</p>
                <p className="text-xs text-[#baab9c] mt-1">{winner.time}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
