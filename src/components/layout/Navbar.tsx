"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
 * V2 DEFAULT NAVBAR — left-aligned editorial layout
 * Wordmark + Kadın/Erkek/Hikayemiz grouped left
 * Search / Heart / User / Bag grouped right
 * Always solid v2-bg-primary; border-b appears on scroll
 * Fixed h-16/h-20 matches (shop) layout pt-16/pt-20
 * ═══════════════════════════════════════════════ */
function NavbarDefault() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const hydrated = useHydrated();

  const { openCart, getTotalItems } = useCartStore();
  const { openMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated } = useCurrentUser();

  const cartItemCount = hydrated ? getTotalItems() : 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-v2-bg-primary border-b transition-colors duration-300",
    isScrolled ? "border-v2-border-subtle" : "border-transparent"
  );

  const textColor = "text-v2-text-primary";
  const mutedColor = "text-v2-text-muted";

  const NAV_LINKS = [
    { label: "Kadın", href: "/kadin" },
    { label: "Erkek", href: "/erkek" },
    { label: "Hikayemiz", href: "/hikayemiz" },
  ];

  const accountHref = isAuthenticated
    ? "/hesabim"
    : "/giris?callbackUrl=/hesabim";

  return (
    <header className={headerClasses}>
      <nav className="container-v2 h-full">
        <div className="flex items-center justify-between h-full">
          {/* LEFT CLUSTER — hamburger (mobile) + wordmark + nav links (desktop) */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden -ml-2", textColor)}
              onClick={openMobileMenu}
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </Button>

            <Link
              href="/"
              className={cn(
                "font-serif font-normal tracking-[0.25em] text-lg transition-colors duration-300",
                textColor
              )}
            >
              HALIKARNAS
            </Link>

            <div className="hidden lg:flex items-center gap-10 lg:gap-12 ml-12 lg:ml-16">
              {NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative font-inter text-xs tracking-[0.15em] uppercase py-1 transition-colors duration-300",
                      isActive
                        ? textColor
                        : cn(mutedColor, "hover:text-v2-text-primary")
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute left-0 bottom-0 h-px bg-current transition-[width] duration-500 ease-out",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT CLUSTER — outline stroke icons */}
          <div className="flex items-center gap-5 lg:gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Ara"
              className={textColor}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("hidden sm:flex", textColor)}
            >
              <Link
                href={
                  isAuthenticated
                    ? "/hesabim/favorilerim"
                    : "/giris?callbackUrl=/hesabim/favorilerim"
                }
                aria-label="Favorilerim"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("hidden sm:flex", textColor)}
            >
              <Link href={accountHref} aria-label="Hesabım">
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Sepetim"
              className={cn("relative", textColor)}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-v2-text-primary text-v2-bg-primary text-[10px] flex items-center justify-center font-medium">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════
 * EXPORTED NAVBAR
 * ═══════════════════════════════════════════════ */
export function Navbar() {
  return <NavbarDefault />;
}
