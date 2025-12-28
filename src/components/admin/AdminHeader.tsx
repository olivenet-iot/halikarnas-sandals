"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  Bell,
  ChevronRight,
  LogOut,
  User,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const breadcrumbMap: Record<string, string> = {
  admin: "Dashboard",
  urunler: "Ürünler",
  kategoriler: "Kategoriler",
  koleksiyonlar: "Koleksiyonlar",
  siparisler: "Siparişler",
  kullanicilar: "Kullanıcılar",
  ayarlar: "Ayarlar",
  yeni: "Yeni",
  duzenle: "Düzenle",
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Generate breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = breadcrumbMap[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    return { href, label, isLast };
  });

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-4 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm flex-1">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
            {crumb.isLast ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* View Store */}
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" target="_blank">
            <Store className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notifications (Placeholder) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="Bildirimler (Yakında)"
          onClick={() => alert("Bildirimler yakında aktif olacak!")}
        >
          <Bell className="h-5 w-5" />
          {/* Badge - gerçek bildirim sisteminde kullanılacak */}
          {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" /> */}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={session?.user?.image || undefined}
                  alt={session?.user?.name || "Admin"}
                />
                <AvatarFallback className="bg-leather-100 text-leather-800">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/hesabim">
                <User className="h-4 w-4 mr-2" />
                Profilim
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
