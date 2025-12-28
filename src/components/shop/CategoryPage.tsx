"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar, FilterTrigger } from "./FilterSidebar";
import { SortSelect } from "./SortSelect";
import { useUIStore } from "@/stores/ui-store";
import { useFilterStore } from "@/stores/filter-store";
import { ProductCardProps } from "./ProductCard";
import { cn } from "@/lib/utils";
import { colorOptions } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface CategoryPageProps {
  title: string;
  description?: string;
  products: ProductCardProps[];
  categories: Category[];
  gender: "women" | "men" | "unisex";
  breadcrumbs?: { label: string; href: string }[];
}

export function CategoryPage({
  title,
  description,
  products,
  categories,
  gender,
  breadcrumbs,
}: CategoryPageProps) {
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const { openQuickView } = useUIStore();

  // Filter store
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

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(
        (p) => p.categorySlug && selectedCategories.includes(p.categorySlug)
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter - match by color name (case insensitive)
    if (selectedColors.length > 0) {
      result = result.filter((p) => {
        if (!p.colors || p.colors.length === 0) return false;
        return p.colors.some((c) =>
          selectedColors.some((sc) => {
            const colorOption = colorOptions.find((co) => co.slug === sc);
            return colorOption && c.name.toLowerCase().includes(colorOption.name.toLowerCase());
          })
        );
      });
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
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
        // Bestsellers first
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return 0;
        });
        break;
      default:
        // Default: newest first
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    return result;
  }, [products, selectedCategories, selectedSizes, selectedColors, priceRange, sort]);

  const defaultBreadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: title, href: "#" },
  ];

  const crumbs = breadcrumbs || defaultBreadcrumbs;

  // Get active filter labels for display
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
      if (color) tags.push({ type: "color", value: slug, label: color.name });
    });

    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      tags.push({
        type: "price",
        value: "price",
        label: `${priceRange[0]} - ${priceRange[1]} TL`,
      });
    }

    return tags;
  }, [selectedCategories, selectedSizes, selectedColors, priceRange, categories, maxPrice]);

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
    <div className="bg-luxury-cream min-h-screen">
      {/* Header */}
      <div className="bg-luxury-cream py-12 md:py-16">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-luxury-charcoal/60 mb-6">
            {crumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {index === crumbs.length - 1 ? (
                  <span className="text-luxury-primary font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-luxury-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-primary tracking-wide mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-luxury-charcoal/70 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            gender={gender}
            priceRange={[0, maxPrice]}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <FilterTrigger />
                <span className="text-sm text-luxury-charcoal/60">
                  {filteredProducts.length} ürün bulundu
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid Toggle */}
                <div className="hidden md:flex items-center border border-luxury-stone rounded-lg p-1">
                  <button
                    onClick={() => setGridColumns(3)}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      gridColumns === 3
                        ? "bg-luxury-primary/10 text-luxury-primary"
                        : "text-luxury-charcoal/50 hover:text-luxury-primary"
                    )}
                    title="3 sütun"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(4)}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      gridColumns === 4
                        ? "bg-luxury-primary/10 text-luxury-primary"
                        : "text-luxury-charcoal/50 hover:text-luxury-primary"
                    )}
                    title="4 sütun"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Select */}
                <SortSelect className="w-48" />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters() && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {activeFilterTags.map((tag) => (
                  <span
                    key={`${tag.type}-${tag.value}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-primary/10 text-luxury-primary text-sm rounded-full"
                  >
                    {tag.label}
                    <button
                      onClick={() => handleRemoveFilter(tag.type, tag.value)}
                      className="hover:bg-luxury-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-luxury-charcoal/60 hover:text-luxury-primary underline transition-colors"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              columns={gridColumns}
              onQuickView={openQuickView}
            />

            {/* Load More (Pagination placeholder) */}
            {filteredProducts.length >= 12 && (
              <div className="mt-12 text-center">
                <Button variant="outline" className="btn-secondary">
                  Daha Fazla Göster
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
