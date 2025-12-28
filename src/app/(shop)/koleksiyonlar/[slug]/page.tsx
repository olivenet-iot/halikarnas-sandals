import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, getProductUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findUnique({
    where: { slug, isActive: true },
  });

  if (!collection) {
    return { title: "Koleksiyon Bulunamadi" };
  }

  return {
    title: `${collection.name} | Halikarnas Sandals`,
    description:
      collection.description ||
      `${collection.name} koleksiyonunu kesfedin.`,
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

  const products = collection.products.map(({ product }) => product);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="pt-16 pb-8 md:pt-24 md:pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] tracking-wide">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-4 text-[#1a1a1a]/70 text-base md:text-lg max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>
      </header>

      {/* Products Grid */}
      {products.length > 0 ? (
        <section className="px-4 md:px-8 lg:px-16 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={getProductUrl({
                    sku: product.sku || product.id,
                    gender: product.gender,
                    category: product.category,
                  })}
                  className="group block"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-[#f0efed]">
                    {product.images[0] ? (
                      <>
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {product.images[1] && (
                          <Image
                            src={product.images[1].url}
                            alt={product.name}
                            fill
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[#5C6B63]/10" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <h3 className="font-serif text-sm md:text-base text-[#1a1a1a]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#1a1a1a]/70">
                      {formatPrice(Number(product.basePrice))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24">
          <div className="text-center">
            <p className="text-[#1a1a1a]/60">
              Bu koleksiyonda henuz urun bulunmuyor.
            </p>
            <Link
              href="/koleksiyonlar"
              className="inline-block mt-6 text-[#5C6B63] hover:text-[#4a5850] transition-colors"
            >
              Tum Koleksiyonlar
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
