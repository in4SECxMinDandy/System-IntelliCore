'use client';

import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Material Symbols icon component
const MaterialIcon = ({ icon, className = '', children }: { icon?: string; className?: string; children?: React.ReactNode }) => (
  <span className={`material-symbols-outlined ${className}`}>{children || icon}</span>
);

interface Review {
    id: string;
    product: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl: string | null;
    };
    rating: number;
    content: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    fakeProb: number;
    createdAt: string;
}



function SentimentBadge({ sentiment }: { sentiment: string }) {
    const colors: Record<string, string> = {
        Positive:
            'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 border-green-200 dark:border-green-500/20',
        Negative:
            'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20',
        Neutral:
            'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20',
    };

    return (
        <span
            className={`px-2 py-1 rounded-md text-xs font-bold border ${colors[sentiment]}`}
        >
            {sentiment}
        </span>
    );
}

function FakeProbBadge({ prob }: { prob: number }) {
    const isHigh = prob > 50;
    return (
        <span
            className={`px-2 py-1 rounded-md text-xs font-bold border ${isHigh
                ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20'
                : 'bg-gray-50 dark:bg-[#2d231a] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#393028]'
                }`}
        >
            Fake Prob: {prob}%
        </span>
    );
}

const sidebarItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false },
    { icon: 'rate_review', label: 'Reviews', active: true },
    { icon: 'inventory_2', label: 'Products', active: false },
    { icon: 'group', label: 'Users', active: false },
    { icon: 'settings', label: 'Settings', active: false },
];

