'use client';

import { 
  CheckCircle, Package, LocalShipping, Home, 
  Circle, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TrackingStep = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
};

interface TrackingStepperProps {
  steps: TrackingStep[];
  currentStepId?: string;
}

interface StepProps {
  step: TrackingStep;
  index: number;
  isLast: boolean;
}

function Step({ step, index, isLast }: StepProps) {
  return (
    <div className={cn('flex gap-4 pb-8 relative group', isLast && 'pb-0')}>
      {/* Icon Column */}
      <div className="flex flex-col items-center">
        {step.isCompleted ? (
          <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white shadow-[0_0_15px_rgba(242,127,13,0.5)]">
            <CheckCircle className="w-5 h-5" />
          </div>
        ) : step.isActive ? (
          <div className="z-10 flex items-center justify-center w-10 h-10 -ml-1 rounded-full bg-stitch-bg border-2 border-primary-500 text-primary-500 shadow-[0_0_20px_rgba(242,127,13,0.4)] animate-pulse">
            <LocalShipping className="w-5 h-5" />
          </div>
        ) : (
          <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stitch-surface text-stitch-muted">
            <Circle className="w-4 h-4" />
          </div>
        )}
        
        {/* Connector Line */}
        {!isLast && (
          <div 
            className={cn(
              'w-0.5 h-full absolute top-8 left-4 -translate-x-1/2',
              step.isCompleted 
                ? 'bg-primary-500' 
                : 'bg-stitch-border border-l border-dashed border-stitch-muted'
            )} 
          />
        )}
      </div>

      {/* Content Column */}
      <div className={cn('flex-1 pt-1', step.isPending && 'opacity-50')}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className={cn(
              'text-base font-bold',
              step.isActive ? 'text-primary-500' : 'text-white'
            )}>
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-stitch-muted mt-1">{step.description}</p>
            )}
            {step.timestamp && (
              <p className="text-sm text-stitch-muted mt-1">{step.timestamp}</p>
            )}
          </div>
          {step.isActive && (
            <span className="bg-primary-500/10 text-primary-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackingStepper({ steps, currentStepId }: TrackingStepperProps) {
  return (
    <div className="bg-stitch-surface rounded-xl border border-stitch-border p-6">
      <div className="relative">
        {steps.map((step, index) => (
          <Step 
            key={step.id} 
            step={step} 
            index={index} 
            isLast={index === steps.length - 1} 
          />
        ))}
      </div>
    </div>
  );
}
