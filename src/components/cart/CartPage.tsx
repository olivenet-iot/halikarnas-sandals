"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoldDivider } from "@/components/ui/luxury/GoldDivider";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { useCartStore } from "@/stores/cart-store";
import { EASE } from "@/lib/animations";

export function CartPage() {
  const { items, clearCart } = useCartStore();
  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Header */}
      <section className="pt-24 pb-8 text-center border-b border-stone-200">
        <GoldDivider variant="default" className="mx-auto mb-6" />
        <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-stone-800">
          SEPETIM
          {hasItems && (
            <span className="text-stone-500 font-sans text-base ml-3">
              ({items.length} Urun)
            </span>
          )}
        </h1>
      </section>

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasItems ? (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Clear Cart Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-stone-500 hover:text-red-500 transition-colors"
                >
                  Sepeti Temizle
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1, duration: 0.5, ease: EASE.luxury }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Link
                  href="/koleksiyonlar"
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-[#B8860B] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-wide">Alisverise Devam Et</span>
                </Link>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </section>
    </div>
  );
}
