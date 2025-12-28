"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  /** Video source URL */
  src: string;
  /** Poster image URL (shown before video loads) */
  poster?: string;
  /** Fallback component when video can't play */
  fallback?: React.ReactNode;
  /** Video type (default: video/mp4) */
  type?: string;
  /** Play video when in view */
  playOnView?: boolean;
  /** Additional class names */
  className?: string;
  /** Overlay style */
  overlay?: "none" | "dark" | "gradient" | "vignette";
  /** Custom overlay class */
  overlayClassName?: string;
}

export function VideoBackground({
  src,
  poster,
  fallback,
  type = "video/mp4",
  playOnView = true,
  className,
  overlay = "dark",
  overlayClassName,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for play/pause on view
  useEffect(() => {
    if (!playOnView || !videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay might be blocked, that's okay
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [playOnView]);

  // Handle video load
  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  // Handle video error
  const handleError = () => {
    setHasError(true);
  };

  // Overlay styles
  const overlayStyles = {
    none: "",
    dark: "bg-black/40",
    gradient: "bg-gradient-to-t from-black/70 via-black/30 to-black/10",
    vignette: "bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]",
  };

  // Show fallback if video fails or no src
  if (hasError || !src) {
    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
        {fallback || (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-amber-900/20 to-stone-900 animate-gradient-shift bg-[length:200%_200%]" />
        )}
        {overlay !== "none" && (
          <div className={cn("absolute inset-0", overlayStyles[overlay], overlayClassName)} />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Poster image (shown before video loads) */}
      {poster && !isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={poster}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Video */}
      <motion.video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoadedData}
        onError={handleError}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          !isLoaded && "opacity-0"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <source src={src} type={type} />
      </motion.video>

      {/* Overlay */}
      {overlay !== "none" && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            overlayStyles[overlay],
            overlayClassName
          )}
        />
      )}
    </div>
  );
}

/**
 * Animated gradient background (fallback for video)
 */
export function AnimatedGradientBackground({
  className,
  overlay = true,
}: {
  className?: string;
  overlay?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-amber-900/20 to-stone-900 animate-gradient-shift bg-[length:200%_200%]" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Dark overlay */}
      {overlay && <div className="absolute inset-0 bg-black/40" />}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

export default VideoBackground;
