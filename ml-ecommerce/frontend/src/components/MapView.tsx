'use client';

import { useState } from 'react';
import { 
  LocalShipping, Add, Remove, MyLocation, 
  Navigation, ZoomIn, ZoomOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapViewProps {
  driverName?: string;
  eta?: string;
  className?: string;
}

export default function MapView({ 
  driverName = 'Michael D.', 
  eta = 'Arriving by 6:00 PM',
  className 
}: MapViewProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className={cn(
      'relative w-full h-80 rounded-xl overflow-hidden shadow-lg border border-stitch-border group',
      className
    )}>
      {/* Map Background - Using a placeholder gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale opacity-60 dark:opacity-40"
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBI8H8C4PFX_fJrkkN6v4L9_S-kUXqwx5vzG73y-VRECQfSHGawHc2CXhF4-UxDIAmN2y49tngkMFJpJkqhHtHTwn4Btan7k9JPY-Pl9HAm2A5oDhS6CCAWxAtHQaI-5vV2ZAVvZEUOtnFpQ9FafdJ_7_8jDCrkD7pGiUQG1t1vQ-pQb0ob0heSBZ9t6Rs-yqjpedD0OQqUpfed4pEIr-Xm77yHA2DWGrIMso3LlnHGRlactlkHwnzFFhOY_fRYDY2gFsifTLVNGzc')`
        }}
      />
      
      {/* Map Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-stitch-bg/90 via-transparent to-transparent" />
      
      {/* Vehicle Icon on Map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75" />
          <div className="relative w-12 h-12 bg-stitch-bg rounded-full border-2 border-primary-500 flex items-center justify-center text-primary-500 shadow-[0_0_30px_rgba(242,127,13,0.6)]">
            <LocalShipping className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-stitch-bg/90 backdrop-blur-sm px-3 py-1 rounded-md border border-stitch-border shadow-xl">
          <span className="text-xs font-bold text-white">Driver: {driverName}</span>
        </div>
      </div>

      {/* ETA Badge */}
      <div className="absolute top-4 left-4 bg-stitch-bg/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-stitch-border shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white">{eta}</span>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.25, 2))}
          className="w-10 h-10 bg-stitch-surface text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-stitch-border transition-colors"
        >
          <Add className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
          className="w-10 h-10 bg-stitch-surface text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-stitch-border transition-colors"
        >
          <Remove className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-stitch-surface text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-stitch-border transition-colors">
          <MyLocation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
