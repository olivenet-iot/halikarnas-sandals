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

type HeaderState = "transparent" | "glass" | "solid";

interface NavbarProps {
  variant?: "default" | "cinematic";
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const isCinematic = variant === "cinematic";
  const pathname = usePathname();
  const [windowScrollY, setWindowScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hydrated = useHydrated();

  const { openCart, getTotalItems } = useCartStore();
  const { openMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated } = useCurrentUser();

  // Cinematic scroll (koleksiyonlar CinematicScroll container'indan)
  const cinematicScrollY = useScrollStore((state) => state.scrollY);
  const navbarTheme = useScrollStore((state) => state.navbarTheme);

  // Only get cart count after hydration to prevent mismatch
  const cartItemCount = hydrated ? getTotalItems() : 0;

  // Check if we're on the homepage for transparent header
  const isHomepage = pathname === "/";

  // Hangi scroll kaynagini kullanacagimizi belirle
  const scrollY = isCinematic ? cinematicScrollY : windowScrollY;
  const isScrolled = scrollY > 50;

  // Window scroll listener (sadece default variant icin)
  useEffect(() => {
    if (isCinematic) return; // Cinematic modda window scroll dinleme

    const handleScroll = () => {
      setWindowScrollY(window.scrollY);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCinematic]);

  // Determine header state
  const headerState: HeaderState = useMemo(() => {
    // Cinematic variant - HER ZAMAN transparent
    if (isCinematic) {
      return "transparent";
    }
    if (!isHomepage) return "solid";
    if (isScrolled) return "glass";
    return "transparent";
  }, [isHomepage, isScrolled, isCinematic]);

  // Header inline styles for glassmorphism (vendor prefixes)
  const headerStyle: CSSProperties = useMemo(() => {
    // Cinematic variant - HER ZAMAN transparent, glass yok
    if (isCinematic) {
      return {
        background: "transparent",
      };
    }

    // Default variant
    switch (headerState) {
      case "glass":
        return {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        };
      case "solid":
        return {
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        };
      case "transparent":
      default:
        return {
          background: "transparent",
        };
    }
  }, [headerState, isCinematic]);

  // Text glow style for transparent state
  const textGlowStyle: CSSProperties = useMemo(() => {
    if (headerState === "transparent") {
      return {
        textShadow: "0 0 30px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.5)",
      };
    }
    return {};
  }, [headerState]);

  // Logo glow style (stronger)
  const logoGlowStyle: CSSProperties = useMemo(() => {
    if (headerState === "transparent") {
      return {
        textShadow: "0 0 40px rgba(255,255,255,0.7), 0 2px 10px rgba(0,0,0,0.6)",
      };
    }
    return {};
  }, [headerState]);

  // Cinematic mode text glow style (okunabilirlik icin)
  const cinematicTextStyle: CSSProperties = useMemo(() => {
    if (!isCinematic) return {};

    // Light theme (light background) - use subtle shadow
    if (navbarTheme === "light") {
      return {
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      };
    }

    // Dark theme (dark background) - use glow
    return {
      textShadow: `
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 40px rgba(255, 255, 255, 0.3),
        0 0 60px rgba(255, 255, 255, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.5)
      `,
    };
  }, [isCinematic, navbarTheme]);

  // Cinematic mode icin active link (gold glow)
  const cinematicActiveStyle: CSSProperties = useMemo(() => {
    if (!isCinematic) return {};

    // Light theme - subtle gold shadow
    if (navbarTheme === "light") {
      return {
        textShadow: "0 1px 2px rgba(184, 134, 11, 0.3)",
      };
    }

    // Dark theme - gold glow
    return {
      textShadow: `
        0 0 20px rgba(184, 134, 11, 0.6),
        0 0 40px rgba(184, 134, 11, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.5)
      `,
    };
  }, [isCinematic, navbarTheme]);

  // Cinematic mode icin icon glow
  const cinematicIconStyle: CSSProperties = useMemo(() => {
    if (!isCinematic) return {};

    // Light theme - no filter needed (dark icons)
    if (navbarTheme === "light") {
      return {};
    }

    // Dark theme - white glow
    return {
      filter: `
        drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))
        drop-shadow(0 0 16px rgba(255, 255, 255, 0.2))
      `,
    };
  }, [isCinematic, navbarTheme]);

  // Determine text colors based on state
  // Cinematic variant uses dynamic theme based on frame background
  // navbarTheme "light" = light background → use dark text
  // navbarTheme "dark" = dark background → use light text
  const isDarkText = isCinematic ? navbarTheme === "light" : headerState !== "transparent";

  // Header classes (layout only, no background)
  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
    headerState === "transparent" ? "py-5" : "py-3"
  );

  // Text classes
  const textClasses = cn(
    "transition-all duration-300 font-medium",
    isDarkText ? "text-luxury-primary" : "text-white"
  );

  // Logo classes
  const logoClasses = cn(
    "font-display text-xl md:text-2xl tracking-[0.15em] transition-all duration-300",
    isDarkText ? "text-luxury-primary" : "text-white"
  );

  // Icon classes
  const iconClasses = cn(
    "transition-all duration-300",
    isDarkText
      ? "text-luxury-primary hover:text-luxury-primary/70"
      : "text-white hover:text-white/80"
  );

  // Active nav item classes
  const getNavItemClasses = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");

    if (isActive) {
      // Cinematic variant uses gold accent on white text
      if (isCinematic) {
        return "text-[#B8860B] border-b border-[#B8860B] pb-1";
      }
      if (headerState === "transparent") {
        return "text-white border-b border-white pb-1";
      }
      return "text-luxury-gold border-b border-luxury-gold pb-1";
    }

    return cn(textClasses, "hover:opacity-70");
  };

