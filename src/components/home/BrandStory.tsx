"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function BrandStory() {
  return (
    <section className="py-16 md:py-24 bg-sand-100 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000"
                alt="Usta elleriyle deri sandalet üretimi"
                fill
                className="object-cover"
              />
            </div>

            {/* Decorative Frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-aegean-400/30 rounded-2xl -z-10" />

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 bg-white p-6 rounded-xl shadow-strong"
            >
              <div className="text-center">
                <span className="block text-display-3 font-accent text-aegean-600">25+</span>
                <span className="text-body-sm text-leather-600">Yıllık Deneyim</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <span className="inline-block text-aegean-600 text-body-sm font-medium tracking-widest uppercase mb-4">
              Hikayemiz
            </span>

            <h2 className="font-accent text-heading-2 md:text-heading-1 text-leather-900 mb-6">
              El Yapımı
              <span className="block text-terracotta-500">Zanaatkarlık</span>
            </h2>

            <div className="space-y-4 text-body-lg text-leather-700 mb-8">
              <p>
                Antik dünyanın yedi harikasından birinin bulunduğu Bodrum&apos;un
                tarihi adı <strong className="text-leather-900">Halikarnas</strong>,
                markamıza ilham kaynağı oldu.
              </p>
              <p>
                Her bir sandaletimiz, ustalarımızın elinden çıkan, hakiki deriden
                üretilmiş birer sanat eseridir. Geleneksel el işçiliğini modern
                tasarımla buluşturuyoruz.
              </p>
              <p>
                Akdeniz&apos;in sıcak esintilerini ve Ege&apos;nin maviliğini her
                dikişimizde hissedebilirsiniz.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aegean-500" />
                <span className="text-leather-800">%100 Hakiki Deri</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aegean-500" />
                <span className="text-leather-800">El İşçiliği</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aegean-500" />
                <span className="text-leather-800">Türkiye Üretimi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aegean-500" />
                <span className="text-leather-800">Sürdürülebilir</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-leather-800 hover:bg-leather-900 text-white"
              asChild
            >
              <Link href="/hakkimizda">
                Hikayemizi Keşfedin
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
