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
  const displayProducts = products.slice(0, 3);

  return (
    <section className="section-v2 container-v2">
      {/* Section heading + "See all" link */}
      <div className="flex items-end justify-between mb-16 lg:mb-20">
        <h2 className="font-serif font-light text-v2-section-sm md:text-v2-section text-v2-text-primary">
          Atölyeden
        </h2>
        <Link
          href="/kadin"
          className="font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2"
        >
          Tümünü Gör &rarr;
        </Link>
      </div>

      {/* Asymmetric 3-product grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-8 lg:gap-12 max-w-[1200px] mx-auto">
        {displayProducts.map((product, index) => {
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

          const isHero = index === 0;

          return (
            <Link
              key={product.id}
              href={url}
              className={`group block w-full ${
                isHero
                  ? "md:col-span-7 md:row-span-2"
                  : "md:col-span-5"
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden bg-v2-bg-primary ${
                  isHero ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-[400ms] ease-out group-hover:opacity-90 ${hoverImage ? "group-hover:opacity-0" : ""}`}
                  sizes={isHero ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"}
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={`${product.name} - 2`}
                    fill
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out"
                    sizes={isHero ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 50vw"}
                  />
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="font-serif font-normal text-sm tracking-[-0.01em] text-v2-text-muted">
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
    </section>
  );
}
