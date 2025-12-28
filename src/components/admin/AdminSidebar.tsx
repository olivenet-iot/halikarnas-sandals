"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Warehouse,
  BarChart3,
  Activity,
  Mail,
  Ticket,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  pendingOrdersCount?: number;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Ürünler",
    href: "/admin/urunler",
    icon: Package,
  },
  {
    title: "Ürün İçe Aktar",
    href: "/admin/urunler/import",
    icon: Upload,
  },
  {
    title: "Stok Yönetimi",
    href: "/admin/stok",
    icon: Warehouse,
  },
  {
    title: "Siparişler",
    href: "/admin/siparisler",
    icon: ShoppingCart,
    badge: "pendingOrders",
  },
  {
    title: "Kategoriler",
    href: "/admin/kategoriler",
    icon: FolderTree,
  },
  {
    title: "Koleksiyonlar",
    href: "/admin/koleksiyonlar",
    icon: Layers,
  },
  {
    title: "Kullanıcılar",
    href: "/admin/kullanicilar",
    icon: Users,
  },
  {
    title: "Aboneler",
    href: "/admin/aboneler",
    icon: Mail,
  },
  {
    title: "Kuponlar",
    href: "/admin/kuponlar",
    icon: Ticket,
  },
  {
    title: "Raporlar",
    href: "/admin/raporlar",
    icon: BarChart3,
  },
  {
    title: "Aktivite Log",
    href: "/admin/aktivite",
    icon: Activity,
  },
  {
    title: "Bannerlar",
    href: "/admin/bannerlar",
    icon: Image,
  },
  {
    title: "Ayarlar",
    href: "/admin/ayarlar",
    icon: Settings,
  },
];

export function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
  pendingOrdersCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="font-accent text-xl text-leather-800">
              Halikarnas
            </span>
          )}
          {isCollapsed && (
            <span className="font-accent text-xl text-leather-800">H</span>
          )}
        </Link>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const showBadge =
            item.badge === "pendingOrders" && pendingOrdersCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                active
                  ? "bg-leather-100 text-leather-900 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {showBadge && (
                    <Badge
                      variant="destructive"
                      className="h-5 min-w-[20px] flex items-center justify-center text-xs"
                    >
                      {pendingOrdersCount}
                    </Badge>
                  )}
                </>
              )}
              {isCollapsed && showBadge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden md:block p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Daralt</span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r z-50 flex flex-col transform transition-transform duration-200 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-white border-r sticky top-0 transition-all duration-200",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
