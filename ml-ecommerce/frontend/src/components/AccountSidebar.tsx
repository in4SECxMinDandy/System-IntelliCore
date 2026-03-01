'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, ShoppingBag, Heart, Wallet, MapPin, 
  Sparkles, Star, Settings, LogOut, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  children?: React.ReactNode;
}

const menuItems = [
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: ShoppingBag, label: 'My Orders', href: '/orders', active: true },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: Wallet, label: 'Payment Methods', href: '/profile' },
  { icon: MapPin, label: 'Address Book', href: '/profile' },
];

const recommendedProducts = [
  {
    id: '1',
    name: 'Nike Air Max 270 React Eng',
    price: 299.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjQm00q8RSexE5TcKS01ixO6NJhJM-UaXF_gJm91a6walPXmH5dLlothE6a-pYehAPxdJel7ht0LefkBfIVSnS4n-LK2eHzCVFWo9gwefM7uSE1hrpdhpKgJrMp5-97sp_wYJyFn3vpjS7pmIwaqJmaqN5i6iVfZ01sd6-MEDM4_CMQlmlCJdfDRYlHB7wNo9iJWeFXJV7ddhRY6zutSJgDNhtjguovukMF8LDqVW7CjMsAKV_y3j_J4jCD-sR-Yhhnbv6YbCKt0',
  },
  {
    id: '2',
    name: 'Apple Watch Series 6 GPS',
    price: 399.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjwfNCYvHCZenN1yMYSCowkyMFK3Ixv0vuZPoXw_Vy6-KKZBTE3CjEPQZOEM4vWVUjRJJa_T2q2bp66cZke9sB33ouX-HkzrGUOvTuqoFjC3KsLjzTYEgF7ZrvgROKrFGD5yLJELpLPOPOMB9JRlm-qVUXPM6GVDw0ULZX3J6bpUaoUJbsJtUU_9VzBNif-DoCE_HWnZMrlnhmdsmxf2mH2AVNyLUeyiH2vWGh4CH6RjAFLsNtQ-P2Fu7mElH54NCJWOtwdZeSw_g',
  },
];

export default function AccountSidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-6 shrink-0">
      {/* Account Menu */}
      <div className="bg-stitch-card rounded-xl p-5 border border-stitch-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-white font-bold">{user?.fullName || 'Jane Doe'}</h3>
            <p className="text-xs text-stitch-muted">Platinum Member</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/orders' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 font-bold'
                    : 'text-stitch-muted hover:bg-stitch-border hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Recommended Sidebar Widget */}
      <div className="bg-stitch-card rounded-xl p-5 border border-stitch-border">
        <div className="flex items-center gap-2 mb-4 text-primary-500">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended</h3>
        </div>
        <div className="flex flex-col gap-4">
          {recommendedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group flex gap-3 items-start">
              <div 
                className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-stitch-border group-hover:border-primary-500 transition-colors duration-200"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div>
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
                  {product.name}
                </p>
                <p className="text-primary-500 font-bold text-sm mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
