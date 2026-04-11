"use client";

import { useState, useEffect, useMemo, CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useScrollStore } from "@/stores/scroll-store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHydrated } from "@/hooks/useHydrated";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

interface NavbarProps {
  variant?: "default" | "cinematic";
}

/* ═══════════════════════════════════════════════
 * V2 DEFAULT NAVBAR
 * Logo left (serif) | KADIN ERKEK center | icons right
 * Transparent on homepage hero → solid v2-bg-primary after 80px
 * ═══════════════════════════════════════════════ */
function NavbarDefault() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const hydrated = useHydrated();

  const { openCart, getTotalItems } = useCartStore();
  const { openMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated } = useCurrentUser();

  const cartItemCount = hydrated ? getTotalItems() : 0;
  const isHomepage = pathname === "/";
  const isScrolled = scrollY > 80;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On homepage: transparent → solid. On other pages: always solid.
  const isTransparent = isHomepage && !isScrolled;

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isTransparent ? "py-5" : "py-3",
    isTransparent
      ? "bg-transparent"
      : "bg-v2-bg-primary border-b border-v2-border-subtle"
  );

  const textColor = "text-v2-text-primary";
  const mutedColor = "text-v2-text-muted";

  const NAV_LINKS = [
    { label: "Kadın", href: "/kadin" },
    { label: "Erkek", href: "/erkek" },
  ];

  return (
    <header className={headerClasses}>
      <nav className="container-v2">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", textColor)}
            onClick={openMobileMenu}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </Button>

          {/* Logo — Cormorant serif, font-medium when transparent for readability */}
          <Link
            href="/"
            className={cn(
              "font-serif font-medium tracking-[0.25em] text-lg transition-colors duration-300",
              textColor
            )}
          >
            HALIKARNAS
          </Link>

          {/* Desktop nav — 2 links, no dropdowns */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-inter text-xs tracking-[0.15em] uppercase transition-colors duration-300",
                    isActive
                      ? cn(textColor, "border-b border-current pb-0.5")
                      : cn(mutedColor, "hover:opacity-100")
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions — outline stroke icons */}
          <div className="flex items-center gap-2">
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

            <UserMenu variant="default" />

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Sepetim"
              className={cn("relative", textColor)}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-v2-accent text-white text-[10px] flex items-center justify-center font-medium">
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
 * CINEMATIC NAVBAR — preserved as-is for /koleksiyonlar
 * ═══════════════════════════════════════════════ */
function NavbarCinematic() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hydrated = useHydrated();

  const { openCart, getTotalItems } = useCartStore();
  const { openMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated } = useCurrentUser();

  const navbarTheme = useScrollStore((state) => state.navbarTheme);

  const cartItemCount = hydrated ? getTotalItems() : 0;

  const cinematicTextStyle: CSSProperties = useMemo(() => {
    if (navbarTheme === "light") {
      return { textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" };
    }
    return {
      textShadow: `
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 40px rgba(255, 255, 255, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.5)
      `,
    };
  }, [navbarTheme]);

  const cinematicActiveStyle: CSSProperties = useMemo(() => {
    if (navbarTheme === "light") {
      return { textShadow: "0 1px 2px rgba(184, 134, 11, 0.3)" };
    }
    return {
      textShadow: `
        0 0 20px rgba(184, 134, 11, 0.6),
        0 0 40px rgba(184, 134, 11, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.5)
      `,
    };
  }, [navbarTheme]);

  const cinematicIconStyle: CSSProperties = useMemo(() => {
    if (navbarTheme === "light") return {};
    return {
      filter: `drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.2))`,
    };
  }, [navbarTheme]);

  const textClasses = "text-white transition-all duration-300 font-medium";
  const iconClasses = "text-white hover:text-white/80 transition-all duration-300";

  const getNavItemClasses = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    if (isActive) return "text-[#B8860B] border-b border-[#B8860B] pb-1";
    return cn(textClasses, "hover:opacity-70");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-5" style={{ background: "transparent" }}>
      <nav className="container-luxury transition-all duration-500">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", iconClasses)}
            onClick={openMobileMenu}
            aria-label="Menüyü aç"
            style={cinematicIconStyle}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link
            href="/"
            className="font-display text-xl md:text-2xl tracking-[0.15em] text-white hover:opacity-80 transition-all duration-300"
            style={cinematicTextStyle}
          >
            HALIKARNAS
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-all duration-300",
                    getNavItemClasses(item.href)
                  )}
                  style={
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? cinematicActiveStyle
                      : cinematicTextStyle
                  }
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        activeDropdown === item.href && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {item.children && activeDropdown === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    >
                      <div
                        className={cn(
                          "py-3 min-w-[200px] shadow-lg",
                          navbarTheme === "light"
                            ? "bg-white/95 backdrop-blur-md border border-stone-200"
                            : "bg-black/80 backdrop-blur-md border border-white/10"
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-6 py-2.5 text-sm tracking-wide transition-all duration-200",
                              navbarTheme === "light"
                                ? pathname === child.href
                                  ? "bg-stone-100 text-[#B8860B]"
                                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                                : pathname === child.href
                                  ? "bg-white/10 text-[#B8860B]"
                                  : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Ara"
              className={iconClasses}
              style={cinematicIconStyle}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("hidden sm:flex", iconClasses)}
              style={cinematicIconStyle}
            >
              <Link
                href={isAuthenticated ? "/hesabim/favorilerim" : "/giris?callbackUrl=/hesabim/favorilerim"}
                aria-label="Favorilerim"
              >
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <UserMenu variant="cinematic" />

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Sepetim"
              className={cn("relative", iconClasses)}
              style={cinematicIconStyle}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-luxury-gold text-luxury-primary text-xs flex items-center justify-center font-medium"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════
 * EXPORTED NAVBAR — routes to correct variant
 * ═══════════════════════════════════════════════ */
export function Navbar({ variant = "default" }: NavbarProps) {
  if (variant === "cinematic") return <NavbarCinematic />;
  return <NavbarDefault />;
}
