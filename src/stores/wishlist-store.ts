import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;

  // Actions
  addItem: (productId: string) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  syncWithServer: () => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId: string) => {
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error);
          }

          set((state) => ({
            items: [
              ...state.items,
              { productId, addedAt: new Date() },
            ],
          }));

          return true;
        } catch (error) {
          console.error("Add to wishlist error:", error);
          return false;
        }
      },

      removeItem: async (productId: string) => {
        try {
          const res = await fetch(`/api/wishlist/${productId}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error);
          }

          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));

          return true;
        } catch (error) {
          console.error("Remove from wishlist error:", error);
          return false;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      syncWithServer: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data = await res.json();
            set({
              items: data.items.map((item: { productId: string; createdAt: string }) => ({
                productId: item.productId,
                addedAt: new Date(item.createdAt),
              })),
            });
          }
        } catch (error) {
          console.error("Sync wishlist error:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
