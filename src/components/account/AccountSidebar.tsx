"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  Lock,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    icon: User,
    exact: true,
  },
  {
    href: "/hesabim/siparislerim",
    label: "Siparişlerim",
    icon: Package,
  },
  {
    href: "/hesabim/adreslerim",
    label: "Adreslerim",
    icon: MapPin,
  },
  {
    href: "/hesabim/favorilerim",
    label: "Favorilerim",
    icon: Heart,
  },
  {
    href: "/hesabim/bilgilerim",
    label: "Bilgilerim",
    icon: Settings,
  },
  {
    href: "/hesabim/sifre-degistir",
    label: "Şifre Değiştir",
    icon: Lock,
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
    <nav className="flex flex-col gap-1">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-aegean-50 text-aegean-700"
                : "text-leather-600 hover:bg-sand-100 hover:text-leather-800"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}

      <div className="my-2 border-t border-sand-200" />

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
      >
        <LogOut className="h-5 w-5" />
        Çıkış Yap
      </button>
    </nav>
  );
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  return (
    <aside className={cn("w-64 flex-shrink-0", className)}>
      <div className="bg-white rounded-xl border border-sand-200 p-4 sticky top-24">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function AccountMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4 mr-2" />
          Menü
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Hesabım</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
