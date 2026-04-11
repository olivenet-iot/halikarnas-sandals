"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SizeSelectorV2Props {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  sizeStockMap: Record<string, number>;
}

export function SizeSelectorV2({
  sizes,
  selectedSize,
  onSizeChange,
  sizeStockMap,
}: SizeSelectorV2Props) {
  const selectedStock = selectedSize ? sizeStockMap[selectedSize] || 0 : 0;
  const isLowStock = selectedStock > 0 && selectedStock <= 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted">
            Beden:
          </span>
          <span className="font-inter text-v2-label tracking-[0.2em] text-v2-text-primary">
            {selectedSize || "Se\u00e7iniz"}
          </span>
        </div>
        <Link
          href="/beden-rehberi"
          className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted link-underline-v2"
        >
          Beden Rehberi
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const stock = sizeStockMap[size] || 0;
          const isSelected = selectedSize === size;
          const hasStock = stock > 0;
          const isLow = stock > 0 && stock <= 3;

          return (
            <button
              key={size}
              onClick={() => hasStock && onSizeChange(size)}
              disabled={!hasStock}
              className={cn(
                "relative min-w-[48px] h-12 px-3 border font-inter text-sm transition-all rounded-none",
                isSelected
                  ? "bg-transparent text-v2-text-primary border-2 border-v2-text-primary"
                  : hasStock
                  ? "border-v2-border-subtle text-v2-text-primary bg-transparent hover:border-v2-text-primary"
                  : "border-v2-border-subtle/50 text-v2-text-muted/40 cursor-not-allowed line-through"
              )}
            >
              {size}

              {isLow && !isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-v2-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {isLowStock && (
        <p className="font-inter text-sm text-v2-accent">
          {"Son "}{selectedStock}{" \u00fcr\u00fcn!"}
        </p>
      )}
    </div>
  );
}
