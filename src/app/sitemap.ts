import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getProductUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

  // Static pages
  const staticPages = [
    "",
    "/kadin",
    "/erkek",
    "/koleksiyonlar",
    "/hakkimizda",
    "/iletisim",
    "/sss",
    "/beden-rehberi",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Products
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: {
      slug: true,
      sku: true,
      gender: true,
      updatedAt: true,
      category: {
        select: { slug: true },
      },
    },
  });

  const productPages = products.map((product) => ({
    url: `${baseUrl}${getProductUrl({
      sku: product.sku || product.slug,
      gender: product.gender,
      category: product.category,
    })}`,
    lastModified: product.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Categories
  const categories = await db.category.findMany({
    where: { isActive: true },
    select: { slug: true, gender: true, updatedAt: true },
  });

  const categoryPages = categories.map((cat) => {
    const genderPath = cat.gender === "ERKEK" ? "erkek" : "kadin";
    return {
      url: `${baseUrl}/${genderPath}/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Collections
  const collections = await db.collection.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const collectionPages = collections.map((col) => ({
    url: `${baseUrl}/koleksiyonlar/${col.slug}`,
    lastModified: col.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Legal/static pages
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

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...collectionPages,
    ...legalPages,
  ];
}
