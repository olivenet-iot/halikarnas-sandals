import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/hesabim/",
          "/api/",
          "/sepet",
          "/odeme",
          "/siparis-tamamlandi/",
          "/giris",
          "/kayit",
          "/sifremi-unuttum",
          "/sifre-sifirla/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
