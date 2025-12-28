import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

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
