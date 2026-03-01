'use client';

import { OrderStatus } from './OrderCard';

// Tab status type - includes both backend status and frontend tab states
export type OrderTabId = OrderStatus | 'all' | 'to_pay' | 'to_ship' | 'to_receive';

interface OrderTabsProps {
  activeTab: OrderTabId;
  onTabChange: (tab: OrderTabId) => void;
  counts?: Record<OrderTabId, number>;
}

const tabs: { id: OrderTabId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'to_ship', label: 'To Ship' },
  { id: 'to_receive', label: 'To Receive' },
  { id: 'completed', label: 'Completed' },
];

export function OrderTabs({ activeTab, onTabChange, counts }: OrderTabsProps) {
  return (
    <div className="w-full overflow-x-auto border-b border-border-dark">
      <div className="flex min-w-max gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts?.[tab.id];
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                pb-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2
                ${isActive 
                  ? 'border-primary text-primary font-bold shadow-[0_1px_0_0_#f27f0d]' 
                  : 'border-transparent text-text-light hover:text-white'
                }
              `}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-primary/20' : 'bg-gray-700'}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTabs;
