import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getProductUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

  const staticPages = [
    "",
    "/kadin",
    "/erkek",
    "/hikayemiz",
    "/iletisim",
    "/sss",
    "/beden-rehberi",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: {
      slug: true,
      gender: true,
      updatedAt: true,
    },
  });

  const productPages = products.map((product) => ({
    url: `${baseUrl}${getProductUrl(product)}`,
    lastModified: product.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const pages = await db.page.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const legalPages = pages.map((page) => ({
    url: `${baseUrl}/sayfa/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  return [...staticPages, ...productPages, ...legalPages];
}
