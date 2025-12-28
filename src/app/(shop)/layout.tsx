"use client";

import { Navbar, MobileMenu, Footer, CartDrawer, SearchDialog } from "@/components/layout";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MobileMenu />
      <SearchDialog />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
