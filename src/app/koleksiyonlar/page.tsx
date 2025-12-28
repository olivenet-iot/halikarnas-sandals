import { Metadata } from "next";
import { db } from "@/lib/db";
import { CinematicScroll } from "@/components/shop/CinematicScroll";

export const metadata: Metadata = {
  title: "Koleksiyonlar | Halikarnas Sandals",
  description:
    "Halikarnas el yapimi deri sandalet koleksiyonlarini kesfedin. Her biri Ege'nin ruhunu tasiyan benzersiz tasarimlar.",
};

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    where: { isActive: true },
    orderBy: [
      { isFeatured: "desc" },
      { position: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      bannerImage: true,
      isFeatured: true,
      position: true,
    },
  });

  return <CinematicScroll collections={collections} />;
}
