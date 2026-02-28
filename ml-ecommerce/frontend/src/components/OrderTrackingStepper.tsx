'use client';

import Image from 'next/image';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
}

interface OrderTrackingStepperProps {
  steps: TrackingStep[];
  currentStep?: number;
}

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

export default function OrderTrackingStepper({ steps, currentStep = 0 }: OrderTrackingStepperProps) {
  return (
    <div className="bg-card-dark dark:bg-[#221910] rounded-xl border border-border-dark dark:border-[#393028] p-6 shadow-sm">
      <div className="relative">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex gap-4 pb-8 relative group ${index === steps.length - 1 ? 'pb-0' : ''}`}
          >
            {/* Circle and Line */}
            <div className="flex flex-col items-center">
              {step.isCompleted ? (
                // Completed step
                <>
                  <div className="z-10 flex items-center justify-center size-8 rounded-full bg-primary text-white shadow-[0_0_15px_rgba(242,127,13,0.5)]">
                    <MaterialIcon className="text-lg">check_circle</MaterialIcon>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-primary absolute top-8 left-4 -translate-x-1/2"></div>
                  )}
                </>
              ) : step.isActive ? (
                // Active step
                <>
                  <div className="z-10 flex items-center justify-center size-10 -ml-1 rounded-full bg-background-dark dark:bg-[#181411] border-2 border-primary text-primary shadow-[0_0_20px_rgba(242,127,13,0.4)] animate-pulse">
                    <MaterialIcon className="text-xl">local_shipping</MaterialIcon>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-border-dark dark:bg-[#393028] absolute top-9 left-4 -translate-x-1/2 border-l border-dashed border-[#54473b]"></div>
                  )}
                </>
              ) : (
                // Pending step
                <>
                  <div className="z-10 flex items-center justify-center size-8 rounded-full bg-border-dark dark:bg-[#393028] text-text-light dark:text-[#baab9c]">
                    <MaterialIcon className="text-lg">home</MaterialIcon>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-border-dark dark:bg-[#393028] absolute top-8 left-4 -translate-x-1/2"></div>
                  )}
                </>
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pt-1 ${step.isPending ? 'opacity-50' : ''}`}>
              {step.isActive ? (
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-primary">{step.title}</h4>
                    <p className="text-sm text-text-light dark:text-[#baab9c] mt-1">
                      {step.timestamp} • {step.description}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Live
                  </span>
                </div>
              ) : (
                <>
                  <h4 className={`text-base font-bold ${step.isCompleted ? 'text-white dark:text-white' : 'text-text-light dark:text-[#baab9c]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-text-light dark:text-[#baab9c] mt-1">
                    {step.isPending ? step.timestamp : `${step.timestamp} • ${step.description}`}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Map View Component
interface MapViewProps {
  driverName?: string;
  vehicleType?: string;
}

export function OrderTrackingMap({ driverName = 'Michael D.', vehicleType = 'Van' }: MapViewProps) {
  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg border border-border-dark dark:border-[#393028] group">
      {/* Map Background - Using a placeholder */}
      <div className="absolute inset-0 bg-neutral-800 bg-cover bg-center grayscale opacity-60 dark:opacity-40">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI8H8C4PFX_fJrkkN6v4L9_S-kUXqwx5vzG73y-VRECQfSHGawHc2CXhF4-UxDIAmN2y49tngkMFJpJkqhHtHTwn4Btan7k9JPY-Pl9HAm2A5oDhS6CCAWxAtHQaI-5vV2ZAVvZEUOtnFpQ9FafdJ_7_8jDCrkD7pGiUQG1t1vQ-pQb0ob0heSBZ9t6Rs-yqjpedD0OQqUpfed4pEIr-Xm77yHA2DWGrIMso3LlnHGRlactlkHwnzFFhOY_fRYDY2gFsifTLVNGzc"
          alt="Map"
          fill
          className="object-cover"
        />
      </div>

      {/* Map Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>

      {/* Vehicle Icon on Map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
          <div className="relative size-12 bg-background-dark dark:bg-[#181411] rounded-full border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_30px_rgba(242,127,13,0.6)]">
            <MaterialIcon className="text-xl">local_shipping</MaterialIcon>
          </div>
        </div>
        <div className="bg-background-dark/90 dark:bg-[#181411]/90 backdrop-blur-sm px-3 py-1 rounded-md border border-border-dark dark:border-[#393028] shadow-xl">
          <span className="text-xs font-bold text-white">Driver: {driverName}</span>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="size-10 bg-surface-dark dark:bg-[#2f241a] text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-border-dark dark:hover:bg-[#393028] transition-colors">
          <MaterialIcon className="text-xl">add</MaterialIcon>
        </button>
        <button className="size-10 bg-surface-dark dark:bg-[#2f241a] text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-border-dark dark:hover:bg-[#393028] transition-colors">
          <MaterialIcon className="text-xl">remove</MaterialIcon>
        </button>
      </div>
    </div>
  );
}
