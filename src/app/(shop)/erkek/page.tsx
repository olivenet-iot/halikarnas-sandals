import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoryPage } from "@/components/shop/CategoryPage";

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
      isNew: product.isNew,
      isSale: product.compareAtPrice ? Number(product.compareAtPrice) > Number(product.basePrice) : false,
      isBestseller: product.isBestSeller,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        gender: "ERKEK",
        isActive: true,
      },
      orderBy: { position: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count.products,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ErkekPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <CategoryPage
      title="Erkek Sandaletler"
      description="Premium el yapımı hakiki deri erkek sandaletleri. Güç ve zarafet bir arada."
      products={products}
      categories={categories}
      gender="men"
    />
  );
}
