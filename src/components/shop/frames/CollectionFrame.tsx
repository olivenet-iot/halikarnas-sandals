"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getCollectionHeroUrl } from "@/lib/cloudinary";
import { TIMING, EASE } from "@/lib/animations";
import {
  GoldDivider,
  TextFadeIn,
  MagneticButton,
  ArrowIcon,
  ChevronBounce,
} from "@/components/ui/luxury";

interface CollectionFrameProps {
  collection: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    bannerImage?: string | null;
  };
  isActive: boolean;
  index: number;
}

export function CollectionFrame({
  collection,
  isActive,
  index,
}: CollectionFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImage = collection.bannerImage || collection.image;

  // Parallax for background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Reduced parallax to prevent gaps (was ±10%, now ±2%)
  // Minimum scale ensures image always covers frame edges
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.02]);

  // Extract tagline from description
  const tagline = collection.description
    ? collection.description.split(".")[0].slice(0, 120) +
      (collection.description.length > 120 ? "..." : "")
    : null;

  return (
    <section
      ref={containerRef}
      className="collection-frame snap-start snap-always flex items-center justify-center overflow-hidden bg-stone-900"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        {heroImage ? (
          <Image
            src={getCollectionHeroUrl(heroImage)}
            alt={collection.name}
            fill
            className="object-cover"
            priority={index <= 2}
            sizes="100vw"
          />
        ) : (
          /* Premium fallback */
          <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        {/* Top subtle gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ duration: TIMING.slow }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Gold Divider */}
        <div className="flex justify-center mb-8">
          <GoldDivider isInView={isActive} delay={0.2} />
        </div>

        {/* Collection Name */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.4 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-wide mb-6"
          style={{
            textShadow: "0 0 60px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          {collection.name}
        </motion.h2>

        {/* Tagline */}
        {tagline && (
          <TextFadeIn
            isInView={isActive}
            delay={0.6}
            className="mb-10"
          >
            <p
              className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto font-light italic"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              &ldquo;{tagline}&rdquo;
            </p>
          </TextFadeIn>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.8 }}
        >
          <MagneticButton
            href={`/koleksiyonlar/${collection.slug}`}
            variant="outline"
            size="lg"
            icon={<ArrowIcon />}
          >
            Koleksiyonu Kesfet
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        transition={{ duration: TIMING.medium, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronBounce theme="light" />
      </motion.div>
    </section>
  );
}
