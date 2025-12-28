"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { useCartStore } from "@/stores/cart-store";

export function CartPage() {
  const { items, clearCart } = useCartStore();
  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-leather-500 mb-8">
          <Link href="/" className="hover:text-aegean-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-leather-800">Sepetim</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-heading-3 font-accent text-leather-800">
            SEPETİM
            {hasItems && (
              <span className="text-body-lg font-normal text-leather-500 ml-2">
                ({items.length} Ürün)
              </span>
            )}
          </h1>

          {hasItems && (
            <Button
              variant="ghost"
              className="text-leather-500 hover:text-red-500"
              onClick={clearCart}
            >
              Sepeti Temizle
            </Button>
          )}
        </div>

        {hasItems ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-sand-200 p-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <div key={item.variantId}>
                      <CartItem item={item} />
                      {index < items.length - 1 && <Separator />}
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/kadin" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Alışverişe Devam Et
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
}
