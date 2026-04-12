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
  const displayProducts = products.slice(0, 4);

  return (
    <section className="section-v2 container-v2">
      {/* Section heading + "See all" link */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
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

      {/* Equal 4-column product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {displayProducts.map((product) => {
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
            <Link
              key={product.id}
              href={url}
              className="group block w-full"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-v2-bg-primary aspect-[4/5]">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-[400ms] ease-out group-hover:opacity-90 ${hoverImage ? "group-hover:opacity-0" : ""}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={`${product.name} - 2`}
                    fill
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
              </div>

              {/* Info */}
              <div className="mt-5 lg:mt-6">
                <h3 className="font-inter font-normal text-[15px] lg:text-[17px] tracking-[0.005em] text-v2-text-primary">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-inter font-normal text-sm tracking-[0.01em] text-v2-text-muted">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <span className="font-inter text-xs tracking-[0.01em] text-v2-text-muted/70 line-through">
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
