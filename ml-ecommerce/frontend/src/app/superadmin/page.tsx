'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, Users, Settings, Database, Activity, Bell,
  Search, ChevronRight, Server, Lock, Globe, Key
} from 'lucide-react';

const systemStats = [
  { label: 'Total Users', value: '45,234', change: '+12%', icon: Users },
  { label: 'Active Sessions', value: '1,234', change: '+5%', icon: Activity },
  { label: 'API Uptime', value: '99.99%', change: 'Stable', icon: Server },
  { label: 'Security Alerts', value: '3', change: 'Low', icon: Lock },
];

const adminUsers = [
  { id: 1, name: 'Admin User 1', email: 'admin1@mlmarket.com', role: 'Superadmin', lastActive: '2 min ago', status: 'active' },
  { id: 2, name: 'Admin User 2', email: 'admin2@mlmarket.com', role: 'Admin', lastActive: '1 hour ago', status: 'active' },
  { id: 3, name: 'Staff User 1', email: 'staff1@mlmarket.com', role: 'Staff', lastActive: '3 hours ago', status: 'active' },
  { id: 4, name: 'Staff User 2', email: 'staff2@mlmarket.com', role: 'Staff', lastActive: '1 day ago', status: 'inactive' },
];

const systemLogs = [
  { id: 1, action: 'User login', user: 'admin1@mlmarket.com', ip: '192.168.1.1', time: '2 min ago' },
  { id: 2, action: 'Permission changed', user: 'admin1@mlmarket.com', target: 'staff1@mlmarket.com', time: '1 hour ago' },
  { id: 3, action: 'Database backup', system: 'Auto', time: '3 hours ago' },
  { id: 4, action: 'Security scan completed', system: 'Auto', time: '6 hours ago' },
];

export default function SuperadminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f27f0d] to-[#d16b08] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Superadmin Panel</h1>
              <p className="text-xs text-[#baab9c]">System Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
              <Bell className="w-5 h-5 text-[#baab9c]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
                S
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">Super Admin</p>
                <p className="text-xs text-[#baab9c]">superadmin@ml.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, i) => (
            <div key={i} className="bg-[#221910] rounded-xl p-6 border border-[#393028]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#f27f0d]/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#f27f0d]" />
                </div>
                <span className="text-sm text-[#baab9c]">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.change === 'Stable' || stat.change === 'Low' ? 'text-green-400' : 'text-[#baab9c]'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[#221910] rounded-xl w-fit">
          {['overview', 'users', 'security', 'settings'].map((tab) => (
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028]">
                <h3 className="text-lg font-semibold text-white">System Health</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { name: 'API Server', status: 'online', uptime: '99.99%' },
                  { name: 'Database', status: 'online', uptime: '99.95%' },
                  { name: 'ML Models', status: 'online', uptime: '99.90%' },
                  { name: 'Cache Server', status: 'online', uptime: '99.99%' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#181411] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-white">{service.name}</span>
                    </div>
                    <span className="text-sm text-[#baab9c]">{service.uptime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#221910] rounded-xl border border-[#393028]">
              <div className="p-4 border-b border-[#393028]">
                <h3 className="text-lg font-semibold text-white">System Logs</h3>
              </div>
              <div className="divide-y divide-[#393028]">
                {systemLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{log.action}</p>
                      <p className="text-xs text-[#baab9c] mt-1">
                        {log.user || log.system} {log.ip && `• ${log.ip}`} {log.target && `• ${log.target}`}
                      </p>
                    </div>
                    <span className="text-xs text-[#baab9c]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#221910] rounded-xl border border-[#393028] overflow-hidden">
            <div className="p-4 border-b border-[#393028] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Admin Users</h3>
              <button className="px-4 py-2 bg-[#f27f0d] text-white rounded-lg text-sm font-medium hover:bg-[#d16b08] transition-colors">
                Add User
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-[#181411]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Last Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#baab9c] uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#393028]">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#2D241B]/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-[#baab9c]">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">{user.role}</td>
                    <td className="px-4 py-3 text-white">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
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

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-[#f27f0d]" />
                <h3 className="text-lg font-semibold text-white">API Keys</h3>
              </div>
              <div className="space-y-3">
                {['Production API Key', 'Development API Key', 'ML Service Key'].map((key, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#181411] rounded-lg">
                    <span className="text-white text-sm">{key}</span>
                    <button className="text-xs text-[#f27f0d] hover:text-white">Regenerate</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-[#f27f0d]" />
                <h3 className="text-lg font-semibold text-white">Access Control</h3>
              </div>
              <div className="space-y-3">
                {['IP Whitelist', 'Two-Factor Auth', 'Session Timeout'].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#181411] rounded-lg">
                    <span className="text-white text-sm">{setting}</span>
                    <button className="w-12 h-6 bg-green-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-[#221910] rounded-xl border border-[#393028] p-6">
            <h3 className="text-lg font-semibold text-white mb-6">System Settings</h3>
            <div className="space-y-6">
              {[
                { name: 'Maintenance Mode', description: 'Enable/disable maintenance mode' },
                { name: 'User Registration', description: 'Allow new user registrations' },
                { name: 'API Rate Limiting', description: 'Enable rate limiting for API' },
                { name: 'Email Notifications', description: 'Send email notifications for important events' },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#181411] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{setting.name}</p>
                    <p className="text-xs text-[#baab9c] mt-1">{setting.description}</p>
                  </div>
                  <button className="w-12 h-6 bg-green-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
