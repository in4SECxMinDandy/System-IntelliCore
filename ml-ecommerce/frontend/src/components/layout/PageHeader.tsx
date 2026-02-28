'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-text-light dark:text-text-muted">{description}</p>
      )}
      {children}
    </div>
  );
}
