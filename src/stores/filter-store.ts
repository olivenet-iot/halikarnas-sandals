"use client";

import { create } from "zustand";

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "popular";

interface FilterState {
  // Filter values
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sort: SortOption;
  search: string;

  // Actions
  setCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  setSizes: (sizes: string[]) => void;
  toggleSize: (size: string) => void;
  setColors: (colors: string[]) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSort: (sort: SortOption) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;

  // Computed
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const initialState = {
  categories: [] as string[],
  sizes: [] as string[],
  colors: [] as string[],
  priceRange: [0, 10000] as [number, number],
  sort: "newest" as SortOption,
  search: "",
};

export const useFilterStore = create<FilterState>()((set, get) => ({
  ...initialState,

  setCategories: (categories) => {
    set({ categories });
  },

  toggleCategory: (category) => {
    const { categories } = get();
    if (categories.includes(category)) {
      set({ categories: categories.filter((c) => c !== category) });
    } else {
      set({ categories: [...categories, category] });
    }
  },

  setSizes: (sizes) => {
    set({ sizes });
  },

  toggleSize: (size) => {
    const { sizes } = get();
    if (sizes.includes(size)) {
      set({ sizes: sizes.filter((s) => s !== size) });
    } else {
      set({ sizes: [...sizes, size] });
    }
  },

  setColors: (colors) => {
    set({ colors });
  },

  toggleColor: (color) => {
    const { colors } = get();
    if (colors.includes(color)) {
      set({ colors: colors.filter((c) => c !== color) });
    } else {
      set({ colors: [...colors, color] });
    }
  },

  setPriceRange: (range) => {
    set({ priceRange: range });
  },

  setSort: (sort) => {
    set({ sort });
  },

  setSearch: (search) => {
    set({ search });
  },

  clearFilters: () => {
    set(initialState);
  },

  hasActiveFilters: () => {
    const { categories, sizes, colors, priceRange, search } = get();
    return (
      categories.length > 0 ||
      sizes.length > 0 ||
      colors.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 10000 ||
      search !== ""
    );
  },

  getActiveFilterCount: () => {
    const { categories, sizes, colors, priceRange, search } = get();
    let count = 0;
    count += categories.length;
    count += sizes.length;
    count += colors.length;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count += 1;
    if (search !== "") count += 1;
    return count;
  },
}));
