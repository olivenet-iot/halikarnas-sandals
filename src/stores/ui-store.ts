"use client";

import { create } from "zustand";

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Filter sidebar (mobile)
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;

  // Size guide modal
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  // Quick view modal
  quickViewProductId: string | null;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;

  // Image lightbox
  lightboxImages: string[];
  lightboxIndex: number;
  openLightbox: (images: string[], index?: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;

  // Global loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Toast notifications (managed separately by shadcn toast)

  // Close all modals
  closeAll: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Filter sidebar
  isFilterOpen: false,
  openFilter: () => set({ isFilterOpen: true }),
  closeFilter: () => set({ isFilterOpen: false }),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  // Size guide modal
  isSizeGuideOpen: false,
  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),

  // Quick view modal
  quickViewProductId: null,
  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),

  // Image lightbox
  lightboxImages: [],
  lightboxIndex: 0,
  openLightbox: (images, index = 0) => set({ lightboxImages: images, lightboxIndex: index }),
  closeLightbox: () => set({ lightboxImages: [], lightboxIndex: 0 }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),

  // Global loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Close all modals
  closeAll: () => set({
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isFilterOpen: false,
    isSizeGuideOpen: false,
    quickViewProductId: null,
    lightboxImages: [],
    lightboxIndex: 0,
  }),
}));
