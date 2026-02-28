'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Package, Cable } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReturnItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  imageUrl?: string;
  isReturnable?: boolean;
  hasCable?: boolean;
}

interface ReturnItemSelectorProps {
  items: ReturnItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export default function ReturnItemSelector({ 
  items, 
  selectedItems, 
  onSelectionChange 
}: ReturnItemSelectorProps) {
  const handleToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const totalRefund = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white dark:bg-stitch-surface rounded-xl border border-stitch-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white dark:text-white text-2xl font-bold">Select Items to Return</h2>
        <button 
          onClick={handleSelectAll}
          className="text-primary-500 text-sm font-medium hover:underline"
        >
          {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          
          return (
            <label 
              key={item.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer group',
                isSelected 
                  ? 'border-primary-500 bg-primary-500/5 dark:bg-primary-500/10' 
                  : 'border-stitch-border bg-stitch-surface/50 dark:bg-[#2b2116]/50 hover:bg-stitch-surface dark:hover:bg-[#342a20]'
              )}
            >
              {/* Checkbox */}
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(item.id)}
                  className={cn(
                    'w-5 h-5 rounded border-2 transition-all duration-200',
                    isSelected 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : 'border-stitch-muted bg-transparent'
                  )}
                />
              </div>
              
              {/* Product Image */}
              {item.imageUrl ? (
                <div className="w-20 h-20 rounded-lg bg-stitch-border shrink-0 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : item.hasCable ? (
                <div className="w-20 h-20 rounded-lg bg-stitch-border shrink-0 flex items-center justify-center">
                  <Cable className="w-8 h-8 text-stitch-muted" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-stitch-border shrink-0 flex items-center justify-center">
                  <Package className="w-8 h-8 text-stitch-muted" />
                </div>
              )}
              
              {/* Product Info */}
              <div className="flex flex-col grow gap-1">
                <div className="flex justify-between items-start w-full">
                  <p className="text-white text-base font-semibold leading-tight">
                    {item.name}
                  </p>
                  <span className="text-white font-bold whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <p className="text-stitch-muted text-sm">
                  {item.variant && `${item.variant} • `}Qty: {item.quantity}
                </p>
                {item.isReturnable && (
                  <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Returnable
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Summary */}
      {selectedItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-stitch-border">
          <div className="flex justify-between items-center">
            <span className="text-stitch-muted">Selected {selectedItems.length} item(s)</span>
            <span className="text-primary-500 font-bold text-xl">
              ${totalRefund.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
