"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  categorySlug: string | null;
  color: string;
  colorName: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: AppliedCoupon | null;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemByVariantId: (variantId: string) => CartItem | undefined;
}

// Constants
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 49.9;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = Math.min(
            existingItem.quantity + (item.quantity || 1),
            existingItem.maxQuantity
          );
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          });
        }

        // Open cart drawer after adding
        set({ isOpen: true });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const totalAfterDiscount = subtotal - discount;

        // Free shipping for orders above threshold
        if (totalAfterDiscount >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }

        // No shipping cost if cart is empty
        if (get().items.length === 0) {
          return 0;
        }

        return SHIPPING_COST;
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;

        const subtotal = get().getSubtotal();
        let discount = 0;

        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
          // Apply max discount if set
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          // Fixed amount discount
          discount = coupon.discountValue;
        }

        // Don't discount more than subtotal
        return Math.min(discount, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().getDiscount();
        return subtotal + shipping - discount;
      },

      getItemByVariantId: (variantId) => {
        return get().items.find((item) => item.variantId === variantId);
      },
    }),
    {
      name: "halikarnas-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);

// Export constants for use in other components
export { FREE_SHIPPING_THRESHOLD, SHIPPING_COST };
