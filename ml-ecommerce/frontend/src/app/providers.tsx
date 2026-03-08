'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AxiosError } from 'axios';

// Smart retry: không retry nếu là network error hoặc 4xx (trừ 408, 429)
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof AxiosError) {
    // Không retry khi server không phản hồi (ERR_EMPTY_RESPONSE, ECONNREFUSED)
    if (!error.response) return false;
    // Không retry client errors (4xx) trừ timeout và rate limit
    const status = error.response.status;
    if (status < 500 && status !== 408 && status !== 429) return false;
  }
  return failureCount < 1; // Tối đa 1 lần retry cho server errors
}

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút — giảm refetch không cần thiết
      gcTime: 10 * 60 * 1000,   // 10 phút cache
      retry: shouldRetry,
      retryDelay: 800,           // Cố định 800ms thay vì exponential
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient(queryClientOptions)
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
