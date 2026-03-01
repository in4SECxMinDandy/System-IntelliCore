'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

// Custom error handling for React Query
const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      // Error handling callback
      onError: (error: unknown) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        console.error('Mutation error:', error);
      },
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
