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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHydrated } from "@/hooks/useHydrated";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

type HeaderState = "transparent" | "glass" | "solid";

export function Navbar() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hydrated = useHydrated();

  const { openCart, getTotalItems } = useCartStore();
  const { openMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated } = useCurrentUser();
  // Only get cart count after hydration to prevent mismatch
  const cartItemCount = hydrated ? getTotalItems() : 0;

  // Check if we're on the homepage for transparent header
  const isHomepage = pathname === "/";
  const isScrolled = scrollY > 50;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header state
  const headerState: HeaderState = useMemo(() => {
    if (!isHomepage) return "solid";
    if (isScrolled) return "glass";
    return "transparent";
  }, [isHomepage, isScrolled]);

  // Header inline styles for glassmorphism (vendor prefixes)
  const headerStyle: CSSProperties = useMemo(() => {
    switch (headerState) {
      case "glass":
        return {
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
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
  }, [headerState]);

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

  // Determine text colors based on state
  const isDarkText = headerState !== "transparent";

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
            style={textGlowStyle}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(logoClasses, "hover:opacity-80")}
            style={logoGlowStyle}
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
                  style={headerState === "transparent" ? textGlowStyle : {}}
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
                      <div className="bg-white border border-luxury-stone/30 py-3 min-w-[200px] shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-6 py-2.5 text-sm tracking-wide transition-all duration-200",
                              pathname === child.href
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
              style={textGlowStyle}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("hidden sm:flex", iconClasses)}
            >
              <Link
                href={isAuthenticated ? "/hesabim/favorilerim" : "/giris?callbackUrl=/hesabim/favorilerim"}
                aria-label="Favorilerim"
                style={textGlowStyle}
              >
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Account */}
            <UserMenu />

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Sepetim"
              className={cn("relative", iconClasses)}
              style={textGlowStyle}
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
