"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
}

export default function AdBanner({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = true,
  className = ""
}: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small timeout to prevent hydration mismatch and ensure script is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("Error loading AdSense", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto my-8 p-1.5 glass-panel-strong rounded-2xl overflow-hidden relative min-h-[120px] flex flex-col justify-center ${className}`}>
      {/* Label for premium feel */}
      <div className="absolute top-2 left-0 right-0 text-center text-[9px] text-muted-gray/30 uppercase tracking-[0.2em] font-medium z-10 pointer-events-none">
        Advertisement
      </div>
      
      {/* Background placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
        </div>
      )}

      {/* AdSense Unit */}
      <div className="relative z-0 flex items-center justify-center w-full pt-4">
        {isLoaded && (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client="ca-pub-7228775489301843"
            data-ad-slot={dataAdSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive={dataFullWidthResponsive.toString()}
          />
        )}
      </div>
    </div>
  );
}
