'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, Search, User, Heart, Menu, X, Bell,
  Sun, Moon, Monitor, ChevronDown, Package, LayoutDashboard,
  MessageSquare, Users, TrendingUp, Settings, LogOut, Zap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Electronics', href: '/products?category=electronics', icon: '💻' },
  { name: 'Fashion', href: '/products?category=fashion', icon: '👗' },
  { name: 'Home & Garden', href: '/products?category=home', icon: '🏠' },
  { name: 'Sports', href: '/products?category=sports', icon: '⚽' },
  { name: 'Books', href: '/products?category=books', icon: '📚' },
  { name: 'Beauty', href: '/products?category=beauty', icon: '💄' },
];

const navLinks = [
  { name: 'Products', href: '/products' },
  { name: 'Deals', href: '/deals' },
  { name: 'Community', href: '/community' },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const current = themes.find(t => t.value === theme) || themes[2];
  const Icon = current.icon;

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
        aria-label="Toggle theme"
      >
        <Icon className="w-4 h-4" />
      </button>
      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-xl shadow-lg py-1 w-36 hidden group-hover:block z-50 animate-slide-down">
        {themes.map(({ value, icon: ThemeIcon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors',
              theme === value
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
            )}
          >
            <ThemeIcon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifCount] = useState(3); // Mock notification count
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
      setSearchOpen(false);
      setSearch('');
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 dark:bg-dark-950/95 backdrop-blur-md shadow-md'
            : 'bg-white dark:bg-dark-950 border-b border-gray-100 dark:border-dark-800'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo — Stitch brand red */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-glow-red group-hover:shadow-lg transition-shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:block">IntelliCore</span>
            </Link>


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Categories Mega Menu */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                  Categories
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full mt-1 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-2xl shadow-xl p-4 w-72 hidden group-hover:block z-50 animate-slide-down">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
                    <Link
                      href="/products"
                      className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-800'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search Bar — Desktop */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="navbar-search-desktop"
                  name="q"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products, brands..."
                  className="input pl-9 pr-4 py-2 text-sm"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors relative"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <Link
                  href="/notifications"
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems() > 99 ? '99+' : totalItems()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                      {user?.fullName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-xl shadow-xl py-2 w-52 hidden group-hover:block z-50 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-700 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <Link href="/community" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Users className="w-4 h-4" /> Community
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <TrendingUp className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 dark:border-dark-700 mt-1 pt-1">
                      <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary btn-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="navbar-search-mobile"
                name="q"
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="input pl-9 pr-4 py-2.5 text-sm"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-950 animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 dark:border-dark-800 pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              {!isAuthenticated && (
                <div className="border-t border-gray-100 dark:border-dark-800 pt-3 mt-3 flex gap-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-outline btn-md flex-1 justify-center">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary btn-md flex-1 justify-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
