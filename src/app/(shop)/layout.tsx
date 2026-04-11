"use client";

import { Navbar, MobileMenu, Footer, CartDrawer, SearchDialog } from "@/components/layout";
import { ShippingConfigProvider } from "@/components/providers/ShippingConfigProvider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShippingConfigProvider>
      <Navbar />
      <MobileMenu />
      <SearchDialog />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </ShippingConfigProvider>
  );
}
