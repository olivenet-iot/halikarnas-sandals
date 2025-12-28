"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface UserMenuProps {
  variant?: "default" | "cinematic";
}

export function UserMenu({ variant = "default" }: UserMenuProps) {
  const isCinematic = variant === "cinematic";
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, isAdmin } = useCurrentUser();
  const [scrollY, setScrollY] = useState(0);

  const isHomepage = pathname === "/";
  const isScrolled = scrollY > 50;

  useEffect(() => {
    if (isCinematic) return; // Cinematic modda window scroll dinleme
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCinematic]);

  // Determine if we need light (white) or dark text
  // Cinematic mode always uses light mode
  const isLightMode = isCinematic || (isHomepage && !isScrolled);

  const iconClasses = cn(
    "transition-all duration-300",
    isLightMode
      ? "text-white hover:text-white/80"
      : "text-luxury-primary hover:text-luxury-primary/70"
  );

  // Cinematic icon glow style
  const cinematicIconStyle: CSSProperties = useMemo(() => {
    if (!isCinematic) return {};
    return {
      filter: `
        drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))
        drop-shadow(0 0 16px rgba(255, 255, 255, 0.2))
      `,
    };
  }, [isCinematic]);

  const glowStyle: CSSProperties = useMemo(() => {
    if (isCinematic) return cinematicIconStyle;
    if (isLightMode) {
      return {
        textShadow: "0 0 30px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.5)",
      };
    }
    return {};
  }, [isLightMode, isCinematic, cinematicIconStyle]);

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("hidden sm:flex", iconClasses)}
        disabled
        style={glowStyle}
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  // Not authenticated - show login/register dropdown
  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden sm:flex", iconClasses)}
            aria-label="Hesabım"
            style={glowStyle}
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/giris" className="cursor-pointer">
              Giriş Yap
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/kayit" className="cursor-pointer">
              Kayıt Ol
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Authenticated user menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("hidden sm:flex", iconClasses)}
          aria-label="Hesabım"
          style={glowStyle}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
            <AvatarFallback className="bg-aegean-100 text-aegean-700 text-sm font-medium">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/hesabim" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Hesabım
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/hesabim/siparislerim" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            Siparişlerim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/hesabim/favorilerim" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Favorilerim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/hesabim/ayarlar" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer text-aegean-600">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
