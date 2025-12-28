import { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

export function generateMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes("Halikarnas")
    ? title
    : `${title} | Halikarnas Sandals`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Halikarnas Sandals",
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export interface ProductMetaData {
  name: string;
  description: string;
  slug: string;
  images: { url: string }[];
  basePrice: number;
  salePrice?: number | null;
}

export function generateProductMetadata(product: ProductMetaData): Metadata {
  const price = product.salePrice || product.basePrice;
  const description = product.description.substring(0, 160);

  return {
    ...generateMetadata({
      title: product.name,
      description,
      image: product.images[0]?.url,
      path: `/urun/${product.slug}`,
    }),
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "TRY",
    },
  };
}

export interface CategoryMetaData {
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
}

export function generateCategoryMetadata(category: CategoryMetaData): Metadata {
  const description =
    category.description ||
    `${category.name} kategorisindeki el yapımı deri sandaletleri keşfedin. Halikarnas Sandals'ta en kaliteli ${category.name.toLowerCase()} modelleri.`;

  return generateMetadata({
    title: category.name,
    description: description.substring(0, 160),
    image: category.image || undefined,
    path: `/kategori/${category.slug}`,
  });
}

export interface CollectionMetaData {
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
}

export function generateCollectionMetadata(collection: CollectionMetaData): Metadata {
  const description =
    collection.description ||
    `${collection.name} koleksiyonunu keşfedin. Halikarnas Sandals'tan özel tasarım el yapımı deri sandaletler.`;

  return generateMetadata({
    title: collection.name,
    description: description.substring(0, 160),
    image: collection.image || undefined,
    path: `/koleksiyonlar/${collection.slug}`,
  });
}
