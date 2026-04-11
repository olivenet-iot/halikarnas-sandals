"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Search, User, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const { openCart } = useCartStore();

  // Close on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Lock body scroll when open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  const NAV_LINKS = [
    { label: "Kadın", href: "/kadin" },
    { label: "Erkek", href: "/erkek" },
  ];

  const SECONDARY_LINKS = [
    {
      label: "Ara",
      icon: Search,
      action: () => {
        closeMobileMenu();
        setTimeout(() => openSearch(), 100);
      },
    },
    { label: "Hesabım", icon: User, href: "/hesabim" },
    {
      label: "Sepet",
      icon: ShoppingBag,
      action: () => {
        closeMobileMenu();
        setTimeout(() => openCart(), 100);
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-v2-bg-primary transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Menü"
    >
      {/* Close button */}
      <button
        onClick={closeMobileMenu}
        className="absolute top-5 right-6 p-2 text-v2-text-primary"
        aria-label="Menüyü kapat"
      >
        <X className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Content */}
      <div className="flex flex-col justify-center h-full px-8">
        {/* Main links — large serif */}
        <nav className="space-y-6 mb-16">
          {NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block font-serif font-light text-4xl md:text-5xl transition-colors duration-300",
                  isActive ? "text-v2-text-primary" : "text-v2-text-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Secondary links — small, muted */}
        <div className="space-y-4">
          {SECONDARY_LINKS.map((item) => {
            const Icon = item.icon;
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 font-inter text-sm text-v2-text-muted hover:text-v2-text-primary transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-3 font-inter text-sm text-v2-text-muted hover:text-v2-text-primary transition-colors"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
