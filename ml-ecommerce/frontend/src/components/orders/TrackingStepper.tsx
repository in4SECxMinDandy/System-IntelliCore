'use client';

import { cn } from '@/lib/utils';
import { Check, Package, LocalShipping, Home, Circle } from 'lucide-react';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
}

interface TrackingStepperProps {
  steps: TrackingStep[];
  currentStep: number;
  className?: string;
}

export default function TrackingStepper({ steps, currentStep, className }: TrackingStepperProps) {
  return (
    <div className={cn('relative', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className={cn('flex gap-4 pb-8 relative group', isLast && 'pb-0')}>
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white shadow-[0_0_15px_rgba(242,127,13,0.5)]">
                    <Check className="w-5 h-5" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-full bg-primary-500 absolute top-8 left-4 -translate-x-1/2" />
                  )}
                </>
              ) : isCurrent ? (
                <>
                  <div className="z-10 flex items-center justify-center w-10 h-10 -ml-1 rounded-full bg-background-light dark:bg-background-dark border-2 border-primary-500 text-primary-500 shadow-[0_0_20px_rgba(242,127,13,0.4)] animate-pulse">
                    <LocalShipping className="w-5 h-5" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 absolute top-9 left-4 -translate-x-1/2 border-l border-dashed border-gray-400 dark:border-gray-600" />
                  )}
                </>
              ) : (
                <>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
                    <Circle className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 absolute top-8 left-4 -translate-x-1/2" />
                  )}
                </>
              )}
            </div>

            {/* Content Column */}
            <div className={cn('flex-1 pt-1', isCurrent && 'pt-2')}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={cn(
                    'text-base font-bold',
                    isCompleted && 'text-gray-900 dark:text-white',
                    isCurrent && 'text-primary-500',
                    !isCompleted && !isCurrent && 'text-gray-900 dark:text-white opacity-50'
                  )}>
                    {step.title}
                  </h4>
                  <p className={cn(
                    'text-sm mt-1',
                    isCompleted && 'text-gray-500 dark:text-gray-400',
                    isCurrent && 'text-gray-500 dark:text-gray-400',
                    !isCompleted && !isCurrent && 'text-gray-500 dark:text-gray-400 opacity-50'
                  )}>
                    {step.description}
                  </p>
                </div>
                {isCurrent && (
                  <span className="bg-primary-500/10 text-primary-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Live
                  </span>
                )}
              </div>
              {step.timestamp && (
                <p className={cn(
                  'text-sm mt-1',
                  isCompleted && 'text-gray-500 dark:text-gray-400',
                  isCurrent && 'text-gray-500 dark:text-gray-400',
                  !isCompleted && !isCurrent && 'text-gray-500 dark:text-gray-400 opacity-50'
                )}>
                  {step.timestamp}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
