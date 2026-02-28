'use client';

import { 
  AutoAwesome, SmartToy, CheckCircle, ArrowForward 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIPolicyCardProps {
  title?: string;
  description?: string;
  isEligible?: boolean;
  eligibleText?: string;
}

export default function AIPolicyCard({
  title = "Good news! You're eligible for a full refund.",
  description = "Based on your order status and return history, this request qualifies for an instant approval. No restocking fees apply if returned within 30 days.",
  isEligible = true,
  eligibleText = "Eligible for Return until Nov 24"
}: AIPolicyCardProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#2e243d] dark:to-[#1e1a24] p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <SmartToy className="w-24 h-24 text-indigo-500" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <AutoAwesome className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">AI Policy Check</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-indigo-200/80 text-sm leading-relaxed max-w-lg">
          {description}
        </p>
        
        {isEligible && (
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {eligibleText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
