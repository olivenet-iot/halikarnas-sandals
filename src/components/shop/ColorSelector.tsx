"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Color {
  hex: string;
  name: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (hex: string) => void;
  colorStockMap?: Record<string, number>; // hex -> total stock for that color
}

// Dark colors that need white check icon
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

export function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
  colorStockMap,
}: ColorSelectorProps) {
  const selectedColorName = colors.find((c) => c.hex === selectedColor)?.name;

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-leather-600">
          Renk:{" "}
          <span className="font-medium text-leather-900">
            {selectedColorName || "Seciniz"}
          </span>
        </span>
      </div>

      {/* Color Swatches */}
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
                  ? "ring-2 ring-offset-2 ring-aegean-600 border-aegean-600"
                  : "border-sand-300 hover:border-leather-400",
                !hasStock && "opacity-40 cursor-not-allowed"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {/* Check icon for selected */}
              {isSelected && (
                <Check
                  className={cn(
                    "absolute inset-0 m-auto h-5 w-5",
                    isDarkColor(color.hex) ? "text-white" : "text-leather-800"
                  )}
                />
              )}

              {/* Out of stock diagonal line */}
              {!hasStock && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                  <div className="w-[150%] h-0.5 bg-leather-400 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ColorSelector;
