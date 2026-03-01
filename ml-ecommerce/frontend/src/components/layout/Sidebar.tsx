'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  Heart,
  Wallet,
  MapPin,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: ShoppingBag, label: 'My Orders', href: '/orders', active: true },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: Wallet, label: 'Payment Methods', href: '/profile#payment' },
  { icon: MapPin, label: 'Address Book', href: '/profile#address' },
];

const recommendedItems = [
  {
    id: 1,
    name: 'Nike Air Max 270 React Eng',
    price: 299.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjQm00q8RSexE5TcKS01ixO6NJhJM-UaXF_gJm91a6walPXmH5dLlothE6a-pYehAPxdJel7ht0LefkBfIVSnS4n-LK2eHzCVFWo9gwefM7uSE1hrpdhpKgJrMp5-97sp_wYJyFn3vpjS7pmIwaqJmaqN5i6iVfZ01sd6-MEDM4_CMQlmlCJdfDRYlHB7wNo9iJWeFXJV7ddhRY6zutSJgDNhtjguovukMF8LDqVW7CjMsAKV_y3j_J4jCD-sR-Yhhnbv6YbCKt0',
  },
  {
    id: 2,
    name: 'Apple Watch Series 6 GPS',
    price: 399.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjwfNCYvHCZenN1yMYSCowkyMFK3Ixv0vuZPoXw_Vy6-KKZBTE3CjEPQZOEM4vWVUjRJJa_T2q2bp66cZke9sB33ouX-HkzrGUOvTuqoFjC3KsLjzTYEgF7ZrvgROKrFGD5yLJELpLPOPOMB9JRlm-qVUXPM6GVDw0ULZX3J6bpUaoUJbsJtUU_9VzBNif-DoCE_HWnZMrlnhmdsmxf2mH2AVNyLUeyiH2vWGh4CH6RjAFLsNtQ-P2Fu7mElH54NCJWOtwdZeSw_g',
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('w-64 shrink-0 hidden lg:flex flex-col gap-6', className)}>
      {/* Account Menu */}
      <div className="bg-card-dark dark:bg-surface-dark rounded-xl p-5 border border-border-dark dark:border-border-dark">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary-500"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAemMbdC_W82xZO_vMp4RDOd2Mw99iMw8BVmZZP7K5Fkltafiuo_kC9N1qlBKvJIqP5B6t2a1WOLjwP35Q6uvBEwTO_tbNdxDgB63dmO0bYCgE1ucwAXdlkZa3IXPNp5-SRqiRBhCp5xIHNvaJdFi5HHpLz33EHkmuSaZ-0KR94PZSZbtog8RQZyRZNvOTf2yXRPVV6hXAJZmxE-mIFwr6PQ8T8zfFlUoCGs4lZH9-VxDQVS9ZiHow__SzYUibfRugO4WUey9TieIM")' }}
          />
          <div>
            <h3 className="text-white font-bold">Jane Doe</h3>
            <p className="text-xs text-text-light dark:text-text-muted">Platinum Member</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                item.active
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-text-light dark:text-text-muted hover:bg-border-dark dark:hover:bg-border-dark hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className={cn('text-sm font-medium', item.active && 'font-bold')}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Recommended Sidebar Widget */}
      <div className="bg-card-dark dark:bg-surface-dark rounded-xl p-5 border border-border-dark dark:border-border-dark">
        <div className="flex items-center gap-2 mb-4 text-primary-500">
          <Sparkles className="w-4 h-4 fill-current" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended</h3>
        </div>
        <div className="flex flex-col gap-4">
          {recommendedItems.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="group flex gap-3 items-start">
              <div
                className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-border-dark dark:border-border-dark group-hover:border-primary-500 transition-colors"
                style={{ backgroundImage: `url("${item.image}")` }}
              />
              <div>
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary-500 transition-colors">
                  {item.name}
                </p>
                <p className="text-primary-500 font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
