'use client';

import { cn } from '@/lib/utils';
import { AutoAwesome, SmartToy } from 'lucide-react';

interface AIPolicyCardProps {
  title: string;
  description: string;
  className?: string;
}

export default function AIPolicyCard({ title, description, className }: AIPolicyCardProps) {
  return (
    <div className={cn(
      'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden group',
      className
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <SmartToy className="w-24 h-24" />
      </div>
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <AutoAwesome className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">AI Policy Check</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-indigo-200/80 text-sm leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
