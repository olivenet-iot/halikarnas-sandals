"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { TIMING, EASE } from "@/lib/animations";
import {
  GoldDivider,
  TextFadeIn,
  MagneticButton,
  ArrowIcon,
} from "@/components/ui/luxury";

interface OutroFrameProps {
  isActive: boolean;
}

export function OutroFrame({ isActive }: OutroFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax for background texture
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="collection-frame snap-start snap-always flex items-center justify-center overflow-hidden bg-stone-900"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Leather Texture Background with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black" />

        {/* Subtle leather texture pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold accent gradient at edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(184,134,11,0.05)_0%,transparent_40%)]" />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Top Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: TIMING.slow, ease: EASE.luxury }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]/60" />
            <div className="w-2 h-2 rotate-45 border border-[#B8860B]/60" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]/60" />
          </div>
        </motion.div>

        {/* Gold Divider */}
        <div className="flex justify-center mb-8">
          <GoldDivider variant="wide" isInView={isActive} delay={0.2} />
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.4 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6"
          style={{
            textShadow: "0 0 60px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          Tum koleksiyonlari kesfettiniz
        </motion.h2>

        {/* Subtext */}
        <TextFadeIn
          isInView={isActive}
          delay={0.6}
          className="mb-12"
        >
          <p
            className="text-lg md:text-xl text-white/60 max-w-xl mx-auto font-light"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            El yapimi sandalet koleksiyonlarimizi incelediniz.
            Simdi alisverise baslayin.
          </p>
        </TextFadeIn>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.8 }}
          className="mb-12"
        >
          <MagneticButton
            href="/kadin"
            variant="primary"
            size="lg"
            icon={<ArrowIcon />}
          >
            Alisverise Basla
          </MagneticButton>
        </motion.div>

        {/* Bottom Gold Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: TIMING.medium, delay: 1.0 }}
          className="flex justify-center mb-8"
        >
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#B8860B]/40 to-transparent" />
        </motion.div>

        {/* Secondary Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{ duration: TIMING.medium, ease: EASE.luxury, delay: 1.2 }}
          className="flex items-center justify-center gap-8 text-sm"
        >
          <Link
            href="/hakkimizda"
            className="text-white/40 hover:text-[#B8860B] transition-colors duration-300 uppercase tracking-[0.15em]"
          >
            Hakkimizda
          </Link>
          <span className="w-1 h-1 bg-[#B8860B]/40 rounded-full" />
          <Link
            href="/iletisim"
            className="text-white/40 hover:text-[#B8860B] transition-colors duration-300 uppercase tracking-[0.15em]"
          >
            Iletisim
          </Link>
          <span className="w-1 h-1 bg-[#B8860B]/40 rounded-full" />
          <Link
            href="/sss"
            className="text-white/40 hover:text-[#B8860B] transition-colors duration-300 uppercase tracking-[0.15em]"
          >
            SSS
          </Link>
        </motion.div>

        {/* Brand Mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.3 : 0 }}
          transition={{ duration: TIMING.slow, delay: 1.5 }}
          className="mt-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            Halikarnas
          </p>
        </motion.div>
      </div>
    </section>
  );
}
