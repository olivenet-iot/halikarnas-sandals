"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { formatPrice, getProductUrl } from "@/lib/utils";
import { getCollectionHeroUrl, getProductImageUrl } from "@/lib/cloudinary";
import { TIMING, EASE } from "@/lib/animations";
import { PLACEHOLDER_IMAGES } from "@/lib/constants";
import { useScrollStore } from "@/stores/scroll-store";
import {
  GoldDivider,
  TextFadeIn,
  MagneticButton,
  ArrowIcon,
  ChevronBounce,
  ProductGridLuxury,
} from "@/components/ui/luxury";

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  basePrice: number | { toNumber: () => number };
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  category: { slug: string } | null;
  images: { url: string; alt?: string | null }[];
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  bannerImage: string | null;
}

interface CollectionPageClientProps {
  collection: Collection & { products: Product[] };
  otherCollections: Collection[];
}

// Frame theme mapping: which frames have dark vs light backgrounds
// dark = dark background (use light text), light = light background (use dark text)
const FRAME_THEMES: ("dark" | "light")[] = [
  "dark",   // 0: Hero (stone-900)
  "light",  // 1: Story (#FAF9F6)
  "dark",   // 2: Editorial (stone-800)
  "light",  // 3: Featured Product (stone-100)
  "dark",   // 4: Craftsman (stone-900)
  "light",  // 5: Product Showroom (#FAF9F6)
  "dark",   // 6: Closing (stone-900)
];

export function CollectionPageClient({
  collection,
  otherCollections,
}: CollectionPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const setNavbarTheme = useScrollStore((state) => state.setNavbarTheme);

  const heroImage = collection.bannerImage || collection.image;
  const featuredProduct = collection.products[0];

  // Track scroll for progress
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Update active frame based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frameCount = 7;
      const frame = Math.min(Math.floor(latest * frameCount), frameCount - 1);
      setActiveFrame(frame);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Update navbar theme based on active frame
  useEffect(() => {
    const theme = FRAME_THEMES[activeFrame] || "dark";
    setNavbarTheme(theme);

    // Cleanup: reset to dark when leaving page
    return () => {
      setNavbarTheme("dark");
    };
  }, [activeFrame, setNavbarTheme]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-stone-900"
      style={{ height: '100dvh' }}
    >
      {/* Frame 1: HERO */}
      <HeroFrame
        collection={collection}
        heroImage={heroImage}
        productCount={collection.products.length}
        isActive={activeFrame === 0}
      />

      {/* Frame 2: STORY - Always render with fallback */}
      <StoryFrame
        description={collection.description || "Ozenle secilmis, el yapimi sandalet koleksiyonu. Bodrum'un usta zanaatkarlarindan, nesillerdir aktarilan tekniklerle uretiliyor."}
        isActive={activeFrame === 1}
      />

      {/* Frame 3: EDITORIAL IMAGE */}
      <EditorialImageFrame
        image={heroImage}
        collectionName={collection.name}
        isActive={activeFrame === 2}
      />

      {/* Frame 4: FEATURED PRODUCT */}
      {featuredProduct && (
        <FeaturedProductFrame
          product={featuredProduct}
          isActive={activeFrame === 3}
        />
      )}

      {/* Frame 5: CRAFTSMAN */}
      <CraftsmanFrame isActive={activeFrame === 4} />

      {/* Frame 6: PRODUCT SHOWROOM */}
      <ProductShowroomFrame products={collection.products} />

      {/* Frame 7: CLOSING */}
      <ClosingFrame
        collectionName={collection.name}
        otherCollections={otherCollections}
      />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#B8860B]/80 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}

// ============================================================
// FRAME 1: HERO
// ============================================================
function HeroFrame({
  collection,
  heroImage,
  productCount,
  isActive,
}: {
  collection: Collection;
  heroImage: string | null;
  productCount: number;
  isActive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="collection-frame snap-start snap-always flex items-center justify-center overflow-hidden bg-stone-900"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Background with Parallax */}
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
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            src={PLACEHOLDER_IMAGES.aegean_coast}
            alt={collection.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        )}
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ opacity: contentOpacity }}
      >
        {/* Gold Divider */}
        <div className="flex justify-center mb-8">
          <GoldDivider isInView={isActive} delay={0.3} />
        </div>

        {/* Collection Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: "0.5em" }}
          animate={
            isActive
              ? { opacity: 1, y: 0, letterSpacing: "0.2em" }
              : { opacity: 0, y: 40, letterSpacing: "0.5em" }
          }
          transition={{ duration: TIMING.cinematic, ease: EASE.luxury, delay: 0.5 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6"
          style={{
            textShadow: "0 0 80px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          {collection.name}
        </motion.h1>

        {/* Product Count */}
        <TextFadeIn isInView={isActive} delay={0.9}>
          <p className="text-white/60 text-sm uppercase tracking-[0.3em]">
            {productCount} Urun
          </p>
        </TextFadeIn>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: TIMING.medium, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">
          Kesfet
        </span>
        <ChevronBounce theme="light" />
      </motion.div>
    </section>
  );
}

