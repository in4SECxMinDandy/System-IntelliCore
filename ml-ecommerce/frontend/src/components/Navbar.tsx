'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">
          ML Shop
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/wishlist" className="text-gray-600 hover:text-blue-600 hidden md:block">
            <Heart className="w-5 h-5" />
          </Link>

          <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
            <ShoppingCart className="w-5 h-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <User className="w-5 h-5" />
                <span className="text-sm hidden md:block">{user?.fullName?.split(' ')[0] || 'Account'}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg py-2 w-40 hidden group-hover:block">
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">Orders</Link>
                <button onClick={() => logout()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </nav>
  );
}
