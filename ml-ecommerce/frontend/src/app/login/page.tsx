'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setIsRegister(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.email, form.password, form.fullName);
        toast.success('Account created! Welcome to IntelliCore.');
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please check your connection or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-dark-950 px-4 pt-16 pb-20">

      {/* Background decorations - Stitch style glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/10 dark:bg-primary-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 dark:bg-accent-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow-red mb-4">
            <Zap className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isRegister ? 'Join IntelliCore and start shopping smarter today.' : 'Sign in to access your AI-powered shopping features.'}
          </p>
        </div>

        {/* Card Form */}
        <div className="card p-6 sm:p-8 backdrop-blur-sm bg-white/90 dark:bg-dark-800/90 hover:shadow-panel transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="form-group animate-slide-up">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0" htmlFor="password">Password</label>
                {!isRegister && (
                  <Link href="/forgot-password" className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    Forgot details?
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary btn-lg mt-6 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  router.replace(isRegister ? '/login' : '/login?mode=register', { scroll: false });
                }}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {isRegister ? 'Sign in instead' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
