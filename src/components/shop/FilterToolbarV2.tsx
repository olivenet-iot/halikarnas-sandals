"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";
import { colorOptions, sizeOptions, sortOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterToolbarV2Props {
  gender: "women" | "men" | "unisex";
  totalCount: number;
}

const VISIBLE_COLORS = 6;

export function FilterToolbarV2({ gender, totalCount }: FilterToolbarV2Props) {
  const {
    colors: selectedColors,
    sizes: selectedSizes,
    sort,
    toggleColor,
    toggleSize,
    setSort,
  } = useFilterStore();

  const [showAllColors, setShowAllColors] = useState(false);
  const sizes = sizeOptions[gender] || sizeOptions.women;
  const visibleColors = showAllColors
    ? colorOptions
    : colorOptions.slice(0, VISIBLE_COLORS);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left — inline color swatches */}
      <div className="flex items-center gap-2 flex-wrap">
        {visibleColors.map((color) => {
          const isActive = selectedColors.includes(color.slug);
          return (
            <button
              key={color.slug}
              onClick={() => toggleColor(color.slug)}
              className={cn(
                "w-5 h-5 rounded-full border transition-all duration-300",
                isActive
                  ? "ring-1 ring-offset-2 ring-v2-text-primary border-v2-text-primary"
                  : "border-v2-border-subtle hover:border-v2-text-muted"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`${color.name}${isActive ? " (seçili)" : ""}`}
            />
          );
        })}
        {!showAllColors && colorOptions.length > VISIBLE_COLORS && (
          <button
            onClick={() => setShowAllColors(true)}
            className="font-inter text-[10px] tracking-wider text-v2-text-muted hover:text-v2-text-primary transition-colors"
          >
            +{colorOptions.length - VISIBLE_COLORS}
          </button>
        )}
      </div>

      {/* Right — dropdowns + count */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Size dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 font-inter text-xs tracking-[0.1em] uppercase text-v2-text-primary hover:text-v2-text-muted transition-colors">
              Beden
              {selectedSizes.length > 0 && (
                <span className="text-v2-accent">({selectedSizes.length})</span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-auto p-4 bg-v2-bg-primary border border-v2-border-subtle rounded-none shadow-none"
          >
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "min-w-[40px] h-9 px-2 font-inter text-xs border transition-colors duration-200",
                      isActive
                        ? "bg-v2-text-primary text-v2-bg-primary border-v2-text-primary"
                        : "border-v2-border-subtle text-v2-text-muted hover:border-v2-text-muted"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 font-inter text-xs tracking-[0.1em] uppercase text-v2-text-primary hover:text-v2-text-muted transition-colors">
              Sıralama
              <ChevronDown className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 p-2 bg-v2-bg-primary border border-v2-border-subtle rounded-none shadow-none"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSort(option.value as Parameters<typeof setSort>[0])}
                className={cn(
                  "w-full text-left px-3 py-2 font-inter text-xs transition-colors",
                  sort === option.value
                    ? "text-v2-text-primary font-medium"
                    : "text-v2-text-muted hover:text-v2-text-primary"
                )}
              >
                {option.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Count */}
        <span className="font-inter text-xs text-v2-text-muted hidden md:inline">
          {totalCount} ürün
        </span>
      </div>
    </div>
  );
}
