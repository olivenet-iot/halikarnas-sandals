"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { ProductGridV2 } from "./ProductGridV2";
import { FilterToolbarV2 } from "./FilterToolbarV2";
import { useFilterStore } from "@/stores/filter-store";
import { cn } from "@/lib/utils";
import { colorOptions } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface ListingProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string }[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  categorySlug?: string | null;
  createdAt?: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
}

interface CategoryPageV2Props {
  title: string;
  description?: string;
  products: ListingProduct[];
  categories: Category[];
  gender: "women" | "men" | "unisex";
}

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export function CategoryPageV2({
  title,
  description,
  products,
  categories,
  gender,
}: CategoryPageV2Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const {
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
    priceRange,
    sort,
    clearFilters,
    hasActiveFilters,
    toggleCategory,
    toggleSize,
    toggleColor,
  } = useFilterStore();

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter(
        (p) => p.categorySlug && selectedCategories.includes(p.categorySlug)
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => {
        if (!p.colors || p.colors.length === 0) return false;
        return p.colors.some((c) =>
          selectedColors.some((sc) => {
            const colorOption = colorOptions.find((co) => co.slug === sc);
            return (
              colorOption &&
              c.name.toLowerCase().includes(colorOption.name.toLowerCase())
            );
          })
        );
      });
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "tr"));
        break;
      case "popular":
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return 0;
        });
        break;
      default:
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    return result;
  }, [
    products,
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    sort,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Active filter tags for display
  const activeFilterTags = useMemo(() => {
    const tags: { type: string; value: string; label: string }[] = [];
    selectedCategories.forEach((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      if (cat) tags.push({ type: "category", value: slug, label: cat.name });
    });
    selectedSizes.forEach((size) => {
      tags.push({ type: "size", value: size, label: size });
    });
    selectedColors.forEach((slug) => {
      const color = colorOptions.find((c) => c.slug === slug);
      if (color)
        tags.push({ type: "color", value: slug, label: color.name });
    });
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      tags.push({
        type: "price",
        value: "price",
        label: `${priceRange[0]} – ${priceRange[1]} TL`,
      });
    }
    return tags;
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    categories,
    maxPrice,
  ]);

  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "category":
        toggleCategory(value);
        break;
      case "size":
        toggleSize(value);
        break;
      case "color":
        toggleColor(value);
        break;
      case "price":
        useFilterStore.getState().setPriceRange([0, 10000]);
        break;
    }
  };

  return (
    <div className="bg-v2-bg-primary min-h-screen">
      {/* Header */}
      <div className="pt-[100px] md:pt-[120px] pb-12 md:pb-16 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-[4rem] text-v2-text-primary">
          {title}
        </h1>
        {description && (
          <p className="font-inter text-v2-body text-v2-text-muted mt-3 max-w-[50ch]">
            {description}
          </p>
        )}

        {/* Subcategory pills */}
        {categories.length > 0 && (
          <div className="flex gap-8 md:gap-10 mt-8 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategories.includes(cat.slug);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    "shrink-0 pb-1 font-inter text-sm transition-colors duration-300",
                    isActive
                      ? "text-v2-text-primary border-b border-v2-accent"
                      : "text-v2-text-muted hover:text-v2-text-primary"
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Toolbar + Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-v2-section-mobile md:pb-v2-section">
        {/* Filter toolbar */}
        <div className="mb-8">
          <FilterToolbarV2
            gender={gender}
          />
        </div>

        {/* Active filter tags */}
        {hasActiveFilters() && (
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {activeFilterTags.map((tag) => (
              <span
                key={`${tag.type}-${tag.value}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-v2-border-subtle font-inter text-xs text-v2-text-muted"
              >
                {tag.label}
                <button
                  onClick={() => handleRemoveFilter(tag.type, tag.value)}
                  className="hover:text-v2-text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary link-underline-v2 transition-colors"
            >
              Temizle
            </button>
          </div>
        )}

        {/* Product grid */}
        <ProductGridV2 products={visibleProducts} />

        {/* Load more */}
        {hasMore && (
          <div className="mt-16 md:mt-24">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
              }
              className="font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2"
            >
              Daha Fazla Göster &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
