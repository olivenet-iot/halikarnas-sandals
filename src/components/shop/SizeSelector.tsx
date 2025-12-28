"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  sizeStockMap: Record<string, number>; // size -> stock count
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  sizeStockMap,
}: SizeSelectorProps) {
  // Get stock for selected size
  const selectedStock = selectedSize ? sizeStockMap[selectedSize] || 0 : 0;
  const isLowStock = selectedStock > 0 && selectedStock <= 3;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-leather-600">
          Beden:{" "}
          <span className="font-medium text-leather-900">
            {selectedSize || "Seciniz"}
          </span>
        </span>
        <Link
          href="/beden-rehberi"
          className="text-sm text-aegean-600 hover:text-aegean-700 hover:underline"
        >
          Beden Rehberi
        </Link>
      </div>

      {/* Size Buttons */}
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
                "relative min-w-[48px] h-12 px-3 rounded-lg border-2 font-medium transition-all",
                isSelected
                  ? "bg-aegean-600 text-white border-aegean-600"
                  : hasStock
                  ? "border-sand-200 text-leather-700 hover:border-aegean-500 bg-white"
                  : "border-sand-100 bg-sand-50 text-sand-400 cursor-not-allowed line-through"
              )}
            >
              {size}

              {/* Low stock indicator dot */}
              {isLow && !isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Low stock warning */}
      {isLowStock && (
        <p className="text-sm text-terracotta-600 font-medium">
          Son {selectedStock} urun!
        </p>
      )}
    </div>
  );
}

export default SizeSelector;
