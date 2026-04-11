"use client";

import { ProductCardV2, type ProductCardV2Props } from "./ProductCardV2";
import { cn } from "@/lib/utils";

interface ProductGridV2Props {
  products: ProductCardV2Props[];
  className?: string;
}

export function ProductGridV2({
  products,
  className,
}: ProductGridV2Props) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-inter text-v2-text-muted text-sm">
          Ürün bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16",
        className
      )}
    >
      {products.map((product) => (
        <ProductCardV2 key={product.id} {...product} />
      ))}
    </div>
  );
}
