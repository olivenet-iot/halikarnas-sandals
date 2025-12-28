"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
      {/* Section header */}
      <div className="container-luxury mb-16 md:mb-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
            <span className="w-8 h-px bg-luxury-gold/50" />
            Koleksiyonlar
            <span className="w-8 h-px bg-luxury-gold/50" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-primary">
            Sizin İçin Tasarlandı
          </h2>
        </div>
      </div>

      {/* Editorial Layout - Overlapping Grid */}
      <div className="container-luxury">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Kadın - Large left */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 relative"
          >
            <Link href="/kadin" className="group block relative">
              <span className="block relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897985/halikarnas/home/kadin-koleksiyonu_l0rkzo.webp"
                  alt="Kadın Koleksiyonu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-luxury-primary/60 via-transparent to-transparent" />
              </span>

              {/* Overlapping content card */}
              <span className="absolute -bottom-8 -right-4 md:-right-8 bg-white p-8 md:p-12 max-w-sm shadow-lg block">
                <span className="block text-luxury-gold text-xs tracking-[0.25em] uppercase font-medium">
                  Kadın Koleksiyonu
                </span>
                <span className="block font-serif text-3xl md:text-4xl text-luxury-primary mt-3 mb-4">
                  Zarafet
                </span>
                <span className="block text-luxury-charcoal/70 text-sm leading-relaxed mb-6">
                  Her adımda özgürlük hissettiren, zamansız şıklıkla buluşan tasarımlar.
                </span>
                <span className="inline-flex items-center gap-2 text-luxury-primary text-sm tracking-[0.1em] uppercase font-medium group-hover:text-luxury-gold transition-colors duration-300">
                  Keşfet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </span>
            </Link>
          </motion.div>

          {/* Erkek - Smaller right, offset down */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 md:mt-32"
          >
            <Link href="/erkek" className="group block relative">
              <span className="block relative aspect-[4/5] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897986/halikarnas/home/erkek-koleksiyonu_wgvz9u.webp"
                  alt="Erkek Koleksiyonu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-luxury-primary/60 via-transparent to-transparent" />
              </span>

              {/* Overlapping content card */}
              <span className="absolute -bottom-8 -left-4 md:-left-8 bg-luxury-primary p-8 md:p-10 max-w-xs block">
                <span className="block text-luxury-gold text-xs tracking-[0.25em] uppercase font-medium">
                  Erkek Koleksiyonu
                </span>
                <span className="block font-serif text-2xl md:text-3xl text-white mt-3 mb-4">
                  Karakter
                </span>
                <span className="block text-white/70 text-sm leading-relaxed mb-6">
                  Maskülen çizgiler, doğal malzemeler.
                </span>
                <span className="inline-flex items-center gap-2 text-luxury-gold text-sm tracking-[0.1em] uppercase font-medium group-hover:text-white transition-colors duration-300">
                  Keşfet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
