"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Leaf,
  Hand,
  Flag,
  Recycle,
  ArrowRight,
  Quote,
} from "lucide-react";

// Data structures
const milestones = [
  {
    year: "1999",
    title: "Kuruluş",
    description: "Bodrum'da küçük bir atölyede başladı",
  },
  {
    year: "2005",
    title: "İlk İhracat",
    description: "Avrupa pazarına açılım",
  },
  {
    year: "2010",
    title: "Büyüme",
    description: "Atölye kapasitesi 3 katına çıktı",
  },
  {
    year: "2018",
    title: "Dijital Dönem",
    description: "Online mağaza açıldı",
  },
  {
    year: "2024",
    title: "25. Yıl",
    description: "Çeyrek asırlık miras",
  },
];

const values = [
  {
    icon: Hand,
    title: "El Yapımı",
    description: "Her sandalet ustalarımızın ellerinde hayat buluyor",
  },
  {
    icon: Leaf,
    title: "Doğal Malzeme",
    description: "Sadece hakiki deri ve doğal malzemeler",
  },
  {
    icon: Recycle,
    title: "Sürdürülebilir",
    description: "Çevreye duyarlı üretim süreçleri",
  },
  {
    icon: Flag,
    title: "Türk Zanaatı",
    description: "Bodrum'daki atölyemizde yerel üretim",
  },
];

