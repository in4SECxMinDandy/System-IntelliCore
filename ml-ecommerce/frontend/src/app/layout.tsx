import type { Metadata, Viewport } from 'next';
import { Spline_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ChatbotWidget from '@/components/ChatbotWidget';

// Stitch design system font: Spline Sans
const splineSans = Spline_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spline-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IntelliCore Shop — AI-Powered Smart Shopping',
    template: '%s | IntelliCore Shop',
  },
  description: 'Experience the future of shopping with AI-powered personalized recommendations, community features, and seamless checkout.',
  keywords: ['ecommerce', 'AI shopping', 'personalized recommendations', 'online store'],
  authors: [{ name: 'IntelliCore Team' }],
  creator: 'IntelliCore',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://intellicore.shop',
    title: 'IntelliCore Shop — AI-Powered Smart Shopping',
    description: 'Experience the future of shopping with AI-powered personalized recommendations.',
    siteName: 'IntelliCore Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IntelliCore Shop',
    description: 'AI-Powered Smart Shopping Experience',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ea2a33' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0505' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={splineSans.variable}>
      <body className="font-sans bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 antialiased">
        <Providers>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn-primary btn-md"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          <Footer />

          {/* Chatbot Widget */}
          <ChatbotWidget />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #1f2937)',
                border: '1px solid var(--toast-border, #e5e7eb)',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
