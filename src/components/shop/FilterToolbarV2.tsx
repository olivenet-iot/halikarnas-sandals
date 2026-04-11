"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";
import { sizeOptions, sortOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterToolbarV2Props {
  gender: "women" | "men" | "unisex";
}

export function FilterToolbarV2({ gender }: FilterToolbarV2Props) {
  const {
    sizes: selectedSizes,
    sort,
    toggleSize,
    setSort,
  } = useFilterStore();

  const sizes = sizeOptions[gender] || sizeOptions.women;

  return (
    <div className="flex items-center justify-end gap-4 md:gap-6">
      {/* Size dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 font-inter text-xs tracking-[0.1em] text-v2-text-primary hover:text-v2-text-muted transition-colors">
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
          <button className="flex items-center gap-1.5 font-inter text-xs tracking-[0.1em] text-v2-text-primary hover:text-v2-text-muted transition-colors">
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
    </div>
  );
}