export default function StaffModerationDashboard() {
    const queryClient = useQueryClient();

    // Fetch Queue
    const { data, isLoading } = useQuery({
        queryKey: ['admin-reviews-queue'],
        queryFn: async () => {
            const res = await api.get('/admin/reviews/queue');
            return res.data.data;
        },
    });

    const reviews: Review[] = data?.items || [];
    const stats = data?.stats || { pendingCount: 0, avgScore: 0, flaggedFake: 0, autoApproved: 0 };

    // Approve Mutation
    const moderateMutation = useMutation({
        mutationFn: async ({ id, approved, rejected }: { id: string, approved?: boolean, rejected?: boolean }) => {
            const res = await api.patch(`/admin/reviews/${id}/moderate`, { approved, rejected });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reviews-queue'] });
            toast.success('Review moderated successfully!');
        },
        onError: () => toast.error('Failed to moderate review'),
    });

    const handleApprove = (id: string) => moderateMutation.mutate({ id, approved: true });
    const handleReject = (id: string) => moderateMutation.mutate({ id, rejected: true });

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#221910]">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col justify-between border-r border-gray-200 dark:border-dark-700 bg-white dark:bg-[#181411] p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-center mb-6">
                        <div
                            className="rounded-full h-10 w-10 bg-primary-100 dark:bg-primary-900/20 bg-cover bg-center"
                            style={{
                                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyFj55glMZVYeWNHVO3cqlAXZWNqG3kAZeOUZlvYJslXvu4o-LlJRUuDI3__WNpXDPnnBvMqHkAM6LedB-Mojx0jTl8VrMduNtWoYLrWu_IgQrgRCDo0QcG0SB7m78EP94vjHmAdiHYckWSxuqMbCGsMw4LQji10Am4Mjx3zhTBf56jzXu82-eiCnLhX3iuRxSyASZAmFJ0wLW7In5vhcbdOSD3Y4q0sHr_Z-0kSDS2CdA4nZH9EXMFlotpnsz_yJ2dIvCq3ioR80")`,
                            }}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-gray-900 dark:text-white text-base font-bold leading-normal">
                                Mod Panel
                            </h1>
                            <p className="text-gray-500 dark:text-[#baab9c] text-xs font-normal leading-normal">
                                Staff Access
                            </p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {sidebarItems.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${item.active
                                    ? 'bg-primary/10 dark:bg-[#393028] text-primary'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#393028]'
                                    }`}
                            >
                                <MaterialIcon className="text-xl">{item.icon}</MaterialIcon>
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* System Status */}
                <div className="mt-auto">
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-50 dark:bg-[#251e17] border border-gray-200 dark:border-[#393028]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 dark:text-[#baab9c]">
                                System Status
                            </span>
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                            AI Analysis Active
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-[#393028] rounded-full h-1 mt-1">
                            <div
                                className="bg-primary-600 h-1 rounded-full transition-all"
                                style={{ width: '92%' }}
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-[#221910]">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#393028] px-8 py-4 bg-white dark:bg-[#181411]">
                    <div className="flex items-center gap-4">
                        <MaterialIcon className="text-primary text-3xl">verified_user</MaterialIcon>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Review Moderation
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative w-64 hidden lg:block">
                            <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</MaterialIcon>
                            <input
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-[#2d231a] border-none text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary placeholder-slate-400"
                                placeholder="Search reviews..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-[#393028] pl-6">
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#393028] text-slate-600 dark:text-slate-300 relative transition-colors">
                                <MaterialIcon>notifications</MaterialIcon>
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-white dark:border-[#181411]" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#393028] text-slate-600 dark:text-slate-300 transition-colors">
                                <MaterialIcon>chat_bubble</MaterialIcon>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Stat Cards */}
                        {[
                            {
                                label: 'Pending Reviews',
                                value: stats.pendingCount.toString(),
                                change: 'Awaiting moderation',
                                icon: (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                iconBg: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
                                changeColor: 'text-gray-500',
                            },
                            {
                                label: 'Avg Fake Score',
                                value: typeof stats.avgScore === 'number' ? stats.avgScore.toFixed(0) : '0',
                                change: 'Across recent reviews',
                                icon: (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                iconBg: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
                                changeColor: 'text-gray-500',
                            },
                            {
                                label: 'Flagged Fake',
                                value: stats.flaggedFake.toString(),
                                change: 'Detected recently',
                                icon: (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                ),
                                iconBg: 'bg-red-50 dark:bg-red-500/10 text-red-500',
                                changeColor: 'text-gray-500',
                            },
                            {
                                label: 'Auto-Approved',
                                value: stats.autoApproved.toString(),
                                change: 'Safe reviews',
                                icon: (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ),
                                iconBg: 'bg-green-50 dark:bg-green-500/10 text-green-500',
                                changeColor: 'text-gray-500',
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-5 rounded-xl bg-white dark:bg-[#1e1914] border border-gray-200 dark:border-[#393028] shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-medium text-gray-500 dark:text-[#baab9c]">
                                        {stat.label}
                                    </p>
                                    <span className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                                        {stat.icon}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p
                                    className={`text-xs font-medium ${stat.changeColor} mt-1 flex items-center gap-1`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {stat.change}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main List Area */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Pending Approval Queue
                                </h3>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 text-sm font-bold transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reject All
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-bold shadow-lg shadow-primary-600/20 transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Approve All
                                    </button>
                                </div>
                            </div>

                            {/* Review Items */}
                            {isLoading && (
                                <div className="flex justify-center p-8">
                                    <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}

                            {!isLoading && reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="group flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-white dark:bg-[#1e1914] border border-gray-200 dark:border-[#393028] shadow-sm hover:border-primary-400 dark:hover:border-primary-600/50 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-600 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url('${review.user?.avatarUrl || 'https://via.placeholder.com/150'}')`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                                    {review.user?.fullName || 'Anonymous User'}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#baab9c]">
                                                    <span>{review.product?.name || 'Unknown Product'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <SentimentBadge sentiment={review.sentiment} />
                                                <FakeProbBadge prob={review.fakeProb} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                            {review.content}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(review.id)}
                                                className="flex-1 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2d231a] text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-xs font-bold transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleApprove(review.id)}
                                                className="flex-1 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-600 hover:text-white text-xs font-bold transition-colors"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {reviews.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-16 h-16 text-gray-300 dark:text-dark-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">All reviews have been moderated!</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No pending reviews at this time.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar / Charts */}
                        <div className="w-full lg:w-96 flex flex-col gap-6">
                            {/* Sentiment Trend Chart */}
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1e1914] border border-gray-200 dark:border-[#393028] shadow-sm flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Sentiment Trend
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-[#baab9c]">
                                        Last 7 Days • All Products
                                    </p>
                                </div>
                                <div className="relative h-48 w-full mb-4">
                                    <svg
                                        className="w-full h-full overflow-visible"
                                        viewBox="0 0 300 150"
                                    >
                                        <line stroke="#334155" strokeOpacity="0.2" strokeWidth="1" x1="0" x2="300" y1="150" y2="150" />
                                        <line stroke="#334155" strokeDasharray="4" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="300" y1="100" y2="100" />
                                        <line stroke="#334155" strokeDasharray="4" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="300" y1="50" y2="50" />
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#ea2a33" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#ea2a33" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,120 C30,110 50,80 80,90 C110,100 130,60 160,50 C190,40 210,70 240,60 C270,50 300,20 300,20"
                                            fill="none"
                                            stroke="#ea2a33"
                                            strokeLinecap="round"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M0,120 C30,110 50,80 80,90 C110,100 130,60 160,50 C190,40 210,70 240,60 C270,50 300,20 300,20 V150 H0 Z"
                                            fill="url(#chartGradient)"
                                            stroke="none"
                                        />
                                        <circle cx="80" cy="90" fill="#1e1914" r="4" stroke="#ea2a33" strokeWidth="2" />
                                        <circle cx="160" cy="50" fill="#1e1914" r="4" stroke="#ea2a33" strokeWidth="2" />
                                        <circle cx="240" cy="60" fill="#1e1914" r="4" stroke="#ea2a33" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-[#baab9c] px-1">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                                        <span key={d}>{d}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Product Alert */}
                            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            Quality Alert
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-[#baab9c] mt-1 mb-3">
                                            &quot;Hiking Backpack Pro&quot; has received 15% more negative
                                            reviews in the last 24h.
                                        </p>
                                        <button className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                                            View Report
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Top Flag Reasons */}
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1e1914] border border-gray-200 dark:border-[#393028] shadow-sm flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Top Flag Reasons
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: '🤖', label: 'AI Generated', pct: 45 },
                                        { icon: '🚫', label: 'Profanity', pct: 32 },
                                        { icon: '🔗', label: 'Spam Links', pct: 18 },
                                    ].map((flag) => (
                                        <div key={flag.label}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{flag.icon}</span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {flag.label}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {flag.pct}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-[#2d231a] rounded-full h-1.5">
                                                <div
                                                    className="bg-primary-600 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${flag.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
