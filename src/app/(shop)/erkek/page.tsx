import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoryPageV2 } from "@/components/shop/CategoryPageV2";

export const metadata: Metadata = {
  title: "Erkek Sandaletler",
  description:
    "Premium el yapımı hakiki deri erkek sandaletleri. Maskülen tasarım, üstün konfor ve dayanıklılık.",
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        gender: { in: ["ERKEK", "UNISEX"] },
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 2,
        },
        variants: {
          where: { stock: { gt: 0 } },
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            stock: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || product.id,
      gender: product.gender,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt || undefined })),
      colors: Array.from(
        new Map(
          product.variants
            .filter((v) => v.colorHex)
            .map((v) => [v.colorHex, { name: v.color || "", hex: v.colorHex || "" }] as const)
        ).values()
      ),
      sizes: Array.from(new Set(product.variants.map((v) => v.size))),
      categorySlug: product.category?.slug || null,
      createdAt: product.createdAt.toISOString(),
      isSale: product.compareAtPrice ? Number(product.compareAtPrice) > Number(product.basePrice) : false,
      isBestseller: product.isBestSeller,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ErkekPage() {
  const products = await getProducts();

  return (
    <CategoryPageV2
      title="Erkek"
      description="El yapımı hakiki deri erkek sandaletleri."
      products={products}
      gender="men"
    />
  );
}
