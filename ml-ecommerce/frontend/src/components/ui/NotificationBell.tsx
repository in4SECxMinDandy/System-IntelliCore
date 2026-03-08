// ==========================================
// Notification Bell — Real count from API (Phase 2.3)
// Replaces hardcoded notification count with live data
// ==========================================

'use client';

import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

interface NotificationCountResponse {
    count: number;
}

export default function NotificationBell() {
    const { user } = useAuthStore();

    const { data } = useQuery<NotificationCountResponse>({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            const res = await api.get('/api/notifications/unread-count');
            return res.data.data;
        },
        enabled: !!user,
        refetchInterval: 30_000,  // Refresh every 30 seconds
        staleTime: 15_000,        // Consider fresh for 15s
    });

    const count = data?.count ?? 0;

    return (
        <Link
            href="/notifications"
            aria-label={
                count > 0
                    ? `${count} unread notification${count > 1 ? 's' : ''}`
                    : 'Notifications — no unread'
            }
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        >
            <Bell className="w-5 h-5" />
            {count > 0 && (
                <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none animate-in fade-in zoom-in duration-200"
                >
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Link>
    );
}
