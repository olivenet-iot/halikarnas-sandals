"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice, getProductUrl } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/cloudinary";
import { TIMING, masonryItem, imageHoverZoom, quickViewOverlay } from "@/lib/animations";

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

interface ProductCardLuxuryProps {
  product: Product;
  /** Card size for masonry grid */
  size?: "small" | "medium" | "large";
  /** Show quick view overlay on hover */
  showQuickView?: boolean;
  /** Animation delay for staggered reveal */
  delay?: number;
  /** Additional class names */
  className?: string;
}

export function ProductCardLuxury({
  product,
  size = "medium",
  showQuickView = true,
  delay = 0,
  className,
}: ProductCardLuxuryProps) {
  const price = typeof product.basePrice === "number"
    ? product.basePrice
    : product.basePrice.toNumber();

  const productUrl = getProductUrl({
    sku: product.sku || product.id,
    gender: product.gender,
    category: product.category,
  });

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  const aspectRatios = {
    small: "aspect-square",
    medium: "aspect-[3/4]",
    large: "aspect-[2/3]",
  };

  return (
    <motion.div
      variants={masonryItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      className={cn("group", className)}
    >
      <Link href={productUrl} className="block">
        {/* Image container */}
        <motion.div
          className={cn(
            "relative overflow-hidden bg-stone-100 mb-4",
            aspectRatios[size]
          )}
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {/* Primary image */}
          {primaryImage && (
            <motion.div
              variants={imageHoverZoom}
              className="absolute inset-0"
            >
              <Image
                src={getProductImageUrl(primaryImage.url)}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover"
                sizes={size === "large" ? "600px" : size === "medium" ? "400px" : "300px"}
              />
            </motion.div>
          )}

          {/* Secondary image on hover */}
          {secondaryImage && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: TIMING.fast }}
              className="absolute inset-0"
            >
              <Image
                src={getProductImageUrl(secondaryImage.url)}
                alt={product.name}
                fill
                className="object-cover"
                sizes={size === "large" ? "600px" : size === "medium" ? "400px" : "300px"}
              />
            </motion.div>
          )}

          {/* Quick view overlay */}
          {showQuickView && (
            <motion.div
              variants={quickViewOverlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <span className="px-4 py-2 bg-white/90 text-stone-900 text-xs uppercase tracking-[0.15em] font-medium">
                Hizli Bakis
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Product info */}
        <div className="text-center space-y-1">
          <h3 className="font-serif text-base md:text-lg text-stone-800 group-hover:text-[#B8860B] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-stone-500 text-sm tracking-wider">
            {formatPrice(price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

interface ProductGridLuxuryProps {
  products: Product[];
  /** Grid layout style */
  layout?: "masonry" | "uniform" | "featured";
  /** Additional class names */
  className?: string;
}

/**
 * Luxury product grid with masonry-style layout
 */
export function ProductGridLuxury({
  products,
  layout = "uniform",
  className,
}: ProductGridLuxuryProps) {
  if (layout === "masonry") {
    return (
      <div className={cn("columns-1 sm:columns-2 lg:columns-3 gap-8", className)}>
        {products.map((product, index) => {
          // Vary sizes for visual interest
          const size = index % 5 === 0 ? "large" : index % 3 === 0 ? "small" : "medium";
          return (
            <div key={product.id} className="break-inside-avoid mb-8">
              <ProductCardLuxury
                product={product}
                size={size}
                delay={index * 0.05}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === "featured") {
    // First product large, rest in grid
    const [featured, ...rest] = products;

    return (
      <div className={cn("space-y-12", className)}>
        {featured && (
          <div className="max-w-2xl mx-auto">
            <ProductCardLuxury product={featured} size="large" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {rest.map((product, index) => (
            <ProductCardLuxury
              key={product.id}
              product={product}
              size="medium"
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    );
  }

  // Uniform grid
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12",
      className
    )}>
      {products.map((product, index) => (
        <ProductCardLuxury
          key={product.id}
          product={product}
          size="medium"
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}

export default ProductCardLuxury;
