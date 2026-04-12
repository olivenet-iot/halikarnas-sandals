import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailV2 } from "@/components/shop/ProductDetailV2";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProductUrl } from "@/lib/utils";
import {
  getProductBySlug,
  getRelatedProducts,
  transformProductData,
} from "@/lib/product-queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "ERKEK");

  if (!product) {
    return { title: "Urun Bulunamadi" };
  }

  const productUrl = getProductUrl({
    slug: product.slug,
    gender: product.gender,
  });

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    alternates: { canonical: productUrl },
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
  const { slug } = await params;
  const product = await getProductBySlug(slug, "ERKEK");

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    "ERKEK"
  );

  const productData = transformProductData(product);

  const productUrl = getProductUrl({
    slug: product.slug,
    gender: product.gender,
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Erkek", url: "/erkek" },
    { name: product.name, url: productUrl },
  ];

  const productJsonLd = {
    name: product.name,
    description: product.description || "",
    slug: product.slug,
    gender: product.gender,
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
      <ProductDetailV2 product={productData} relatedProducts={relatedProducts} />
    </>
  );
}
