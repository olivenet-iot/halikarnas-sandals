import { prisma } from "@/lib/db";
import { NewArrivalsCarousel } from "./NewArrivalsCarousel";

function transformProduct(product: {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  basePrice: { toNumber(): number } | number;
  compareAtPrice: { toNumber(): number } | number | null;
  images: { url: string; alt: string | null }[];
  variants: { color: string | null; colorHex: string | null }[];
  category: { slug: string } | null;
  isNew: boolean;
  isBestSeller: boolean;
}) {
  const basePrice = typeof product.basePrice === 'number' ? product.basePrice : product.basePrice.toNumber();
  const compareAtPrice = product.compareAtPrice
    ? (typeof product.compareAtPrice === 'number' ? product.compareAtPrice : product.compareAtPrice.toNumber())
    : null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku || product.id,
    gender: product.gender,
    price: basePrice,
    compareAtPrice,
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
    isSale: compareAtPrice ? compareAtPrice > basePrice : false,
    isBestseller: product.isBestSeller,
  };
}

async function getNewArrivals() {
  try {
    const includeConfig = {
      images: {
        orderBy: { position: "asc" as const },
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
    };

    // 1. Önce isNew: true olanları al
    const featuredNew = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isNew: true,
      },
      include: includeConfig,
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    // 2. Yetmezse son eklenenlerle doldur
    if (featuredNew.length < 8) {
      const remaining = 8 - featuredNew.length;
      const featuredIds = featuredNew.map((p) => p.id);

      const recentProducts = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          id: { notIn: featuredIds },
        },
        include: includeConfig,
        take: remaining,
        orderBy: { createdAt: "desc" },
      });

      return [...featuredNew, ...recentProducts].map(transformProduct);
    }

    return featuredNew.map(transformProduct);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export async function NewArrivals() {
  const products = await getNewArrivals();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
            <span className="w-8 h-px bg-luxury-gold/50" />
            Yeni Gelenler
            <span className="w-8 h-px bg-luxury-gold/50" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-primary">
            Son Eklenenler
          </h2>
        </div>

        {/* Carousel */}
        <NewArrivalsCarousel products={products} />
      </div>
    </section>
  );
}
