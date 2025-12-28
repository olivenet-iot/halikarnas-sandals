"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, User, Heart, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export function MobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b border-sand-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-accent text-xl text-leather-800">
              Menü
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileMenu}
              aria-label="Menüyü kapat"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Main Navigation */}
          <nav className="p-4">
            <Accordion type="single" collapsible className="space-y-2">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <AccordionItem
                    key={item.href}
                    value={item.href}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={cn(
                        "py-3 px-4 rounded-lg text-body-md font-medium hover:no-underline",
                        pathname.startsWith(item.href)
                          ? "bg-aegean-50 text-aegean-700"
                          : "hover:bg-sand-100 text-leather-700"
                      )}
                    >
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pt-2 pb-0">
                      <div className="space-y-1">
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between py-2 px-4 rounded-lg text-body-sm transition-colors",
                            pathname === item.href
                              ? "bg-sand-100 text-aegean-600"
                              : "text-leather-600 hover:bg-sand-50"
                          )}
                        >
                          Tümünü Gör
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center justify-between py-2 px-4 rounded-lg text-body-sm transition-colors",
                              pathname === child.href
                                ? "bg-sand-100 text-aegean-600"
                                : "text-leather-600 hover:bg-sand-50"
                            )}
                          >
                            {child.label}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between py-3 px-4 rounded-lg text-body-md font-medium transition-colors",
                        pathname === item.href
                          ? "bg-aegean-50 text-aegean-700"
                          : "hover:bg-sand-100 text-leather-700"
                      )}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )
              )}
            </Accordion>
          </nav>

          {/* Divider */}
          <div className="border-t border-sand-200 mx-4" />

          {/* Account Links */}
          <div className="p-4">
            <p className="text-body-xs text-leather-500 uppercase tracking-wider mb-3 px-4">
              Hesabım
            </p>
            <div className="space-y-1">
              <Link
                href="/hesabim"
                className="flex items-center gap-3 py-2 px-4 rounded-lg text-body-sm text-leather-600 hover:bg-sand-50 transition-colors"
              >
                <User className="h-4 w-4" />
                Hesap Bilgilerim
              </Link>
              <Link
                href="/hesabim/siparislerim"
                className="flex items-center gap-3 py-2 px-4 rounded-lg text-body-sm text-leather-600 hover:bg-sand-50 transition-colors"
              >
                <Package className="h-4 w-4" />
                Siparişlerim
              </Link>
              <Link
                href="/hesabim/favorilerim"
                className="flex items-center gap-3 py-2 px-4 rounded-lg text-body-sm text-leather-600 hover:bg-sand-50 transition-colors"
              >
                <Heart className="h-4 w-4" />
                Favorilerim
              </Link>
              <Link
                href="/hesabim/adreslerim"
                className="flex items-center gap-3 py-2 px-4 rounded-lg text-body-sm text-leather-600 hover:bg-sand-50 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Adreslerim
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 pt-0 space-y-2">
            <Button asChild className="w-full btn-primary">
              <Link href="/giris">Giriş Yap</Link>
            </Button>
            <Button asChild variant="outline" className="w-full btn-secondary">
              <Link href="/kayit">Kayıt Ol</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
