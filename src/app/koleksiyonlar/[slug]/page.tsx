import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CollectionPageClient } from "./CollectionPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findUnique({
    where: { slug, isActive: true },
    select: {
      name: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      bannerImage: true,
      image: true,
    },
  });

  if (!collection) {
    return { title: "Koleksiyon Bulunamadi" };
  }

  return {
    title:
      collection.metaTitle || `${collection.name} | Halikarnas Sandals`,
    description:
      collection.metaDescription ||
      collection.description ||
      `${collection.name} koleksiyonunu kesfedin.`,
    openGraph: {
      images: [collection.bannerImage || collection.image].filter(
        Boolean
      ) as string[],
    },
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch current collection with products
  const collection = await db.collection.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: {
          product: {
            status: "ACTIVE",
          },
        },
        orderBy: { position: "asc" },
        include: {
          product: {
            include: {
              images: {
                orderBy: { position: "asc" },
                take: 2,
              },
              category: true,
            },
          },
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  // Fetch other collections for the closing frame
  const otherCollections = await db.collection.findMany({
    where: {
      isActive: true,
      slug: { not: slug },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      bannerImage: true,
    },
    orderBy: { position: "asc" },
    take: 3,
  });

  // Transform products
  const products = collection.products.map(({ product }) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    basePrice: Number(product.basePrice),
    gender: product.gender,
    category: product.category,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
    })),
  }));

  return (
    <main className="h-screen overflow-hidden">
      <CollectionPageClient
        collection={{
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description,
          image: collection.image,
          bannerImage: collection.bannerImage,
          products,
        }}
        otherCollections={otherCollections}
      />
    </main>
  );
}
