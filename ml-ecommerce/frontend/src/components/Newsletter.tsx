// ==========================================
// Newsletter Subscription Component (Phase 2.1)
// Email newsletter signup with validation
// ==========================================

'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

type SubscriptionState = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterProps {
    variant?: 'banner' | 'minimal';
    title?: string;
    description?: string;
}

export default function Newsletter({
    variant = 'banner',
    title = 'Đăng ký nhận ưu đãi',
    description = 'Nhận thông báo về sản phẩm mới, khuyến mãi và flash sales mỗi tuần.',
}: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<SubscriptionState>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập email hợp lệ');
            return;
        }

        setState('loading');
        setError('');

        try {
            await api.post('/api/newsletter/subscribe', { email: email.trim().toLowerCase() });
            setState('success');
            setEmail('');
        } catch (err: any) {
            if (err.response?.status === 409) {
                setState('success'); // Already subscribed — treat as success
            } else {
                setState('error');
                setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại');
            }
        }
    };

    if (variant === 'minimal') {
        return (
            <div className="space-y-3">
                {state === 'success' ? (
                    <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle className="w-5 h-5" aria-hidden="true" />
                        <span className="text-sm font-medium">Đăng ký thành công! Cảm ơn bạn.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Đăng ký nhận bản tin">
                        <div className="flex-1 relative">
                            <label htmlFor="newsletter-email-minimal" className="sr-only">Địa chỉ email</label>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <input
                                id="newsletter-email-minimal"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                                disabled={state === 'loading'}
                                aria-describedby={error ? 'newsletter-error-minimal' : undefined}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={state === 'loading' || !email}
                            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            aria-label="Đăng ký nhận bản tin"
                        >
                            {state === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
                        </button>
                    </form>
                )}
                {error && <p id="newsletter-error-minimal" className="text-xs text-destructive" role="alert">{error}</p>}
            </div>
        );
    }

    // Banner variant
    return (
        <section
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 md:p-12"
            aria-label="Đăng ký nhận bản tin khuyến mãi"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" aria-hidden="true" />

            <div className="relative max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Newsletter</span>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                <p className="text-muted-foreground mb-6">{description}</p>

                {state === 'success' ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20" role="status">
                        <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                        <div>
                            <p className="font-medium text-emerald-600 dark:text-emerald-400">Đăng ký thành công!</p>
                            <p className="text-sm text-muted-foreground">Cảm ơn bạn đã đăng ký. Hãy kiểm tra email để xác nhận.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate aria-label={title}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <label htmlFor="newsletter-email-banner" className="sr-only">Địa chỉ email của bạn</label>
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                    aria-hidden="true"
                                />
                                <input
                                    id="newsletter-email-banner"
                                    type="email"
                                    placeholder="Nhập email của bạn..."
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    disabled={state === 'loading'}
                                    aria-describedby={error ? 'newsletter-error-banner' : undefined}
                                    aria-invalid={!!error}
                                    autoComplete="email"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={state === 'loading' || !email.trim()}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 active:scale-95"
                                aria-label="Đăng ký nhận bản tin"
                            >
                                {state === 'loading' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <>
                                        Đăng ký ngay
                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <p id="newsletter-error-banner" className="mt-2 text-sm text-destructive" role="alert">
                                {error}
                            </p>
                        )}

                        <p className="mt-3 text-xs text-muted-foreground">
                            Bạn có thể hủy đăng ký bất kỳ lúc nào. Chúng tôi không spam.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}
