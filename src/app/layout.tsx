import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/config";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Halikarnas Sandals | El Yapımı Hakiki Deri Sandaletler",
    template: "%s | Halikarnas Sandals",
  },
  description:
    "Premium el yapımı hakiki deri sandaletler. Bodrum'un antik mirası Halikarnas'tan esinlenen, zamansız şıklık ve üstün zanaatkarlık.",
  keywords: [
    "sandalet",
    "deri sandalet",
    "el yapımı sandalet",
    "bodrum sandalet",
    "hakiki deri",
    "kadın sandalet",
    "erkek sandalet",
    "Halikarnas",
  ],
  authors: [{ name: "Halikarnas Sandals" }],
  creator: "Halikarnas Sandals",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Halikarnas Sandals",
    title: "Halikarnas Sandals | El Yapımı Hakiki Deri Sandaletler",
    description:
      "Premium el yapımı hakiki deri sandaletler. Bodrum'un antik mirası Halikarnas'tan esinlenen, zamansız şıklık ve üstün zanaatkarlık.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Halikarnas Sandals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Halikarnas Sandals | El Yapımı Hakiki Deri Sandaletler",
    description:
      "Premium el yapımı hakiki deri sandaletler. Bodrum'un antik mirası Halikarnas'tan esinlenen.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd searchUrl="/arama" />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} font-inter antialiased bg-v2-bg-primary`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
