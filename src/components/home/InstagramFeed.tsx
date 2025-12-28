"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

// Placeholder images - in production these would come from Instagram API
const images = [
  "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
  "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&q=80",
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&q=80",
];

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-20 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-aegean-500 text-xs md:text-sm tracking-[0.2em] uppercase">
          @halikarnassandals
        </span>
        <h2 className="font-accent text-3xl md:text-4xl text-leather-900 mt-2">
          Instagram&apos;da Biz
        </h2>
      </motion.div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {images.map((img, index) => (
          <motion.a
            key={index}
            href="https://instagram.com/halikarnassandals"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 0.98 }}
            className="aspect-square relative overflow-hidden group cursor-pointer"
          >
            <Image
              src={img}
              alt={`Instagram ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 bg-aegean-900/70 opacity-0 group-hover:opacity-100
              transition-opacity duration-300 flex items-center justify-center"
            >
              <Instagram className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* Follow CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <a
          href="https://instagram.com/halikarnassandals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-aegean-600 hover:text-aegean-700
            font-medium transition-colors"
        >
          <Instagram className="w-5 h-5" />
          Takip Et
        </a>
      </motion.div>
    </section>
  );
}
