'use client';

import Link from 'next/link';
import { 
  Person, ShoppingBag, Favorite, AccountBalanceWallet, 
  LocationOn, AutoAwesome 
} from 'lucide-react';

interface OrderSidebarProps {
  activeItem?: string;
  user?: {
    name: string;
    avatar?: string;
    membership?: string;
  };
  recommendedItems?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

const menuItems = [
  { id: 'profile', label: 'My Profile', icon: Person, href: '/profile' },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag, href: '/orders', active: true },
  { id: 'wishlist', label: 'Wishlist', icon: Favorite, href: '/wishlist' },
  { id: 'payment', label: 'Payment Methods', icon: AccountBalanceWallet, href: '/payment' },
  { id: 'address', label: 'Address Book', icon: LocationOn, href: '/address' },
];

export function OrderSidebar({ 
  activeItem = 'orders', 
  user = { name: 'Jane Doe', membership: 'Platinum Member' },
  recommendedItems = []
}: OrderSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col gap-6 shrink-0">
      {/* Account Menu */}
      <div className="bg-card-dark rounded-xl p-5 border border-border-dark">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="size-12 rounded-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAemMbdC_W82xZO_vMp4RDOd2Mw99iMw8BVmZZP7K5Fkltafiuo_kC9N1qlBKvJIqP5B6t2a1WOLjwP35Q6uvBEwTO_tbNdxDgB63dmO0bYCgE1ucwAXdlkZa3IXPNp5-SRqiRBhCp5xIHNvaJdFi5HHpLz33EHkmuSaZ-0KR94PZSZbtog8RQZyRZNvOTf2yXRPVV6hXAJZmxE-mIFwr6PQ8T8zfFlUoCGs4lZH9-VxDQVS9ZiHow__SzYUibfRugO4WUey9TieIM'})` 
            }}
          />
          <div>
            <h3 className="text-white font-bold">{user.name}</h3>
            <p className="text-xs text-text-light">{user.membership}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-light hover:bg-border-dark hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Recommended Sidebar Widget */}
      {recommendedItems.length > 0 && (
        <div className="bg-card-dark rounded-xl p-5 border border-border-dark">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <AutoAwesome className="w-5 h-5 fill-current" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended</h3>
          </div>
          <div className="flex flex-col gap-4">
            {recommendedItems.map((item) => (
              <Link key={item.id} className="group flex gap-3 items-start" href={`/products/${item.id}`}>
                <div 
                  className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-border-dark group-hover:border-primary transition-colors"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div>
                  <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-primary font-bold text-sm mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default OrderSidebar;
