"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useFilterStore } from "@/stores/filter-store";
import { useUIStore } from "@/stores/ui-store";
import { colorOptions, sizeOptions } from "@/lib/constants";
import { formatPrice, cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface FilterSidebarProps {
  categories?: Category[];
  showCategories?: boolean;
  priceRange?: [number, number];
  gender?: "women" | "men" | "unisex";
}

export function FilterSidebar({
  categories = [],
  showCategories = true,
  priceRange = [0, 5000],
  gender = "unisex",
}: FilterSidebarProps) {
  const {
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
    priceRange: selectedPriceRange,
    toggleCategory,
    toggleSize,
    toggleColor,
    setPriceRange,
    clearFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const { isFilterOpen, closeFilter } = useUIStore();
  const activeFilterCount = getActiveFilterCount();
  const sizes = sizeOptions[gender] || sizeOptions.unisex;

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <span className="text-body-sm text-leather-600">
            {activeFilterCount} filtre aktif
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-aegean-600 hover:text-aegean-700"
          >
            Temizle
          </Button>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["categories", "sizes", "colors", "price"]}
        className="space-y-2"
      >
        {/* Categories */}
        {showCategories && categories.length > 0 && (
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-3 text-body-md font-semibold text-leather-800 hover:no-underline">
              Kategori
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <span className="text-body-sm text-leather-700 group-hover:text-leather-900 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    {category.count !== undefined && (
                      <span className="text-body-xs text-leather-400">
                        ({category.count})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Sizes */}
        <AccordionItem value="sizes" className="border-none">
          <AccordionTrigger className="py-3 text-body-md font-semibold text-leather-800 hover:no-underline">
            Beden
            {selectedSizes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedSizes.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "w-12 h-10 rounded-lg border text-body-sm font-medium transition-all",
                    selectedSizes.includes(size)
                      ? "border-aegean-600 bg-aegean-50 text-aegean-700"
                      : "border-sand-300 text-leather-600 hover:border-leather-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="colors" className="border-none">
          <AccordionTrigger className="py-3 text-body-md font-semibold text-leather-800 hover:no-underline">
            Renk
            {selectedColors.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedColors.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.slug}
                  onClick={() => toggleColor(color.slug)}
                  className="group flex flex-col items-center gap-1"
                  title={color.name}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      selectedColors.includes(color.slug)
                        ? "border-aegean-600 ring-2 ring-aegean-200"
                        : "border-sand-300 group-hover:border-leather-400"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-body-xs text-leather-600 truncate max-w-full">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-3 text-body-md font-semibold text-leather-800 hover:no-underline">
            Fiyat
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="px-1">
              <Slider
                value={selectedPriceRange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={50}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                className="mb-4"
              />
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-leather-600">
                  {formatPrice(selectedPriceRange[0])}
                </span>
                <span className="text-leather-600">
                  {formatPrice(selectedPriceRange[1])}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-lg border border-sand-200 p-5">
          <h2 className="text-heading-5 text-leather-800 mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtreler
          </h2>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={closeFilter}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 border-b border-sand-200">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-leather-800">
                <SlidersHorizontal className="h-5 w-5" />
                Filtreler
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={closeFilter}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>
          <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
            {filterContent}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-sand-200">
            <Button
              className="w-full btn-primary"
              onClick={closeFilter}
            >
              Sonuçları Göster
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Mobile Filter Trigger Button
export function FilterTrigger() {
  const { openFilter } = useUIStore();
  const { getActiveFilterCount } = useFilterStore();
  const count = getActiveFilterCount();

  return (
    <Button
      variant="outline"
      className="lg:hidden"
      onClick={openFilter}
    >
      <SlidersHorizontal className="h-4 w-4 mr-2" />
      Filtrele
      {count > 0 && (
        <Badge variant="secondary" className="ml-2">
          {count}
        </Badge>
      )}
    </Button>
  );
}
