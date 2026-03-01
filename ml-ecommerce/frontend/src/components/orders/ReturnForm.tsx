'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, CheckCircle, ArrowRight, Headphones, 
  Verified 
} from 'lucide-react';

interface ReturnItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image: string;
  returnable?: boolean;
}

interface AIPolicyData {
  eligible: boolean;
  message: string;
  details?: string;
  refundAmount?: number;
}

interface ReturnFormProps {
  orderNumber: string;
  orderDate: string;
  eligibleUntil?: string;
  items: ReturnItem[];
  policy?: AIPolicyData;
  onSubmit?: (data: {
    selectedItems: string[];
    reason: string;
    comments: string;
  }) => void;
}

const reasonOptions = [
  'Defective or Damaged',
  'Wrong Item Sent',
  'Better Price Available',
  'No Longer Needed',
  'Item arrived too late',
];

export function ReturnForm({ 
  orderNumber, 
  orderDate, 
  eligibleUntil,
  items, 
  policy,
  onSubmit 
}: ReturnFormProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(items.filter(i => i.returnable !== false).map(i => i.id))
  );
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSubmit = () => {
    onSubmit?.({
      selectedItems: Array.from(selectedItems),
      reason,
      comments,
    });
  };

  const selectedTotal = items
    .filter(i => selectedItems.has(i.id))
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* AI Policy Check Card */}
      {policy && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#2e243d] dark:to-[#1e1a24] p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wide">AI Policy Check</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {policy.eligible ? 'Good news! You\'re eligible for a full refund.' : 'Return not eligible'}
            </h3>
            <p className="text-gray-600 dark:text-indigo-200/80 text-sm leading-relaxed max-w-lg">
              {policy.message}
              {policy.details && ` ${policy.details}`}
            </p>
          </div>
        </div>
      )}

      {/* Select Items Section */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Items to Return</h2>
          <button 
            onClick={() => {
              if (selectedItems.size === items.length) {
                setSelectedItems(new Set());
              } else {
                setSelectedItems(new Set(items.map(i => i.id)));
              }
            }}
            className="text-primary text-sm font-medium hover:underline"
          >
            {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <label 
              key={item.id}
              className={`
                flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer group
                ${selectedItems.has(item.id) 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#2b2116]/50 hover:bg-gray-50 dark:hover:bg-[#342a20]'
                }
              `}
            >
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-offset-0"
                />
              </div>
              <div className="h-20 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                <img 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                  src={item.image}
                />
              </div>
              <div className="flex flex-col grow gap-1">
                <div className="flex justify-between items-start w-full">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</p>
                  <span className="text-gray-900 dark:text-white font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.variant ? `${item.variant} • ` : ''}Qty: {item.quantity}
                </p>
                {item.returnable !== false && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Returnable
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Reason Card */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reason for Return</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Reason Code
            </label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1f1a14] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 appearance-none"
            >
              <option value="">Select a reason...</option>
              {reasonOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Additional Comments
            </label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please provide more details..."
              className="w-full bg-gray-50 dark:bg-[#1f1a14] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 h-32 resize-none"
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Refund Method</span>
            <span className="text-gray-900 dark:text-white font-medium">Original Payment</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Estimated Refund</span>
            <span className="text-primary font-bold text-lg">${selectedTotal.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={selectedItems.size === 0 || !reason}
            className="w-full bg-primary hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all mt-2 flex items-center justify-center gap-2 text-base tracking-wide"
          >
            <span>Request Refund</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            By continuing, you agree to our <Link href="/return-policy" className="underline hover:text-gray-600 dark:hover:text-gray-300">Return Policy</Link>.
          </p>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
        <div className="flex gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 h-fit text-blue-600 dark:text-blue-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Need help with this return?</h4>
            <p className="text-xs text-gray-600 dark:text-blue-200/70 mb-3">Our support team is available 24/7 to assist you with any questions.</p>
            <Link href="/support" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnForm;
