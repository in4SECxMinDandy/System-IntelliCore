'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Brain, TrendingUp, TrendingDown, Target, Zap,
  BarChart3, PieChart, Activity, Users, ShoppingBag,
  Search, Filter, ChevronRight
} from 'lucide-react';

const mlModels = [
  { id: 1, name: 'Product Recommendation Engine', status: 'active', accuracy: 94.5, requests: '2.3M/day', lastUpdated: '2 hours ago', type: 'recommendation' },
  { id: 2, name: 'Price Optimization Model', status: 'active', accuracy: 91.2, requests: '150K/day', lastUpdated: '1 day ago', type: 'pricing' },
  { id: 3, name: 'Demand Forecasting', status: 'active', accuracy: 89.8, requests: '50K/day', lastUpdated: '6 hours ago', type: 'forecasting' },
  { id: 4, name: 'Fraud Detection', status: 'active', accuracy: 98.7, requests: '500K/day', lastUpdated: '30 min ago', type: 'security' },
  { id: 5, name: 'Customer Churn Prediction', status: 'training', accuracy: 85.3, requests: '10K/day', lastUpdated: 'In Progress', type: 'analytics' },
  { id: 6, name: 'Visual Search', status: 'active', accuracy: 92.1, requests: '80K/day', lastUpdated: '4 hours ago', type: 'search' },
];

const insights = [
  { title: 'Recommendation CTR increased', metric: '+12.5%', description: 'Users are clicking more recommendations', trend: 'up' },
  { title: 'Price optimization savings', metric: '$45K', description: 'Revenue gained from dynamic pricing', trend: 'up' },
  { title: 'Fraud prevented', metric: '$12.3K', description: 'Blocked fraudulent transactions today', trend: 'up' },
  { title: 'Inventory alerts', metric: '23', description: 'Products predicted to go out of stock', trend: 'down' },
];

const performanceData = [
  { name: 'Mon', recommendations: 4500, searches: 2300, conversions: 120 },
  { name: 'Tue', recommendations: 4800, searches: 2100, conversions: 145 },
  { name: 'Wed', recommendations: 5100, searches: 2600, conversions: 168 },
  { name: 'Thu', recommendations: 4900, searches: 2400, conversions: 152 },
  { name: 'Fri', recommendations: 5300, searches: 2800, conversions: 180 },
  { name: 'Sat', recommendations: 5600, searches: 3100, conversions: 195 },
  { name: 'Sun', recommendations: 5200, searches: 2700, conversions: 178 },
];

export default function MLDashboardPage() {
  const [activeTab, setActiveTab] = useState('models');

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f27f0d] flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ML Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f27f0d] text-white rounded-lg text-sm font-medium hover:bg-[#d16b08] transition-colors">
              <Zap className="w-4 h-4" />
              Train Model
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Machine Learning Dashboard</h1>
          <p className="text-[#baab9c] mt-1">Monitor and manage ML models for your e-commerce platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-[#baab9c]">Active Models</span>
            </div>
            <p className="text-3xl font-bold text-white">6</p>
            <p className="text-xs text-green-400 mt-1">+2 this month</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-[#baab9c]">API Requests</span>
            </div>
            <p className="text-3xl font-bold text-white">3.1M</p>
            <p className="text-xs text-green-400 mt-1">+15% this week</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-[#baab9c]">Avg Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-white">92.6%</p>
            <p className="text-xs text-green-400 mt-1">+1.2% this month</p>
          </div>
          <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm text-[#baab9c]">Training Queue</span>
            </div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-xs text-[#baab9c] mt-1">Models in training</p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {insights.map((insight, i) => (
            <div key={i} className="bg-[#221910] rounded-xl p-4 border border-[#393028]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{insight.title}</p>
                  <p className="text-[#baab9c] text-xs mt-1">{insight.description}</p>
                </div>
                {insight.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <p className={`text-2xl font-bold mt-2 ${insight.trend === 'up' ? 'text-green-400' : 'text-yellow-400'}`}>
                {insight.metric}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl w-fit">
          {['models', 'performance', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-[#f27f0d] text-white' 
                  : 'text-[#baab9c] hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Models Table */}
        {activeTab === 'models' && (
          <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#181411]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Model Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Accuracy</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Requests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#393028]">
                {mlModels.map((model) => (
                  <tr key={model.id} className="hover:bg-[#2D241B]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f27f0d]/20 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-[#f27f0d]" />
                        </div>
                        <span className="text-white font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white capitalize">{model.type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        model.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {model.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{model.accuracy}%</td>
                    <td className="px-4 py-3 text-white">{model.requests}</td>
                    <td className="px-4 py-3 text-white">{model.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <button className="text-[#f27f0d] hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Performance Chart Placeholder */}
        {activeTab === 'performance' && (
          <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">ML Model Performance</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                  <span className="text-sm text-[#baab9c]">Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                  <span className="text-sm text-[#baab9c]">Searches</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="text-sm text-[#baab9c]">Conversions</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {performanceData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 h-40">
                    <div className="flex-1 bg-blue-400 rounded-t" style={{ height: `${(data.recommendations / 6000) * 100}%` }}></div>
                    <div className="flex-1 bg-purple-400 rounded-t" style={{ height: `${(data.searches / 3500) * 100}%` }}></div>
                    <div className="flex-1 bg-green-400 rounded-t" style={{ height: `${(data.conversions / 250) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-[#baab9c]">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <h3 className="text-lg font-semibold text-white mb-4">Top Performing Models</h3>
              <div className="space-y-4">
                {mlModels.slice(0, 4).map((model, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[#baab9c]">#{i + 1}</span>
                      <span className="text-white">{model.name}</span>
                    </div>
                    <span className="text-green-400">{model.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <h3 className="text-lg font-semibold text-white mb-4">Model Usage</h3>
              <div className="space-y-4">
                {mlModels.map((model, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">{model.name}</span>
                      <span className="text-[#baab9c] text-sm">{model.requests}</span>
                    </div>
                    <div className="h-2 bg-[#393028] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#f27f0d] rounded-full"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
