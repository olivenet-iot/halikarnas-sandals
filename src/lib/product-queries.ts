import { prisma } from "@/lib/db";
import type { ProductCardV2Props } from "@/components/shop/ProductCardV2";

type GenderFilter = "ERKEK" | "KADIN";

export async function getProduct(
  categorySlug: string,
  sku: string,
  gender: GenderFilter
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        sku,
        category: { slug: categorySlug },
        gender: { in: [gender, "UNISEX"] },
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: {
          orderBy: [{ size: "asc" }, { color: "asc" }],
        },
        category: true,
        collections: {
          include: {
            collection: true,
          },
          take: 1,
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  gender: GenderFilter
): Promise<ProductCardV2Props[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId: categoryId || undefined,
        status: "ACTIVE",
        gender: { in: [gender, "UNISEX"] },
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 2,
        },
        category: true,
      },
      take: 6,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || product.id,
      gender: product.gender,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt || undefined,
      })),
      categorySlug: product.category?.slug || null,
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

type ProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof getProduct>>
>;

export function transformProductData(product: ProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku || product.id,
    gender: product.gender,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null,
    material: product.material,
    soleType: product.soleType,
    heelHeight: product.heelHeight,
    careInstructions: product.careInstructions,
    isNew: product.isNew,
    isBestseller: product.isBestSeller,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      color: img.color,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.colorHex || "",
      colorName: v.color || "",
      stock: v.stock,
      sku: v.sku,
    })),
    category: product.category
      ? { name: product.category.name, slug: product.category.slug }
      : null,
    collection: product.collections[0]?.collection
      ? {
          name: product.collections[0].collection.name,
          slug: product.collections[0].collection.slug,
        }
      : null,
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      user: {
        name: r.user.name,
        image: r.user.image,
      },
    })),
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0,
    reviewCount: product.reviews.length,
  };
}
