import Image from "next/image";
import { prisma } from "@/lib/db";

async function getFeaturedCollection() {
  try {
    const collection = await prisma.collection.findFirst({
      where: {
        isActive: true,
        isFeatured: true,
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
    });

    return collection;
  } catch (error) {
    console.error("Error fetching featured collection:", error);
    return null;
  }
}

export async function FeaturedCollection() {
  const collection = await getFeaturedCollection();

  if (!collection || !collection.description) {
    return null;
  }

  return (
    <section className="bg-white overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[60vh]">
        {/* Left - Large Image */}
        <div className="relative h-[40vh] md:h-auto order-1 md:order-1">
          <Image
            src={collection.bannerImage || collection.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
        </div>

        {/* Right - Quote Format */}
        <div className="flex items-center justify-center order-2 md:order-2 bg-luxury-cream">
          <div className="px-8 py-16 md:px-12 lg:px-20 text-center max-w-lg">
            {/* Top Gold Divider */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className="w-12 h-px bg-luxury-gold/40" />
              <span className="text-luxury-gold text-lg">&#10022;</span>
              <span className="w-12 h-px bg-luxury-gold/40" />
            </div>

            {/* Quote - Collection Description */}
            <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-luxury-charcoal/80 italic leading-relaxed mb-10">
              &ldquo;{collection.description}&rdquo;
            </blockquote>

            {/* Attribution */}
            <p className="text-xs tracking-[0.25em] uppercase text-luxury-charcoal/40 font-medium">
              &mdash; Halikarnas Atölyesi
            </p>

            {/* Bottom Gold Divider */}
            <div className="flex items-center justify-center gap-3 mt-12">
              <span className="w-12 h-px bg-luxury-gold/40" />
              <span className="text-luxury-gold text-lg">&#10022;</span>
              <span className="w-12 h-px bg-luxury-gold/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
