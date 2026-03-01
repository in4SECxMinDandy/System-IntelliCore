'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserProfile {
  name: string;
  avatar?: string;
  membership?: string;
}

interface OrderSidebarProps {
  user?: UserProfile;
}

const menuItems = [
  { icon: 'person', label: 'My Profile', href: '/profile' },
  { icon: 'shopping_bag', label: 'My Orders', href: '/orders', active: true },
  { icon: 'favorite', label: 'Wishlist', href: '/wishlist' },
  { icon: 'account_balance_wallet', label: 'Payment Methods', href: '/profile/payment-methods' },
  { icon: 'location_on', label: 'Address Book', href: '/profile/addresses' },
];

// Material Symbols icon component
const MaterialIcon = ({ icon, className, children }: { icon?: string; className?: string; children?: React.ReactNode }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon || children}</span>
);

export default function OrderSidebar({ user }: OrderSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-6 shrink-0">
      {/* Account Menu */}
      <div className="bg-card-dark dark:bg-[#221910] rounded-xl p-5 border border-border-dark dark:border-[#393028]">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-full bg-cover bg-center bg-gray-200 dark:bg-[#393028] shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MaterialIcon icon="person" className="text-text-light dark:text-[#baab9c]" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white dark:text-white font-bold">{user?.name || 'Guest User'}</h3>
            <p className="text-xs text-text-light dark:text-[#baab9c]">{user?.membership || 'Member'}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/orders' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-light dark:text-[#baab9c] hover:bg-border-dark dark:hover:bg-[#393028] hover:text-white'
                  }
                `}
              >
                <MaterialIcon icon={item.icon} className="text-lg" />
                <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Recommended Sidebar Widget */}
      <RecommendedWidget />
    </aside>
  );
}

// Recommended Widget Component
function RecommendedWidget() {
  const recommendations = [
    {
      id: '1',
      name: 'Nike Air Max 270 React Eng',
      price: 299.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjQm00q8RSexE5TcKS01ixO6NJhJM-UaXF_gJm91a6walPXmH5dLlothE6a-pYehAPxdJel7ht0LefkBfIVSnS4n-LK2eHzCVFWo9gwefM7uSE1hrpdhpKgJrMp5-97sp_wYJyFn3vpjS7pmIwaqJmaqN5i6iVfZ01sd6-MEDM4_CMQlmlCJdfDRYlHB7wNo9iJWeFXJV7ddhRY6zutSJgDNhtjguovukMF8LDqVW7CjMsAKV_y3j_J4jCD-sR-Yhhnbv6YbCKt0'
    },
    {
      id: '2',
      name: 'Apple Watch Series 6 GPS',
      price: 399.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjwfNCYvHCZenN1yMYSCowkyMFK3Ixv0vuZPoXw_Vy6-KKZBTE3CjEPQZOEM4vWVUjRJJa_T2q2bp66cZke9sB33ouX-HkzrGUOvTuqoFjC3KsLjzTYEgF7ZrvgROKrFGD5yLJELpLPOPOMB9JRlm-qVUXPM6GVDw0ULZX3J6bpUaoUJbsJtUU_9VzBNif-DoCE_HWnZMrlnhmdsmxf2mH2AVNyLUeyiH2vWGh4CH6RjAFLsNtQ-P2Fu7mElH54NCJWOtwdZeSw_g'
    }
  ];

  return (
    <div className="bg-card-dark dark:bg-[#221910] rounded-xl p-5 border border-border-dark dark:border-[#393028]">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <MaterialIcon icon="auto_awesome" className="fill-current" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended</h3>
      </div>
      <div className="flex flex-col gap-4">
        {recommendations.map((item) => (
          <a key={item.id} href="#" className="group flex gap-3 items-start">
            <div 
              className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-border-dark dark:border-[#393028] group-hover:border-primary transition-colors"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div>
              <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {item.name}
              </p>
              <p className="text-primary font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
