"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Parallax rate (0.1 = subtle, 0.5 = medium, 1 = strong). Default: 0.3 */
  rate?: number;
  /** Enable Ken Burns effect (slow zoom) */
  kenBurns?: boolean;
  /** Ken Burns duration in seconds. Default: 20 */
  kenBurnsDuration?: number;
  /** Image priority (for LCP optimization) */
  priority?: boolean;
  /** Container class names */
  className?: string;
  /** Image class names */
  imageClassName?: string;
  /** Overlay gradient */
  overlay?: "none" | "bottom" | "full" | "vignette";
  /** Custom overlay class */
  overlayClassName?: string;
}

export function ParallaxImage({
  src,
  alt,
  rate = 0.3,
  kenBurns = false,
  kenBurnsDuration = 20,
  priority = false,
  className,
  imageClassName,
  overlay = "none",
  overlayClassName,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax movement based on rate
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${rate * 100}px`, `-${rate * 100}px`]
  );

  // Scale factor to prevent edges from showing
  const scale = 1 + rate * 0.5;

  // Ken Burns animation
  const kenBurnsAnimation = kenBurns
    ? {
        scale: [1.1, 1],
        transition: {
          duration: kenBurnsDuration,
          ease: "linear" as const,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      }
    : undefined;

  // Overlay styles
  const overlayStyles = {
    none: "",
    bottom: "bg-gradient-to-t from-black/70 via-black/30 to-transparent",
    full: "bg-black/40",
    vignette: "bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        style={{ y, scale }}
        animate={kenBurnsAnimation}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover", imageClassName)}
          sizes="100vw"
        />
      </motion.div>

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
 * Parallax image with multi-layer support
 */
export function ParallaxLayeredImage({
  src,
  alt,
  foregroundSrc,
  foregroundAlt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  foregroundSrc?: string;
  foregroundAlt?: string;
  priority?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const yForeground = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Background layer */}
      <motion.div
        style={{ y: yBackground, scale: 1.2 }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Foreground layer (optional) */}
      {foregroundSrc && (
        <motion.div
          style={{ y: yForeground, scale: 1.3 }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={foregroundSrc}
            alt={foregroundAlt || alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      )}
    </div>
  );
}

export default ParallaxImage;
