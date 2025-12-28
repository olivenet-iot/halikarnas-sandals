import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Koleksiyonlar | Halikarnas Sandals",
  description:
    "El yapimi deri sandalet koleksiyonlarimizi kesfedin.",
};

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-center text-[#1a1a1a] tracking-wide">
          Koleksiyonlar
        </h1>
      </header>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <section className="px-4 md:px-8 lg:px-16 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/koleksiyonlar/${collection.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-[#f0efed]">
                    {collection.image ? (
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#5C6B63]/10" />
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="mt-5 font-serif text-lg md:text-xl text-[#1a1a1a] tracking-wide">
                    {collection.name}
                  </h2>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24">
          <p className="text-center text-[#1a1a1a]/60">
            Henuz koleksiyon eklenmemis.
          </p>
        </section>
      )}
    </main>
  );
}
