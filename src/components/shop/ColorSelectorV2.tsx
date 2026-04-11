"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Color {
  hex: string;
  name: string;
}

interface ColorSelectorV2Props {
  colors: Color[];
  selectedColor: string;
  onColorChange: (hex: string) => void;
  colorStockMap?: Record<string, number>;
}

const DARK_COLORS = [
  "#000000",
  "#1a1a1a",
  "#000080",
  "#1a2744",
  "#800020",
  "#8B4513",
  "#4A3728",
];

function isDarkColor(hex: string): boolean {
  return DARK_COLORS.some(
    (dark) => dark.toLowerCase() === hex.toLowerCase()
  );
}

export function ColorSelectorV2({
  colors,
  selectedColor,
  onColorChange,
  colorStockMap,
}: ColorSelectorV2Props) {
  const selectedColorName = colors.find((c) => c.hex === selectedColor)?.name;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted">
          Renk:
        </span>
        <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-primary">
          {selectedColorName || "Se\u00e7iniz"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.hex;
          const hasStock = colorStockMap
            ? (colorStockMap[color.hex] || 0) > 0
            : true;

          return (
            <button
              key={color.hex}
              onClick={() => hasStock && onColorChange(color.hex)}
              disabled={!hasStock}
              title={color.name}
              className={cn(
                "relative w-10 h-10 rounded-full border-2 transition-all",
                isSelected
                  ? "ring-2 ring-offset-2 ring-v2-text-primary border-v2-text-primary"
                  : "border-v2-border-subtle hover:border-v2-text-muted",
                !hasStock && "opacity-40 cursor-not-allowed"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && (
                <Check
                  className={cn(
                    "absolute inset-0 m-auto h-5 w-5",
                    isDarkColor(color.hex) ? "text-white" : "text-v2-text-primary"
                  )}
                />
              )}

              {!hasStock && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                  <div className="w-[150%] h-0.5 bg-v2-text-muted rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