const stats = [
  { value: "25+", label: "Yıllık Tecrübe" },
  { value: "50K+", label: "Mutlu Müşteri" },
  { value: "100+", label: "Ürün Modeli" },
  { value: "12", label: "Usta Zanaatkar" },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070",
    alt: "Atölye görünümü",
    span: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070",
    alt: "Bodrum manzarası",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1601581875039-e899893d520c?q=80&w=2025",
    alt: "Deri işçiliği detayı",
    span: "",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="bg-luxury-cream">
      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroRef}
        className="relative h-screen -mt-16 md:-mt-20 flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070"
            alt="Halikarnas Atölyesi"
            fill
            className="object-cover scale-110"
            priority
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-0" />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-px bg-luxury-gold/60" />
            <span className="text-luxury-gold text-xs md:text-sm tracking-[0.4em] uppercase font-medium">
              Est. 1999 &bull; Bodrum
            </span>
            <span className="w-12 h-px bg-luxury-gold/60" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Antik Halikarnas&apos;tan
            <span className="block text-luxury-gold mt-2">Modern Zarafete</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            25 yıllık tutku, zanaat ve Ege ruhu
          </motion.p>
        </motion.div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-cream to-transparent z-10" />
      </section>

      {/* ==================== BRAND ESSENCE SECTION ==================== */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Luxury Header */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-luxury-gold/50" />
              <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium">
                Hikayemiz
              </span>
              <span className="w-8 h-px bg-luxury-gold/50" />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-luxury-primary mb-8">
              Bodrum&apos;un Kalbinde Doğan Bir Tutku
            </h2>

            <div className="space-y-6 text-luxury-charcoal/80 text-base md:text-lg leading-relaxed">
              <p>
                1999 yılında Bodrum&apos;un dar sokaklarında küçük bir atölyede
                başlayan yolculuğumuz, bugün Türkiye&apos;nin dört bir yanına ve
                dünyaya uzanan bir zanaat hikayesine dönüştü.
              </p>
              <p>
                Kurucumuz Ahmet Usta, Ege&apos;nin sıcak güneşinde, deniz kokulu
                rüzgarlarında yetişen bir zanaatkarın çocuğuydu. Dedesinden
                öğrendiği deri işleme sanatını modern tasarımlarla birleştirerek
                Halikarnas Sandals&apos;ı yarattı.
              </p>
            </div>

            {/* Founder Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 pt-12 border-t border-luxury-stone"
            >
              <Quote className="w-10 h-10 text-luxury-gold/30 mx-auto mb-6" />
              <blockquote className="font-serif text-xl md:text-2xl text-luxury-primary italic mb-4">
                &ldquo;Her sandalet, Ege&apos;nin özgür ruhunu ve binlerce yıllık
                Anadolu zanaatını ayaklarınıza taşır.&rdquo;
              </blockquote>
              <cite className="text-luxury-charcoal/60 text-sm not-italic">
                — Ahmet Usta, Kurucu
              </cite>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== TIMELINE SECTION ==================== */}
      <section className="py-24 md:py-32 bg-luxury-stone/20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-luxury-gold/50" />
              <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium">
                Yolculuğumuz
              </span>
              <span className="w-8 h-px bg-luxury-gold/50" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-primary">
              25 Yıllık Miras
            </h2>
          </motion.div>

          {/* Timeline - Desktop Horizontal */}
          <div className="hidden md:block relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 right-0 h-px bg-luxury-gold/30" />

            <div className="grid grid-cols-5 gap-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full bg-luxury-gold mx-auto mb-6 relative z-10 ring-4 ring-luxury-cream" />

                  {/* Year */}
                  <div className="font-serif text-2xl text-luxury-gold mb-2">
                    {milestone.year}
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-luxury-primary mb-1">
                    {milestone.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-luxury-charcoal/60">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline - Mobile Vertical */}
          <div className="md:hidden relative pl-8">
            {/* Connecting Line */}
            <div className="absolute top-0 bottom-0 left-[7px] w-px bg-luxury-gold/30" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute -left-8 top-0 w-4 h-4 rounded-full bg-luxury-gold ring-4 ring-luxury-stone/20" />

                  {/* Year */}
                  <div className="font-serif text-xl text-luxury-gold mb-1">
                    {milestone.year}
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-luxury-primary mb-1">
                    {milestone.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-luxury-charcoal/60">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VALUES SECTION ==================== */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-luxury-gold/50" />
              <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium">
                İlkelerimiz
              </span>
              <span className="w-8 h-px bg-luxury-gold/50" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-primary">
              Değerlerimiz
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-luxury-primary/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-luxury-primary/20 group-hover:scale-105">
                  <value.icon className="w-7 h-7 md:w-8 md:h-8 text-luxury-primary" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg md:text-xl text-luxury-primary mb-2">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-luxury-charcoal/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GALLERY SECTION ==================== */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-luxury-gold/50" />
              <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium">
                Bodrum
              </span>
              <span className="w-8 h-px bg-luxury-gold/50" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-primary mb-4">
              Atölyemiz
            </h2>
            <p className="text-luxury-charcoal/70 max-w-xl mx-auto">
              Bodrum&apos;un kalbinde, geleneksel yöntemlerle modern tasarımları
              buluşturduğumuz atölyemizden kareler
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Large Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-2 row-span-2 relative aspect-square md:aspect-auto overflow-hidden group"
            >
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

            {/* Small Images */}
            {galleryImages.slice(1).map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR SECTION ==================== */}
      <section className="py-16 md:py-20 bg-luxury-primary">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs md:text-sm tracking-widest uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-luxury-gold/50" />
              <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium">
                Davet
              </span>
              <span className="w-8 h-px bg-luxury-gold/50" />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-luxury-primary mb-6">
              Hikayemizin Bir Parçası Olun
            </h2>

            <p className="text-luxury-charcoal/70 text-base md:text-lg mb-10 leading-relaxed">
              Koleksiyonlarımızı keşfedin ve el yapımı sandaletlerimizin
              konforunu yaşayın. Her adımda Bodrum&apos;un eşsiz ruhunu
              hissedin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/koleksiyonlar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-luxury-primary text-white font-medium tracking-wide hover:bg-luxury-primary-light transition-colors duration-300"
              >
                Koleksiyonları Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-luxury-primary/30 text-luxury-primary font-medium tracking-wide hover:bg-luxury-primary/5 transition-colors duration-300"
              >
                Bize Ulaşın
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
