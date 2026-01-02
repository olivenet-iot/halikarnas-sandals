"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Kadın",
    subtitle: "Zarafet ve Konfor",
    description: "Her adımda özgürlük hissettiren, zamansız şıklıkla buluşan tasarımlar.",
    href: "/kadin",
    image: "https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897985/halikarnas/home/kadin-koleksiyonu_l0rkzo.webp",
    variant: "light" as const,
  },
  {
    title: "Erkek",
    subtitle: "Güç ve Sadelik",
    description: "Maskülen çizgiler, doğal malzemeler, zamansız tasarımlar.",
    href: "/erkek",
    image: "https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897986/halikarnas/home/erkek-koleksiyonu_wgvz9u.webp",
    variant: "dark" as const,
  },
];

export function CategoryCards() {
  return (
    <section className="py-24 md:py-32 bg-luxury-cream">
      <div className="container-luxury">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <Link href={category.href} className="group block relative">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={`${category.title} Koleksiyonu`}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    {/* Category Label */}
                    <span className="text-luxury-gold text-xs tracking-[0.25em] uppercase font-medium mb-2">
                      {category.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-4xl md:text-5xl text-white mb-3">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
                      {category.description}
                    </p>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-white text-sm tracking-[0.15em] uppercase font-medium group-hover:text-luxury-gold transition-colors duration-300">
                      Keşfet
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
