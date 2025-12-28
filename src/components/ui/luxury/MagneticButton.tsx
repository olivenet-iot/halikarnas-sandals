"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TIMING, EASE } from "@/lib/animations";

interface MagneticButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Link href (makes it a Link component) */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: "primary" | "outline" | "ghost";
  /** Button size */
  size?: "default" | "lg" | "xl";
  /** Magnetic effect strength (0-1). Default: 0.3 */
  strength?: number;
  /** Show shine effect on hover */
  shine?: boolean;
  /** Additional class names */
  className?: string;
  /** Icon on the right */
  icon?: React.ReactNode;
  /** Aria label */
  "aria-label"?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "default",
  strength = 0.3,
  shine = true,
  className,
  icon,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const variantStyles = {
    primary: "bg-[#B8860B] text-white hover:bg-[#9A7209]",
    outline: "border border-white/30 text-white hover:bg-white/10 hover:border-white/60",
    ghost: "text-white hover:bg-white/10",
  };

  const sizeStyles = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
    xl: "px-10 py-5 text-base",
  };

  const buttonContent = (
    <motion.div
      ref={buttonRef}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-3",
        "uppercase tracking-[0.2em] font-medium",
        "transition-colors duration-300",
        "overflow-hidden group",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {/* Shine effect */}
      {shine && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isHovered ? { x: "100%", opacity: 0.3 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: TIMING.medium, ease: EASE.smooth }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Icon */}
      {icon && (
        <motion.span
          className="relative z-10"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{ duration: TIMING.fast, ease: EASE.smooth }}
        >
          {icon}
        </motion.span>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
}

/**
 * Simple arrow icon for buttons
 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

export default MagneticButton;
