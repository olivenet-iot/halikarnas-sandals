"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MENU_ITEMS = [
  {
    href: "/hesabim",
    label: "Hesabım",
    exact: true,
  },
  {
    href: "/hesabim/siparislerim",
    label: "Siparişlerim",
  },
  {
    href: "/hesabim/adreslerim",
    label: "Adreslerim",
  },
  {
    href: "/hesabim/favorilerim",
    label: "Favorilerim",
  },
  {
    href: "/hesabim/bilgilerim",
    label: "Bilgilerim",
  },
  {
    href: "/hesabim/sifre-degistir",
    label: "Şifre Değiştir",
  },
];

interface AccountSidebarProps {
  className?: string;
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="flex flex-col">
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "block py-3 font-inter text-sm text-v2-text-muted hover:text-v2-text-primary transition-colors relative",
                active &&
                  "text-v2-text-primary border-l-2 border-v2-accent -ml-[9px] pl-[7px]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 pt-6 border-t border-v2-border-subtle">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 font-inter transition-colors"
        >
          Çıkış yap
        </button>
      </div>
    </>
  );
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  return (
    <aside className={cn("w-56 flex-shrink-0", className)}>
      <div className="border-r border-v2-border-subtle pr-8">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function AccountMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden font-inter text-sm text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4">
          Menü
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-v2-bg-primary border-r border-v2-border-subtle"
      >
        <SheetHeader>
          <SheetTitle className="font-serif font-light text-2xl text-v2-text-primary">
            Hesabım
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
