'use client';

/**
 * PageTransition — Wrapper tạo hiệu ứng fade + slide khi chuyển trang
 * Wrap nội dung bên trong layout để tạo animation mượt
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState<'enter' | 'entering' | 'visible'>('visible');
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (pathname !== prevPathname.current) {
            prevPathname.current = pathname;
            // Bắt đầu transition enter
            setTransitionStage('enter');
            const t1 = setTimeout(() => setTransitionStage('entering'), 10);
            const t2 = setTimeout(() => {
                setDisplayChildren(children);
                setTransitionStage('visible');
            }, 250);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            setDisplayChildren(children);
        }
    }, [pathname, children]);

    return (
        <div
            className="page-transition-wrapper"
            style={{
                opacity: transitionStage === 'enter' ? 0 : 1,
                transform:
                    transitionStage === 'enter'
                        ? 'translateY(8px)'
                        : 'translateY(0)',
                transition:
                    transitionStage === 'entering' || transitionStage === 'visible'
                        ? 'opacity 240ms ease-out, transform 240ms ease-out'
                        : 'none',
                willChange: 'opacity, transform',
            }}
        >
            {displayChildren}
        </div>
    );
}