// ============================================================
// FRAME 2: STORY
// ============================================================
function StoryFrame({
  description,
  isActive,
}: {
  description: string;
  isActive: boolean;
}) {
  return (
    <section
      className="collection-frame snap-start snap-always flex items-center justify-center overflow-hidden bg-[#FAF9F6]"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
        {/* Gold Divider */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={isActive ? { opacity: 1, width: "6rem" } : { opacity: 0, width: 0 }}
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.2 }}
          className="h-[1px] bg-[#B8860B] mx-auto mb-12"
        />

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.4 }}
          className="font-serif text-2xl md:text-3xl lg:text-4xl text-stone-700 leading-relaxed italic"
        >
          &ldquo;{description}&rdquo;
        </motion.blockquote>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: TIMING.medium, delay: 0.8 }}
          className="mt-10 text-stone-400 text-sm tracking-[0.2em] uppercase"
        >
          — Halikarnas Atolyesi
        </motion.p>

        {/* Bottom Divider */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={isActive ? { opacity: 1, width: "4rem" } : { opacity: 0, width: 0 }}
          transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 1 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent mx-auto mt-12"
        />
      </div>
    </section>
  );
}

// ============================================================
// FRAME 3: EDITORIAL IMAGE
// ============================================================
function EditorialImageFrame({
  image,
  collectionName,
  isActive,
}: {
  image: string | null;
  collectionName: string;
  isActive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Reduced parallax to prevent gaps (was ±15%, now ±3%)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.02]);

  // Use collection image or fallback to Unsplash
  const displayImage = image
    ? getCollectionHeroUrl(image)
    : PLACEHOLDER_IMAGES.mediterranean_beach;

  return (
    <section
      ref={containerRef}
      className="collection-frame snap-start snap-always flex items-end overflow-hidden bg-stone-900"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Full-bleed Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, scale }}
      >
        <Image
          src={displayImage}
          alt={collectionName}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
          priority
        />
      </motion.div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Gradient overlay for caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Bottom caption */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.3 }}
        className="relative z-10 w-full px-8 pb-16"
      >
        <p className="text-white/80 text-sm uppercase tracking-[0.3em] text-center">
          El Yapimi &bull; Bodrum
        </p>
      </motion.div>
    </section>
  );
}

