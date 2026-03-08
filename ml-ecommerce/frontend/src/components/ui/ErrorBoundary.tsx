// ==========================================
// Error Boundary Components (Phase 2.2)
// Graceful error handling for React component trees
// ==========================================

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetOnRouteChange?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    showDetails: boolean;
}

// ==========================================
// Full-Page Error Boundary (for root layout)
// ==========================================
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-destructive" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                            <p className="text-muted-foreground text-sm">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                                aria-label="Try again — reload this component"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try again
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                                aria-label="Go back to home page"
                            >
                                <Home className="w-4 h-4" />
                                Go home
                            </Link>
                        </div>

                        {/* Collapsible error details (dev only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="text-left">
                                <button
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                                    onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                                    aria-expanded={this.state.showDetails}
                                    aria-controls="error-details"
                                >
                                    <ChevronDown
                                        className={`w-3 h-3 transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                                    />
                                    {this.state.showDetails ? 'Hide' : 'Show'} error details
                                </button>

                                {this.state.showDetails && (
                                    <pre
                                        id="error-details"
                                        className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-48 text-left text-destructive"
                                    >
                                        {this.state.error.stack}
                                        {'\n\n'}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ==========================================
// Inline Error Boundary (for component sections)
// ==========================================
export class InlineErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center p-6 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="text-center space-y-3">
                        <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
                        <p className="text-sm text-muted-foreground">
                            Failed to load this section
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })}
                            className="text-xs text-primary hover:underline"
                            aria-label="Retry loading this section"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// ==========================================
// Empty State Component (for no-data cases)
// ==========================================
interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className || ''}`}>
            {icon && (
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            )}
            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}
