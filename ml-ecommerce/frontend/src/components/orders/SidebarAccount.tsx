'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, ShoppingBag, Heart, Wallet, MapPin, Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarAccountProps {
  user?: {
    name: string;
    avatar?: string;
    membership?: string;
  };
  className?: string;
}

const menuItems = [
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: ShoppingBag, label: 'My Orders', href: '/orders', active: true },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: Wallet, label: 'Payment Methods', href: '/profile' },
  { icon: MapPin, label: 'Address Book', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/profile' },
];

export function SidebarAccount({ user, className }: SidebarAccountProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('hidden lg:flex w-64 flex-col gap-6 shrink-0', className)}>
      {/* Account Menu */}
      <div className="bg-surface-dark dark:bg-[#221910] rounded-xl p-5 border border-border-dark dark:border-[#393028]">
        {user && (
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="size-12 rounded-full bg-cover bg-center border-2 border-primary-500"
              style={{ backgroundImage: user.avatar ? `url("${user.avatar}")` : undefined }}
            >
              {!user.avatar && (
                <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-white font-bold">{user.name}</h3>
              <p className="text-xs text-text-light dark:text-[#baab9c]">
                {user.membership || 'Member'}
              </p>
            </div>
          </div>
        )}
        
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.active && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-text-light dark:text-[#baab9c] hover:bg-[#393028] hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className={cn('text-sm font-medium', isActive && 'font-bold')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
