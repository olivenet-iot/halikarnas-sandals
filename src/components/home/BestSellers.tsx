import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

async function getBestSellers() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isBestSeller: true,
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 2,
        },
        variants: {
          where: { stock: { gt: 0 } },
          select: {
            color: true,
            colorHex: true,
          },
        },
        category: true,
      },
      take: 4,
      orderBy: { soldCount: "desc" },
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
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

export async function BestSellers() {
  const products = await getBestSellers();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-luxury-cream">
      <div className="container-luxury">
        {/* Header - Luxury centered */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
            <span className="w-8 h-px bg-luxury-gold/50" />
            Seçkin Koleksiyon
            <span className="w-8 h-px bg-luxury-gold/50" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-primary">
            En Çok Tercih Edilenler
          </h2>
        </div>

        {/* Products Grid - 4 column with larger gaps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View all link - Luxury minimal */}
        <div className="mt-16 text-center">
          <Link
            href="/koleksiyonlar/en-cok-satanlar"
            className="group inline-flex items-center gap-3 text-luxury-primary text-sm tracking-[0.15em] uppercase font-medium hover:text-luxury-gold transition-colors duration-300"
          >
            Tüm Koleksiyonu Keşfet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
