'use client';

/**
 * NavigationProgress — Thanh loading mượt phía trên cùng khi chuyển trang
 * Sử dụng useEffect theo dõi pathname thay đổi để kích hoạt animation
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const prevPathRef = useRef(pathname + searchParams.toString());

    // Khi route thay đổi → bắt đầu animation
    useEffect(() => {
        const currentRoute = pathname + searchParams.toString();
        if (currentRoute === prevPathRef.current) return;
        prevPathRef.current = currentRoute;

        // Reset và start
        setProgress(0);
        setVisible(true);

        // Tăng dần tới 85% (mô phỏng loading)
        let current = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            current += Math.random() * 15 + 5;
            if (current >= 85) {
                current = 85;
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            setProgress(current);
        }, 120);

        // Hoàn tất sau 350ms
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setProgress(100);
            setTimeout(() => setVisible(false), 300);
        }, 600);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [pathname, searchParams]);

    if (!visible) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
            role="progressbar"
            aria-label="Page loading"
        >
            <div
                className="h-full rounded-r-full transition-all ease-out"
                style={{
                    width: `${progress}%`,
                    transitionDuration: progress === 100 ? '200ms' : '120ms',
                    background: 'linear-gradient(90deg, #ea2a33, #f97316, #ea2a33)',
                    backgroundSize: '200% 100%',
                    animation: progress < 100 ? 'shimmerProgress 1.5s linear infinite' : 'none',
                    boxShadow: '0 0 8px rgba(234, 42, 51, 0.6)',
                }}
            />
        </div>
    );
}
