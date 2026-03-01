'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft,
  TrendingUp, Gift, History, Settings, Bell,
  DollarSign, Euro, Bitcoin, Shield, CircleDollarSign
} from 'lucide-react';

const currencies = [
  { symbol: '$', name: 'USD', balance: 1250.00, icon: DollarSign, color: 'text-green-400' },
  { symbol: '€', name: 'EUR', balance: 850.50, icon: Euro, color: 'text-blue-400' },
  { symbol: '£', name: 'GBP', balance: 420.00, icon: CircleDollarSign, color: 'text-purple-400' },
  { symbol: '₿', name: 'BTC', balance: 0.025, icon: Bitcoin, color: 'text-orange-400' },
];

const recentTransactions = [
  { id: 1, type: 'received', amount: 250.00, currency: '$', description: 'Order Refund #12345', date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'sent', amount: 89.99, currency: '$', description: 'Purchase - Wireless Headphones', date: '2024-01-14', status: 'completed' },
  { id: 3, type: 'received', amount: 50.00, currency: '$', description: 'Gift from John D.', date: '2024-01-13', status: 'completed' },
  { id: 4, type: 'sent', amount: 120.00, currency: '$', description: 'Transfer to Bank Account', date: '2024-01-12', status: 'pending' },
  { id: 5, type: 'bonus', amount: 25.00, currency: '$', description: 'Cashback Reward', date: '2024-01-11', status: 'completed' },
];

const paymentMethods = [
  { id: 1, type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 2, type: 'mastercard', last4: '8888', expiry: '09/24', isDefault: false },
  { id: 3, type: 'paypal', email: 'user@email.com', isDefault: false },
];

export default function DigitalWalletPage() {
  const [activeTab, setActiveTab] = useState('overview');

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
            <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
              <Bell className="w-5 h-5 text-[#baab9c]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#f27f0d] rounded-full"></span>
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Digital Wallet</h1>
          <p className="text-[#baab9c] mt-1">Manage your funds, payments, and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currencies.map((currency) => (
                <div key={currency.name} className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-xl p-4 border border-[#393028]">
                  <div className="flex items-center justify-between mb-3">
                    <currency.icon className={`w-6 h-6 ${currency.color}`} />
                    <span className="text-xs text-[#baab9c]">{currency.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {currency.symbol}{currency.balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              <button className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-[#f27f0d]" />
                </div>
                <span className="text-sm text-white">Send</span>
              </button>
              <button className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-6 h-6 text-[#f27f0d]" />
                </div>
                <span className="text-sm text-white">Receive</span>
              </button>
              <button className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#f27f0d]" />
                </div>
                <span className="text-sm text-white">Top Up</span>
              </button>
              <button className="bg-[#221910] rounded-xl p-4 border border-[#393028] hover:border-[#f27f0d] transition-colors flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f27f0d]/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#f27f0d]" />
                </div>
                <span className="text-sm text-white">Gift</span>
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                <button className="text-sm text-[#f27f0d] hover:text-white">View All</button>
              </div>
              <div className="divide-y divide-[#393028]">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-[#2D241B]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'received' || transaction.type === 'bonus' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {transaction.type === 'received' || transaction.type === 'bonus' ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white">{transaction.description}</p>
                        <p className="text-xs text-[#baab9c]">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'received' || transaction.type === 'bonus'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'received' || transaction.type === 'bonus' ? '+' : '-'}
                        {transaction.currency}{transaction.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Payment Methods</h2>
                <button className="flex items-center gap-1 text-sm text-[#f27f0d] hover:text-white">
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
              <div className="divide-y divide-[#393028]">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 flex items-center justify-between hover:bg-[#2D241B]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-[#2D241B] rounded flex items-center justify-center">
                        {method.type === 'visa' && <span className="text-blue-400 font-bold text-xs">VISA</span>}
                        {method.type === 'mastercard' && <span className="text-red-400 font-bold text-xs">MC</span>}
                        {method.type === 'paypal' && <span className="text-blue-300 font-bold text-xs">PayPal</span>}
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          {method.type === 'paypal' ? method.email : `•••• ${method.last4}`}
                        </p>
                        {method.expiry && (
                          <p className="text-xs text-[#baab9c]">Expires {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-[#f27f0d]/20 text-[#f27f0d] text-xs rounded-full">Default</span>
                      )}
                      <button className="p-2 rounded-lg hover:bg-[#393028] transition-colors">
                        <Settings className="w-4 h-4 text-[#baab9c]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Total Balance */}
            <div className="bg-gradient-to-br from-[#f27f0d] to-[#d16b08] rounded-xl p-6">
              <p className="text-white/80 text-sm">Total Balance</p>
              <p className="text-4xl font-bold text-white mt-2">$2,545.50</p>
              <div className="flex items-center gap-1 mt-2 text-white/80 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% this month</span>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Account Protected</p>
                  <p className="text-xs text-[#baab9c]">Your funds are secure</p>
                </div>
              </div>
              <button className="w-full py-2 bg-[#2D241B] text-white rounded-lg text-sm hover:bg-[#393028] transition-colors">
                View Security Settings
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <h3 className="text-sm font-medium text-white mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#baab9c] text-sm">Total Spent</span>
                  <span className="text-white font-medium">$489.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#baab9c] text-sm">Cashback Earned</span>
                  <span className="text-green-400 font-medium">$24.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#baab9c] text-sm">Points Earned</span>
                  <span className="text-[#f27f0d] font-medium">1,250 pts</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <Link href="/vouchers" className="flex items-center justify-between p-4 bg-[#221910] rounded-xl border border-[#393028] hover:border-[#f27f0d] transition-colors">
                <span className="text-white">Vouchers & Rewards</span>
                <ArrowUpRight className="w-4 h-4 text-[#baab9c]" />
              </Link>
              <Link href="/loyalty" className="flex items-center justify-between p-4 bg-[#221910] rounded-xl border border-[#393028] hover:border-[#f27f0d] transition-colors">
                <span className="text-white">Loyalty Program</span>
                <ArrowUpRight className="w-4 h-4 text-[#baab9c]" />
              </Link>
              <Link href="/transaction-history" className="flex items-center justify-between p-4 bg-[#221910] rounded-xl border border-[#393028] hover:border-[#f27f0d] transition-colors">
                <span className="text-white">Transaction History</span>
                <ArrowUpRight className="w-4 h-4 text-[#baab9c]" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