  return (
    <header className={headerClasses} style={headerStyle}>
      <nav className="container-luxury transition-all duration-500">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", iconClasses)}
            onClick={openMobileMenu}
            aria-label="Menüyü aç"
            style={isCinematic ? cinematicIconStyle : textGlowStyle}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(logoClasses, "hover:opacity-80")}
            style={isCinematic ? cinematicTextStyle : logoGlowStyle}
          >
            HALIKARNAS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.href)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-all duration-300",
                    getNavItemClasses(item.href)
                  )}
                  style={
                    isCinematic
                      ? pathname === item.href || pathname.startsWith(item.href + "/")
                        ? cinematicActiveStyle
                        : cinematicTextStyle
                      : headerState === "transparent"
                        ? textGlowStyle
                        : {}
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

                {/* Dropdown Menu - Luxury Style */}
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
                          isCinematic
                            ? navbarTheme === "light"
                              ? "bg-white/95 backdrop-blur-md border border-stone-200"
                              : "bg-black/80 backdrop-blur-md border border-white/10"
                            : "bg-white border border-luxury-stone/30"
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-6 py-2.5 text-sm tracking-wide transition-all duration-200",
                              isCinematic
                                ? navbarTheme === "light"
                                  ? pathname === child.href
                                    ? "bg-stone-100 text-[#B8860B]"
                                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                                  : pathname === child.href
                                    ? "bg-white/10 text-[#B8860B]"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                : pathname === child.href
                                  ? "bg-luxury-cream text-luxury-gold"
                                  : "text-luxury-charcoal hover:bg-luxury-cream hover:text-luxury-primary"
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Ara"
              className={iconClasses}
              style={isCinematic ? cinematicIconStyle : textGlowStyle}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("hidden sm:flex", iconClasses)}
              style={isCinematic ? cinematicIconStyle : undefined}
            >
              <Link
                href={isAuthenticated ? "/hesabim/favorilerim" : "/giris?callbackUrl=/hesabim/favorilerim"}
                aria-label="Favorilerim"
                style={!isCinematic ? textGlowStyle : undefined}
              >
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Account */}
            <UserMenu variant={isCinematic ? "cinematic" : "default"} />

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Sepetim"
              className={cn("relative", iconClasses)}
              style={isCinematic ? cinematicIconStyle : textGlowStyle}
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
