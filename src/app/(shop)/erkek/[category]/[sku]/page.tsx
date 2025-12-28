import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProductUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ category: string; sku: string }>;
}

async function getProduct(categorySlug: string, sku: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        sku,
        category: { slug: categorySlug },
        gender: { in: ["ERKEK", "UNISEX"] },
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

async function getRelatedProducts(productId: string, categoryId: string | null) {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId: categoryId || undefined,
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
          select: { color: true, colorHex: true },
        },
        category: true,
      },
      take: 4,
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
      categorySlug: product.category?.slug || null,
      isNew: product.isNew,
      isSale: product.compareAtPrice ? Number(product.compareAtPrice) > Number(product.basePrice) : false,
      isBestseller: product.isBestSeller,
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, sku } = await params;
  const product = await getProduct(category, sku);

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
    };
  }

  const productUrl = getProductUrl({
    sku: product.sku || product.id,
    gender: product.gender,
    category: product.category,
  });

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description?.slice(0, 160),
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.name }]
        : [],
    },
  };
}

export default async function ErkekProductPage({ params }: Props) {
  const { category, sku } = await params;
  const product = await getProduct(category, sku);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);

  const productUrl = getProductUrl({
    sku: product.sku || product.id,
    gender: product.gender,
    category: product.category,
  });

  // Transform product data for the component
  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku || product.id,
    gender: product.gender,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
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
      ? { name: product.collections[0].collection.name, slug: product.collections[0].collection.slug }
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
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0,
    reviewCount: product.reviews.length,
  };

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Erkek", url: "/erkek" },
    ...(product.category ? [{ name: product.category.name, url: `/erkek/${product.category.slug}` }] : []),
    { name: product.name, url: productUrl },
  ];

  // Product data for JSON-LD
  const productJsonLd = {
    name: product.name,
    description: product.description || "",
    slug: product.slug,
    images: product.images.map((img) => ({ url: img.url })),
    basePrice: Number(product.basePrice),
    salePrice: product.compareAtPrice ? Number(product.basePrice) : null,
    variants: product.variants.map((v) => ({ stock: v.stock })),
    rating: productData.averageRating,
    reviewCount: productData.reviewCount,
  };

  return (
    <>
      <ProductJsonLd product={productJsonLd} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetail product={productData} relatedProducts={relatedProducts} />
    </>
  );
}
