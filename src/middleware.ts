import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN";

  // Admin sayfaları koruma
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  // Hesap sayfaları koruma
  if (pathname.startsWith("/hesabim")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/giris?callbackUrl=${callbackUrl}`, request.url)
      );
    }
  }

  // Giriş yapmış kullanıcı tekrar giriş/kayıt sayfasına giremez
  if ((pathname === "/giris" || pathname === "/kayit") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/hesabim/:path*", "/giris", "/kayit"],
};
