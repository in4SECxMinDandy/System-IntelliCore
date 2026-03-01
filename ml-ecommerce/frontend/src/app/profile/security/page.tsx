'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Lock, Eye, Smartphone, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ProfileSecurityPage() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);

  // Fetch 2FA status
  const { data: twoFactorStatus } = useQuery({
    queryKey: ['two-factor-status'],
    queryFn: async () => {
      const res = await api.get('/twoFactor/status');
      return res.data.data || { enabled: false };
    },
  });

  const handleChangePassword = async () => {
    setChangingPassword(true);
    // TODO: Implement password change
    setTimeout(() => setChangingPassword(false), 2000);
  };

  const handleEnable2FA = async () => {
    setEnabling2FA(true);
    // TODO: Implement 2FA enable flow
    setTimeout(() => setEnabling2FA(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Security Settings</h1>

      <div className="space-y-6">
        {/* Password Section */}
        <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Password</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last changed 30 days ago
          </p>
          <button 
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </section>

        {/* 2FA Section */}
        <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${twoFactorStatus?.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-600 dark:bg-dark-700 dark:text-gray-400'}`}>
              {twoFactorStatus?.enabled ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Enabled</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Disabled</span>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={handleEnable2FA}
            disabled={enabling2FA || twoFactorStatus?.enabled}
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 flex items-center gap-2"
          >
            {enabling2FA && <Loader2 className="w-4 h-4 animate-spin" />}
            {twoFactorStatus?.enabled ? 'Manage 2FA' : 'Enable 2FA'}
          </button>
        </section>

        {/* Login Sessions */}
        <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Login Sessions</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                <p className="text-sm text-gray-500">Current session • Last active now</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </section>

        {/* Account Recovery */}
        <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Recovery</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add a recovery email and phone number
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Recovery email: *****@email.com</p>
            <p className="text-sm text-gray-500">Recovery phone: +1 **** *567</p>
          </div>
          <button className="mt-4 px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800">
            Update Recovery Info
          </button>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Permanently delete your account and all associated data
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Account
          </button>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/profile" className="text-primary-600 hover:underline">← Back to Profile</Link>
      </div>
    </div>
  );
}
