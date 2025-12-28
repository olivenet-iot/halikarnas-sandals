"use client";

import { useState, useCallback } from "react";
import { Grid3X3, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Standard sizes for sandals
const SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

// Standard colors with codes for SKU generation
const COLORS = [
  { name: "Siyah", hex: "#000000", code: "S" },
  { name: "Kahverengi", hex: "#8B4513", code: "K" },
  { name: "Bej", hex: "#F5F5DC", code: "B" },
  { name: "Ten", hex: "#D2B48C", code: "T" },
  { name: "Taba", hex: "#A0522D", code: "TA" },
  { name: "Beyaz", hex: "#FFFFFF", code: "BY" },
  { name: "Bordo", hex: "#800020", code: "BO" },
  { name: "Lacivert", hex: "#000080", code: "L" },
];

// Size presets
const SIZE_PRESETS = {
  women: { label: "Kadin Standart (35-40)", sizes: ["35", "36", "37", "38", "39", "40"] },
  men: { label: "Erkek Standart (40-45)", sizes: ["40", "41", "42", "43", "44", "45"] },
  unisex: { label: "Unisex (36-43)", sizes: ["36", "37", "38", "39", "40", "41", "42", "43"] },
};

export interface Variant {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

interface VariantMatrixProps {
  baseSku: string;
  onGenerate: (variants: Variant[]) => void;
  className?: string;
}

export function VariantMatrix({
  baseSku,
  onGenerate,
  className,
}: VariantMatrixProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [defaultStock, setDefaultStock] = useState(10);
  const [matrixStock, setMatrixStock] = useState<Record<string, number>>({});

  // Toggle color selection
  const toggleColor = useCallback((colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  }, []);

  // Toggle size selection
  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }, []);

  // Apply size preset
  const applyPreset = useCallback((presetKey: keyof typeof SIZE_PRESETS) => {
    setSelectedSizes(SIZE_PRESETS[presetKey].sizes);
  }, []);

  // Update stock for specific cell
  const updateMatrixStock = useCallback(
    (colorName: string, size: string, stock: number) => {
      setMatrixStock((prev) => ({
        ...prev,
        [`${colorName}-${size}`]: stock,
      }));
    },
    []
  );

  // Generate variants
  const generateVariants = useCallback(() => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      return;
    }

    const variants: Variant[] = [];

    for (const colorName of selectedColors) {
      const color = COLORS.find((c) => c.name === colorName);
      if (!color) continue;

      for (const size of selectedSizes) {
        const key = `${colorName}-${size}`;
        const stock = matrixStock[key] ?? defaultStock;

        // Generate SKU: BASESKU-COLORCODE-SIZE (e.g., 2017-S-38)
        const sku = baseSku
          ? `${baseSku}-${color.code}-${size}`
          : `SKU-${color.code}-${size}`;

        variants.push({
          size,
          color: color.name,
          colorHex: color.hex,
          stock,
          sku,
        });
      }
    }

    onGenerate(variants);
  }, [selectedColors, selectedSizes, matrixStock, defaultStock, baseSku, onGenerate]);

  // Reset selections
  const resetSelections = useCallback(() => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setMatrixStock({});
  }, []);

  const totalVariants = selectedColors.length * selectedSizes.length;

  return (
    <div className={cn("space-y-6 p-4 border rounded-lg bg-gray-50", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Varyant Matrisi
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetSelections}
          className="text-gray-500"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Sifirla
        </Button>
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <Label>Renkler</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => toggleColor(color.name)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all border",
                selectedColors.includes(color.name)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:border-blue-400"
              )}
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <Label>Bedenler</Label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all border",
                selectedSizes.includes(size)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:border-blue-400"
              )}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Size Presets */}
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key as keyof typeof SIZE_PRESETS)}
              className="text-xs text-blue-600 hover:underline"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Default Stock */}
      <div className="space-y-2">
        <Label>Varsayilan Stok</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={defaultStock}
            onChange={(e) => setDefaultStock(parseInt(e.target.value) || 0)}
            className="w-24"
            min="0"
          />
          <span className="text-sm text-gray-500">
            Tum varyantlar bu stokla baslar
          </span>
        </div>
      </div>

      {/* Preview Matrix */}
      {selectedColors.length > 0 && selectedSizes.length > 0 && (
        <div className="space-y-2">
          <Label>
            Onizleme ({selectedColors.length} renk x {selectedSizes.length}{" "}
            beden = {totalVariants} varyant)
          </Label>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left font-medium">
                    Renk / Beden
                  </th>
                  {selectedSizes.map((size) => (
                    <th
                      key={size}
                      className="border px-3 py-2 text-center font-medium"
                    >
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedColors.map((colorName) => {
                  const color = COLORS.find((c) => c.name === colorName);
                  return (
                    <tr key={colorName} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color?.hex }}
                          />
                          <span className="font-medium">{colorName}</span>
                        </div>
                      </td>
                      {selectedSizes.map((size) => {
                        const key = `${colorName}-${size}`;
                        return (
                          <td key={size} className="border px-1 py-1">
                            <Input
                              type="number"
                              value={matrixStock[key] ?? defaultStock}
                              onChange={(e) =>
                                updateMatrixStock(
                                  colorName,
                                  size,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 px-1 text-center text-xs"
                              min="0"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        type="button"
        onClick={generateVariants}
        disabled={selectedColors.length === 0 || selectedSizes.length === 0}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        {totalVariants > 0
          ? `${totalVariants} Varyant Olustur`
          : "Renk ve Beden Secin"}
      </Button>

      {/* Info */}
      {!baseSku && (
        <p className="text-xs text-amber-600 text-center">
          Daha iyi SKU&apos;lar icin once Ana SKU girin
        </p>
      )}
    </div>
  );
}

export default VariantMatrix;
