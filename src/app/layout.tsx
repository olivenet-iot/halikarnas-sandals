import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
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
    url: "https://halikarnassandals.com",
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
        className={`${dmSans.variable} ${cormorant.variable} ${cinzel.variable} font-body antialiased bg-luxury-cream`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
