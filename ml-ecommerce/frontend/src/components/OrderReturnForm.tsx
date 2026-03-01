'use client';

import { useState } from 'react';
import Image from 'next/image';

const MaterialIcon = ({ icon, className, children }: { icon?: string; className?: string; children?: React.ReactNode }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon || children}</span>
);

interface ReturnItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  returnable: boolean;
}

interface OrderReturnFormProps {
  orderId: string;
  orderDate: string;
  items: ReturnItem[];
  onSubmit?: (selectedItems: string[], reason: string, comments: string) => void;
}

const RETURN_REASONS = [
  'Defective or Damaged',
  'Wrong Item Sent',
  'Better Price Available',
  'No Longer Needed',
  'Item arrived too late',
];

export default function OrderReturnForm({ orderId, orderDate, items, onSubmit }: OrderReturnFormProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.filter(i => i.returnable).map(i => i.id)));
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [comments, setComments] = useState('');
  const [selectAll, setSelectAll] = useState(true);

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === items.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.id)));
    }
    setSelectAll(!selectAll);
  };

  const totalRefund = items
    .filter(i => selectedItems.has(i.id))
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(Array.from(selectedItems), reason, comments);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Items Selection */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {/* AI Policy Check Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#2e243d] dark:to-[#1e1a24] p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MaterialIcon className="text-9xl">smart_toy</MaterialIcon>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <MaterialIcon className="fill-current">auto_awesome</MaterialIcon>
              <span className="text-sm font-bold uppercase tracking-wide">AI Policy Check</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Good news! You&apos;re eligible for a full refund.</h3>
            <p className="text-slate-600 dark:text-indigo-200/80 text-sm leading-relaxed max-w-lg">
              Based on your order status and return history, this request qualifies for an instant approval. No restocking fees apply if returned within 30 days.
            </p>
          </div>
        </div>

        {/* Select Items Section */}
        <section className="bg-white dark:bg-[#221910] rounded-xl border border-gray-200 dark:border-[#393028] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold">Select Items to Return</h2>
            <button 
              onClick={toggleSelectAll}
              className="text-primary text-sm font-medium hover:underline transition-colors"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <label 
                key={item.id}
                className={`
                  flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer group
                  ${selectedItems.has(item.id)
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-100 dark:border-[#393028] bg-gray-50/50 dark:bg-[#2b2116]/50 hover:bg-gray-50 dark:hover:bg-[#342a20]'
                  }
                `}
              >
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="h-5 w-5 rounded border-gray-300 dark:border-[#54473b] border-2 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 focus:border-primary focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="h-20 w-20 rounded-lg bg-gray-200 dark:bg-[#393028] shrink-0 overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col grow gap-1">
                  <div className="flex justify-between items-start w-full">
                    <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight">
                      {item.name}
                    </p>
                    <span className="text-slate-900 dark:text-white font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-[#baab9c] text-sm">
                    {item.variant} • Qty: {item.quantity}
                  </p>
                  {item.returnable && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <MaterialIcon className="text-sm fill-current">check_circle</MaterialIcon>
                      Returnable
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Reason & Summary */}
      <div className="flex flex-col gap-6">
        {/* Reason Card */}
        <div className="bg-white dark:bg-[#221910] rounded-xl border border-gray-200 dark:border-[#393028] p-6 shadow-sm sticky top-24">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-4">Reason for Return</h2>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 dark:text-[#baab9c] uppercase tracking-wider mb-2 block">
                Reason Code
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1f1a14] border border-gray-300 dark:border-[#393028] text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 appearance-none cursor-pointer"
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-6 text-slate-500">
                <MaterialIcon>expand_more</MaterialIcon>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-[#baab9c] uppercase tracking-wider mb-2 block">
                Additional Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please provide more details..."
                className="w-full bg-gray-50 dark:bg-[#1f1a14] border border-gray-300 dark:border-[#393028] text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 h-32 resize-none cursor-pointer"
              />
            </div>
            <div className="h-px bg-gray-200 dark:bg-[#393028] my-2"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-[#baab9c]">Refund Method</span>
              <span className="text-slate-900 dark:text-white font-medium">Original Payment</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-[#baab9c]">Estimated Refund</span>
              <span className="text-primary font-bold text-lg">${totalRefund.toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={selectedItems.size === 0}
              className={`
                w-full py-4 px-6 rounded-lg shadow-lg transition-all mt-2 flex items-center justify-center gap-2 text-base tracking-wide font-bold
                ${selectedItems.size > 0 
                  ? 'bg-primary hover:bg-primary-700 text-white dark:text-background-dark cursor-pointer' 
                  : 'bg-gray-300 dark:bg-[#393028] text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span>Request Refund</span>
              <MaterialIcon className="text-lg">arrow_forward</MaterialIcon>
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-stone-500 mt-2">
              By continuing, you agree to our{' '}
              <a className="underline hover:text-gray-600 dark:hover:text-stone-400 transition-colors" href="#">
                Return Policy
              </a>
            </p>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
          <div className="flex gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 h-fit text-blue-600 dark:text-blue-400">
              <MaterialIcon className="text-xl">headset_mic</MaterialIcon>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Need help with this return?</h4>
              <p className="text-xs text-slate-600 dark:text-blue-200/70 mb-3">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <a className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors" href="#">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
