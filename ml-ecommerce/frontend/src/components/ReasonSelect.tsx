'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReasonOption {
  value: string;
  label: string;
}

interface ReasonSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: ReasonOption[];
}

const defaultReasons: ReasonOption[] = [
  { value: 'defective', label: 'Defective or Damaged' },
  { value: 'wrong_item', label: 'Wrong Item Sent' },
  { value: 'better_price', label: 'Better Price Available' },
  { value: 'not_needed', label: 'No Longer Needed' },
  { value: 'too_late', label: 'Item arrived too late' },
];

export default function ReasonSelect({ 
  value, 
  onChange, 
  options = defaultReasons 
}: ReasonSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <label className="text-xs font-bold text-stitch-muted uppercase tracking-wider mb-2 block">
        Reason Code
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full bg-stitch-bg dark:bg-[#1f1a14] border border-stitch-border',
            'text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500',
            'block p-3 pr-10 appearance-none cursor-pointer',
            'transition-colors duration-200'
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-6 text-stitch-muted">
          <ChevronDown className={cn(
            'w-5 h-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </div>
      </div>
    </div>
  );
}
