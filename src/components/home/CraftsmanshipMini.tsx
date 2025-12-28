"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const craftDetails = [
  { number: "25+", label: "Yıllık Deneyim" },
  { number: "100%", label: "Hakiki Deri" },
  { number: "48", label: "Üretim Adımı" },
];

export function CraftsmanshipMini() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative bg-luxury-primary overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[80vh]">
        {/* Left - Image with parallax */}
        <motion.div
          style={{ y: imageY }}
          className="relative h-[50vh] md:h-auto"
        >
          <Image
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
            alt="El yapımı sandalet üretimi"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-luxury-primary/30" />
        </motion.div>

        {/* Right - Content */}
        <div className="flex items-center py-16 md:py-24 px-8 md:px-16 lg:px-24">
          <div className="max-w-lg">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-6"
            >
              <span className="w-8 h-px bg-luxury-gold/50" />
              Zanaatkarlık
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-8"
            >
              Her Sandalet
              <span className="block text-luxury-gold mt-2">Bir Sanat Eseri</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-base leading-relaxed mb-10"
            >
              Bodrum&apos;un kalbinde, İtalyan tabakhanelerinden özenle seçilmiş
              hakiki derilerle, usta ellerde şekillenen benzersiz tasarımlar.
              Her dikiş, nesiller boyu aktarılan bir geleneğin izlerini taşır.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-8 mb-12 pb-12 border-b border-white/10"
            >
              {craftDetails.map((detail) => (
                <div key={detail.label}>
                  <div className="text-luxury-gold font-serif text-3xl md:text-4xl mb-1">
                    {detail.number}
                  </div>
                  <div className="text-white/50 text-xs tracking-wider uppercase">
                    {detail.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-3 text-white text-sm tracking-[0.15em] uppercase font-medium hover:text-luxury-gold transition-colors duration-300"
              >
                Hikayemizi Keşfedin
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