// ============================================================
// FRAME 4: FEATURED PRODUCT
// ============================================================
function FeaturedProductFrame({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) {
  const price = typeof product.basePrice === "number"
    ? product.basePrice
    : product.basePrice.toNumber();

  const productUrl = getProductUrl({
    sku: product.sku || product.id,
    gender: product.gender,
    category: product.category,
  });

  const primaryImage = product.images[0];

  return (
    <section
      className="collection-frame snap-start snap-always flex items-center overflow-hidden bg-stone-100"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      <div className="w-full h-full flex flex-col lg:flex-row">
        {/* Left: Product Image */}
        <div className="h-1/2 lg:h-full lg:flex-1 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={
              isActive
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.1 }
            }
            transition={{ duration: TIMING.cinematic, ease: EASE.luxury }}
            className="absolute inset-0"
          >
            {primaryImage ? (
              <Image
                src={getProductImageUrl(primaryImage.url)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-stone-200" />
            )}
          </motion.div>
        </div>

        {/* Right: Product Info */}
        <div className="h-1/2 lg:h-full lg:flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="max-w-md text-center lg:text-left">
            {/* Label */}
            <TextFadeIn isInView={isActive} delay={0.3}>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-4">
                One Cikan Urun
              </p>
            </TextFadeIn>

            {/* Gold Divider */}
            <div className="flex justify-center lg:justify-start mb-6">
              <GoldDivider isInView={isActive} delay={0.4} />
            </div>

            {/* Product Name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                isActive
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.5 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 mb-4"
            >
              {product.name}
            </motion.h2>

            {/* Price */}
            <TextFadeIn isInView={isActive} delay={0.7}>
              <p className="text-xl text-stone-600 tracking-wider mb-8">
                {formatPrice(price)}
              </p>
            </TextFadeIn>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isActive
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.9 }}
            >
              <MagneticButton
                href={productUrl}
                variant="primary"
                icon={<ArrowIcon />}
              >
                Urunu Incele
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FRAME 5: CRAFTSMAN - Split-screen with image
// ============================================================
function CraftsmanFrame({ isActive }: { isActive: boolean }) {
  return (
    <section
      className="collection-frame snap-start snap-always bg-stone-900 overflow-hidden"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Left: Image (60%) */}
        <div className="h-1/2 lg:h-full lg:w-3/5 relative">
          <Image
            src={PLACEHOLDER_IMAGES.leather_craft}
            alt="Deri iscilik"
            fill
            className="object-cover"
            sizes="60vw"
            unoptimized
            priority
          />
          {/* Gradient overlay for text readability on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-900/50 hidden lg:block" />
          {/* Gradient for mobile bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/70 lg:hidden" />
        </div>

        {/* Right: Content (40%) */}
        <div className="h-1/2 lg:h-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="text-center lg:text-left max-w-md">
            {/* Gold Divider */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isActive ? { opacity: 1, width: "6rem" } : { opacity: 0, width: 0 }}
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.2 }}
              className="h-[1px] bg-[#B8860B] mb-8 mx-auto lg:mx-0"
            />

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.4 }}
              className="font-serif text-3xl lg:text-4xl text-white mb-6"
            >
              Usta Ellerden
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.6 }}
              className="text-stone-400 text-base lg:text-lg leading-relaxed mb-10"
            >
              Her sandalet, Bodrum&apos;un ustalarinin ellerinde sekilleniyor.
              Nesillerdir aktarilan tekniklerle, hakiki deriden el yapimi.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: TIMING.slow, ease: EASE.luxury, delay: 0.8 }}
              className="flex gap-8 lg:gap-12 justify-center lg:justify-start"
            >
              <div className="text-center">
                <span className="font-serif text-3xl lg:text-4xl text-[#B8860B]">40+</span>
                <p className="text-stone-500 text-xs tracking-[0.15em] mt-1 uppercase">
                  Yillik Deneyim
                </p>
              </div>
              <div className="text-center">
                <span className="font-serif text-3xl lg:text-4xl text-[#B8860B]">100%</span>
                <p className="text-stone-500 text-xs tracking-[0.15em] mt-1 uppercase">
                  El Yapimi
                </p>
              </div>
              <div className="text-center">
                <span className="font-serif text-3xl lg:text-4xl text-[#B8860B]">Bodrum</span>
                <p className="text-stone-500 text-xs tracking-[0.15em] mt-1 uppercase">
                  Uretim Yeri
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FRAME 6: PRODUCT SHOWROOM
// ============================================================
function ProductShowroomFrame({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) {
    return (
      <section
        className="collection-frame snap-start snap-always flex items-center justify-center bg-[#FAF9F6]"
        style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
      >
        <p className="text-stone-500 text-lg">
          Bu koleksiyonda henuz urun bulunmuyor.
        </p>
      </section>
    );
  }

  return (
    <section
      className="collection-frame snap-start snap-always relative bg-[#FAF9F6] overflow-hidden"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Scrollable content within fixed-height frame */}
      <div className="h-full overflow-y-auto pt-20">
        {/* Section Header */}
        <div className="bg-[#FAF9F6] py-6 border-b border-stone-200/50">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-[1px] bg-[#B8860B]" />
          </div>
          <h2 className="text-center font-serif text-2xl md:text-3xl text-stone-800">
            Koleksiyon Urunleri
          </h2>
          <p className="text-center text-stone-500 text-sm mt-2">
            {products.length} urun
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Grid */}
          <ProductGridLuxury
            products={products}
            layout="uniform"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FRAME 7: CLOSING - Simplified animations
// ============================================================
function ClosingFrame({
  collectionName,
  otherCollections,
}: {
  collectionName: string;
  otherCollections: Collection[];
}) {
  return (
    <section
      className="collection-frame snap-start snap-always relative flex items-center justify-center bg-stone-900 overflow-hidden"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold gradient accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.08)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA Section */}
        <div className="mb-16">
          {/* Gold Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-[1px] bg-[#B8860B]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            {collectionName} Koleksiyonu
          </h2>

          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Ozenle secilmis parcalarla tanisin.
            Her sandalet bir hikaye anlatir.
          </p>

          {/* Primary CTA */}
          <Link
            href="/kadin"
            className="inline-flex items-center gap-3 bg-[#B8860B] hover:bg-[#9A7209] text-white px-10 py-4 text-sm tracking-[0.2em] uppercase transition-colors duration-300"
          >
            Alisverise Basla
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-stone-700 mx-auto mb-16" />

        {/* Other Collections - Simple, no complex animations */}
        {otherCollections.length > 0 && (
          <div>
            <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-8">
              Diger Koleksiyonlar
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {otherCollections.slice(0, 3).map((coll) => (
                <Link
                  key={coll.id}
                  href={`/koleksiyonlar/${coll.slug}`}
                  className="group relative w-[280px] h-[160px] overflow-hidden rounded-sm"
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    {coll.image || coll.bannerImage ? (
                      <Image
                        src={getCollectionHeroUrl(coll.bannerImage || coll.image || "")}
                        alt={coll.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="280px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-800" />
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Name */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-serif text-lg tracking-wide group-hover:text-[#B8860B] transition-colors duration-300">
                      {coll.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to all collections */}
        <Link
          href="/koleksiyonlar"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-white mt-12 text-sm tracking-wide transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Tum Koleksiyonlar
        </Link>
      </div>
    </section>
  );
}

export default CollectionPageClient;
