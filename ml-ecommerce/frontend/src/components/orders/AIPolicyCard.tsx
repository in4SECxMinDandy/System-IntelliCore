'use client';

import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIPolicyCardProps {
  title: string;
  description: string;
  eligible: boolean;
}

export function AIPolicyCard({ title, description, eligible }: AIPolicyCardProps) {
  return (
    <div className={cn(
      'rounded-xl p-5 border',
      eligible 
        ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/50' 
        : 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/50'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-2 rounded-lg',
          eligible ? 'bg-green-500/20' : 'bg-amber-500/20'
        )}>
          {eligible ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
              AI Analysis
            </span>
          </div>
          <h3 className={cn(
            'font-semibold mb-1',
            eligible ? 'text-green-300' : 'text-amber-300'
          )}>
            {title}
          </h3>
          <p className="text-sm text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
