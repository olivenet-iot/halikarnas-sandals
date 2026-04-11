import { prisma } from "@/lib/db";
import { SecimProductGridClient } from "./SecimProductGridClient";

export const revalidate = 3600; // ISR — 1 hour

export async function SecimProductGrid() {
  let products: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    gender: "ERKEK" | "KADIN" | "UNISEX" | null;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt?: string }[];
    categorySlug: string | null;
  }[] = [];

  try {
    const raw = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: { position: "asc" as const },
          take: 2,
        },
        category: {
          select: { slug: true },
        },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    products = raw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || p.id,
      gender: p.gender as "ERKEK" | "KADIN" | "UNISEX" | null,
      price:
        typeof p.basePrice === "number"
          ? p.basePrice
          : (p.basePrice as { toNumber(): number }).toNumber(),
      compareAtPrice: p.compareAtPrice
        ? typeof p.compareAtPrice === "number"
          ? p.compareAtPrice
          : (p.compareAtPrice as { toNumber(): number }).toNumber()
        : null,
      images: p.images.map((img) => ({
        url: img.url,
        alt: img.alt || undefined,
      })),
      categorySlug: p.category?.slug || null,
    }));
  } catch (error) {
    console.error("SecimProductGrid: Error fetching products:", error);
  }

  if (products.length === 0) return null;

  return <SecimProductGridClient products={products} />;
}
