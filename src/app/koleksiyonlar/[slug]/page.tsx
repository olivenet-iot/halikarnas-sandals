import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, getProductUrl } from "@/lib/utils";
import { getCollectionHeroUrl, getProductImageUrl } from "@/lib/cloudinary";

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

  const heroImage = collection.bannerImage || collection.image;
  const products = collection.products.map(({ product }) => product);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={getCollectionHeroUrl(heroImage)}
              alt={collection.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            /* Premium fallback */
            <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          {/* Title */}
          <div className="w-12 h-[1px] bg-[#B8860B] mb-6" />
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-wide max-w-4xl"
            style={{
              textShadow:
                "0 0 40px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {collection.name}
          </h1>
          <p className="mt-6 text-white/70 text-sm uppercase tracking-widest">
            {products.length} Urun
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* COLLECTION STORY */}
      {collection.description && (
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="font-serif text-xl md:text-2xl text-stone-600 leading-relaxed italic">
              &ldquo;{collection.description}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* PRODUCTS SHOWROOM */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gold Divider - Daha belirgin */}
          <div className="flex justify-center mb-16">
            <div className="w-20 h-[2px] bg-[#B8860B]" />
          </div>

          {products.length > 0 ? (
            /* Flexbox ile gercek centering */
            <div className="flex flex-wrap justify-center gap-12 md:gap-16">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={getProductUrl({
                    sku: product.sku || product.id,
                    gender: product.gender,
                    category: product.category,
                  })}
                  className="group block w-[280px] md:w-[350px] lg:w-[400px]"
                >
                  {/* Product Image - shadow eklendi */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 shadow-sm">
                    {product.images[0] ? (
                      <>
                        <Image
                          src={getProductImageUrl(product.images[0].url)}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105"
                          sizes="400px"
                        />
                        {product.images[1] && (
                          <Image
                            src={getProductImageUrl(product.images[1].url)}
                            alt={product.name}
                            fill
                            className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
                            sizes="400px"
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-stone-200" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-[#B8860B] transition-colors duration-300 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-stone-500 tracking-wider">
                      {formatPrice(Number(product.basePrice))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">
                Bu koleksiyonda henuz urun bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BACK NAVIGATION */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link
            href="/koleksiyonlar"
            className="inline-flex items-center gap-3 text-stone-400 hover:text-[#B8860B] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2" />
            <span className="text-sm uppercase tracking-[0.2em] font-medium">
              Tum Koleksiyonlar
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
