'use client';

import { cn } from '@/lib/utils';
import { Plus, Minus, LocalShipping } from 'lucide-react';

interface MapViewProps {
  driverName?: string;
  className?: string;
}

export default function MapView({ driverName = 'Michael D.', className }: MapViewProps) {
  return (
    <div className={cn(
      'relative w-full h-80 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 group',
      className
    )}>
      {/* Map Background - Placeholder */}
      <div 
        className="absolute inset-0 bg-gray-800 bg-cover bg-center grayscale opacity-60 dark:opacity-40"
        style={{ 
          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBI8H8C4PFX_fJrkkN6v4L9_S-kUXqwx5vzG73y-VRECQfSHGawHc2CXhF4-UxDIAmN2y49tngkMFJpJkqhHtHTwn4Btan7k9JPY-Pl9HAm2A5oDhS6CCAWxAtHQaI-5vV2ZAVvZEUOtnFpQ9FafdJ_7_8jDCrkD7pGiUQG1t1vQ-pQb0ob0heSBZ9t6Rs-yqjpedD0OQqUpfed4pEIr-Xm77yHA2DWGrIMso3LlnHGRlactlkHwnzFFhOY_fRYDY2gFsifTLVNGzc")' 
        }}
      />
      
      {/* Map Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
      
      {/* Vehicle Icon on Map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75" />
          <div className="relative w-12 h-12 bg-gray-900 rounded-full border-2 border-primary-500 flex items-center justify-center text-primary-500 shadow-[0_0_30px_rgba(242,127,13,0.6)]">
            <LocalShipping className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-md border border-gray-700 shadow-xl">
          <span className="text-xs font-bold text-white">Driver: {driverName}</span>
        </div>
      </div>
      
      {/* Floating Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-surface-dark dark:bg-gray-800 text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-surface-dark dark:bg-gray-800 text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
