"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.1]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <section className="relative h-screen -mt-16 md:-mt-20 flex items-center justify-center overflow-hidden">
      {/* Parallax Background with Scale */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766832194/image_3840_1_1_j3hb5t.webp"
          alt="El yapımı deri sandaletler"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay - üstte koyu (header için), ortada hafif, altta orta (text için) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40 z-10" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="container-luxury relative z-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Refined Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-4 text-luxury-gold text-xs md:text-sm font-medium tracking-[0.4em] uppercase">
              <span className="w-12 h-px bg-luxury-gold/60" />
              El Yapımı Deri Sandaletler
              <span className="w-12 h-px bg-luxury-gold/60" />
            </span>
          </motion.div>

          {/* Main Title - Elegant serif typography */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-[6rem] text-white mb-8 leading-[1.05] tracking-tight"
          >
            <span className="block">Antik Zarafetin</span>
            <span className="block mt-2 text-luxury-gold">Modern Yorumu</span>
          </motion.h1>

          {/* Description - Refined */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-base md:text-lg text-white/75 mb-14 max-w-xl mx-auto leading-relaxed font-light tracking-wide"
          >
            Bodrum&apos;un efsanevi mirası Halikarnas&apos;tan ilham alan,
            usta ellerde şekillenen hakiki deri sandaletler.
          </motion.p>

          {/* Buttons - Luxury minimal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            {/* Primary Button - Solid luxury */}
            <Link href="/kadin" className="group">
              <span
                className="
                  inline-flex items-center justify-center gap-3
                  px-10 py-5
                  bg-white text-luxury-primary
                  font-medium tracking-[0.15em] uppercase text-sm
                  transition-all duration-500
                  hover:bg-luxury-gold hover:text-luxury-primary
                "
              >
                <span>Alışverişe Başla</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            {/* Secondary Button - Outline luxury */}
            <Link
              href="/hakkimizda"
              className="
                inline-flex items-center justify-center
                px-10 py-5
                bg-transparent
                border border-white/40
                text-white font-medium tracking-[0.15em] uppercase text-sm
                hover:border-white hover:bg-white/10
                transition-all duration-500
              "
            >
              Hikayemiz
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-cream to-transparent z-15" />
    </section>
  );
}
