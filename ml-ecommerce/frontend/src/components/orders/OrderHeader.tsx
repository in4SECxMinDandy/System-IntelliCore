'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Bell, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

// Header for Orders pages - Google Stitch Design
interface OrderHeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
}

export function OrderHeader({ showBack, backHref = '/orders', title }: OrderHeaderProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { totalItems } = useCartStore();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-background-dark dark:bg-card-dark px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* Back Button */}
        {showBack && (
          <Link 
            href={backHref} 
            className="flex items-center gap-2 text-text-light hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-sm font-medium uppercase tracking-wider">Back to Orders</span>
          </Link>
        )}
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <div className="w-8 h-8 text-primary">
            <span className="material-symbols-outlined text-4xl">view_in_ar</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">ML Market</h2>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-9">
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products">
            Shop
          </Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/deals">
            Deals
          </Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/support">
            Support
          </Link>
        </nav>
      </div>

      <div className="flex flex-1 justify-end gap-6 items-center">
        {/* Search */}
        <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card-dark border border-border-dark focus-within:border-primary transition-colors">
            <div className="text-text-light flex items-center justify-center pl-4">
              <Search className="w-5 h-5" />
            </div>
            <input 
              className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-text-light px-4 text-sm font-normal" 
              placeholder="Search products..."
            />
          </div>
        </label>

        <div className="flex gap-3">
          {/* Cart */}
          <Link 
            href="/cart" 
            className="flex items-center justify-center rounded-lg size-10 bg-card-dark hover:bg-border-dark text-white transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems() > 0 && (
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            )}
          </Link>

          {/* Notifications */}
          <Link 
            href="/notifications" 
            className="flex items-center justify-center rounded-lg size-10 bg-card-dark hover:bg-border-dark text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
          </Link>

          {/* User Avatar */}
          {isAuthenticated && user ? (
            <div 
              className="size-10 rounded-full bg-cover bg-center border-2 border-primary"
              style={{ backgroundImage: `url(${user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB62muIiUcro64wN3fRUdO1c7vCKbYlML21GKFAXu4gRRAVs7wKvKPLvonCdOniM0UQQl0S40KyHrY-IYgkTBFATIZzVlD4WwllWPuRVQhjIplC-c7ih75JNdPllfxWaDVR1g4pK5Ao-RwsxVShhfVlEVVoGJlRAUR3c4-PqYON_JTZSK4fBb50OxWwcWO9WAVAfDyVPSdB27ZfCmYHxCTi-HyxLcsgXtIqd9NdNT3XHgK8HavBXmI2yqPYqIUgFXYGEoaZz93wEJE'})` }}
            />
          ) : (
            <Link 
              href="/login"
              className="flex items-center justify-center rounded-lg size-10 bg-card-dark hover:bg-border-dark text-white transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default OrderHeader;
