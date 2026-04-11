"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductUrl } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt?: string }[];
  categorySlug: string | null;
}

interface SecimProductGridClientProps {
  products: Product[];
}

export function SecimProductGridClient({ products }: SecimProductGridClientProps) {
  return (
    <section className="section-v2 container-v2">
      {/* Section heading */}
      <h2 className="font-serif font-light text-v2-section-sm md:text-v2-section text-v2-text-primary mb-10 md:mb-16">
        Atölyeden
      </h2>

      {/* 2-column grid, wide gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-10 lg:gap-12">
        {products.map((product) => {
          const url = getProductUrl({
            sku: product.sku,
            gender: product.gender,
            category: product.categorySlug
              ? { slug: product.categorySlug }
              : null,
          });
          const mainImage =
            product.images[0]?.url || "/images/product-placeholder.jpg";
          const hoverImage = product.images[1]?.url;

          return (
            <Link key={product.id} href={url} className="group block w-full">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-v2-bg-primary">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-[800ms] ease-out group-hover:scale-[1.02] ${hoverImage ? "group-hover:opacity-0" : ""}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={`${product.name} - 2`}
                    fill
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="font-inter text-v2-caps uppercase text-v2-text-muted">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-inter text-sm text-v2-text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <span className="font-inter text-xs text-v2-text-muted line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* "See all" underline link */}
      <div className="mt-16 md:mt-24">
        <Link
          href="/kadin"
          className="font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2"
        >
          Tümünü Gör &rarr;
        </Link>
      </div>
    </section>
  );
}
