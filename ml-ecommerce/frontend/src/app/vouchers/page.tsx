'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, Tag, Clock, CheckCircle, XCircle, Plus,
  Search, Filter, Star, ArrowRight, Wallet, Percent
} from 'lucide-react';

const vouchers = [
  { id: 1, code: 'WELCOME20', discount: '20%', type: 'percent', minSpend: 50, validUntil: '2024-02-28', status: 'active', description: 'Welcome discount for new users' },
  { id: 2, code: 'SAVE10', discount: '$10', type: 'fixed', minSpend: 30, validUntil: '2024-03-15', status: 'active', description: 'Flat $10 off on orders above $30' },
  { id: 3, code: 'FREESHIP', discount: 'Free', type: 'shipping', minSpend: 0, validUntil: '2024-02-14', status: 'active', description: 'Free shipping on any order' },
  { id: 4, code: 'TECH50', discount: '50%', type: 'percent', minSpend: 200, validUntil: '2024-01-30', status: 'expired', description: '50% off electronics' },
  { id: 5, code: 'SUMMER25', discount: '25%', type: 'percent', minSpend: 75, validUntil: '2024-04-01', status: 'active', description: 'Summer sale special' },
];

const categories = ['All', 'Percent Off', 'Fixed Discount', 'Free Shipping', 'Buy X Get Y'];

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const availableVouchers = vouchers.filter(v => v.status === 'active');
  const usedVouchers = vouchers.filter(v => v.status === 'used');
  const expiredVouchers = vouchers.filter(v => v.status === 'expired');

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
            <Link href="/wallet" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <Wallet className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Vouchers & Rewards</h1>
          <p className="text-[#baab9c] mt-1">Save more with exclusive vouchers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-xl p-4 border border-[#393028]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f27f0d]/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#f27f0d]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{availableVouchers.length}</p>
                <p className="text-xs text-[#baab9c]">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-xl p-4 border border-[#393028]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{usedVouchers.length}</p>
                <p className="text-xs text-[#baab9c]">Used</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-xl p-4 border border-[#393028]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{expiredVouchers.length}</p>
                <p className="text-xs text-[#baab9c]">Expired</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl">
          {['available', 'used', 'expired'].map((tab) => (
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

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#baab9c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vouchers..."
              className="w-full bg-[#221910] border border-[#393028] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#221910] border border-[#393028] rounded-xl text-[#baab9c] hover:text-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-[#f27f0d] text-white'
                  : 'bg-[#221910] text-[#baab9c] hover:text-white border border-[#393028]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Voucher List */}
        <div className="space-y-4">
          {(activeTab === 'available' ? availableVouchers : activeTab === 'used' ? usedVouchers : expiredVouchers).map((voucher) => (
            <div 
              key={voucher.id} 
              className={`bg-[#221910] rounded-xl border border-[#393028] overflow-hidden ${
                voucher.status === 'active' ? 'hover:border-[#f27f0d]' : ''
              } transition-colors`}
            >
              <div className="flex">
                {/* Discount Badge */}
                <div className="w-32 bg-[#f27f0d] flex flex-col items-center justify-center p-4">
                  <Percent className="w-8 h-8 text-white mb-1" />
                  <span className="text-2xl font-bold text-white">{voucher.discount}</span>
                  <span className="text-xs text-white/80">OFF</span>
                </div>
                
                {/* Voucher Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{voucher.code}</h3>
                      <p className="text-sm text-[#baab9c] mt-1">{voucher.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      voucher.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : voucher.status === 'used'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {voucher.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 text-xs text-[#baab9c]">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Min spend: ${voucher.minSpend}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Valid until {voucher.validUntil}</span>
                    </div>
                  </div>
                  
                  {voucher.status === 'active' && (
                    <button className="mt-4 px-4 py-2 bg-[#f27f0d] text-white rounded-lg text-sm font-medium hover:bg-[#d16b08] transition-colors">
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Get More Vouchers */}
        <div className="mt-8 bg-gradient-to-r from-[#221910] to-[#2D241B] rounded-xl p-6 border border-[#393028]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Get More Vouchers!</h3>
              <p className="text-sm text-[#baab9c] mt-1">Earn points and unlock exclusive vouchers</p>
            </div>
            <Link href="/loyalty" className="flex items-center gap-2 px-4 py-2 bg-[#f27f0d] text-white rounded-lg font-medium hover:bg-[#d16b08] transition-colors">
              View Rewards
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
