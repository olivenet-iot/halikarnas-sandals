import { Navbar, MobileMenu, SearchDialog, CartDrawer } from "@/components/layout";

/**
 * Cinematic Layout for Collections
 * Glass Navbar with dark theme, Footer hidden for full-screen experience
 */
export default function CinematicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar variant="cinematic" />
      <MobileMenu />
      <SearchDialog />
      <CartDrawer />
      {children}
    </>
  );
}
