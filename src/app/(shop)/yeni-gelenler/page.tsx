import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Yeni Gelenler | Halikarnas Sandals",
  description:
    "En son eklenen premium el yapımı hakiki deri sandaletler. Yeni tasarımlarımızı keşfedin.",
};

async function getNewArrivals() {
  try {
    // Son 30 gün
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { isNew: true },
          { createdAt: { gte: thirtyDaysAgo } },
        ],
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
      orderBy: [
        { isNew: "desc" },
        { createdAt: "desc" },
      ],
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
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export default async function YeniGelenlerPage() {
  const products = await getNewArrivals();

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Hero Header */}
      <div className="bg-white py-16 md:py-24">
        <div className="container-luxury text-center">
          <span className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
            <span className="w-8 h-px bg-luxury-gold/50" />
            Yeni Koleksiyon
            <span className="w-8 h-px bg-luxury-gold/50" />
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-primary mb-4">
            Yeni Gelenler
          </h1>
          <p className="text-luxury-charcoal/70 text-lg max-w-2xl mx-auto">
            En son eklenen premium el yapımı hakiki deri sandaletlerimizi keşfedin.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12 md:py-16">
        <div className="container-luxury">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-luxury-charcoal/60 text-lg">
                Henüz yeni ürün bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              {/* Product Count */}
              <div className="mb-8">
                <p className="text-luxury-charcoal/60 text-sm">
                  {products.length} ürün bulundu
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
