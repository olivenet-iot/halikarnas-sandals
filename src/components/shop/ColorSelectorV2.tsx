"use client";

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
        <span className="font-inter text-v2-label tracking-[0.2em] text-v2-text-primary">
          {selectedColorName || "Se\u00e7iniz"}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => {
          const isSelected = selectedColor === color.hex;
          const hasStock = colorStockMap
            ? (colorStockMap[color.hex] || 0) > 0
            : true;

          return (
            <div key={color.hex} className="flex flex-col items-center">
              <button
                onClick={() => hasStock && onColorChange(color.hex)}
                disabled={!hasStock}
                title={color.name}
                className={cn(
                  "relative w-8 h-8 rounded-none border transition-all",
                  isSelected
                    ? "border-transparent"
                    : "border-v2-border-subtle hover:border-v2-text-muted",
                  !hasStock && "opacity-40 cursor-not-allowed"
                )}
                style={{ backgroundColor: color.hex }}
              >
                {!hasStock && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="w-[150%] h-0.5 bg-v2-text-muted rotate-45" />
                  </div>
                )}
              </button>
              {isSelected && (
                <span className="block w-full h-px bg-v2-accent mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
