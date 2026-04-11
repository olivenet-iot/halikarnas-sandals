import { HeroV2 } from "@/components/home/HeroV2";
import { EditorialCategoryBlock } from "@/components/home/EditorialCategoryBlock";
import { SecimProductGrid } from "@/components/home/SecimProductGrid";
import { FullBleedEditorial } from "@/components/home/FullBleedEditorial";
import { BrandStoryTeaser } from "@/components/home/BrandStoryTeaser";

export default async function Home() {
  return (
    <div className="bg-v2-bg-primary">
      {/* 1. Hero — asymmetric, video-ready */}
      <HeroV2 />

      {/* 2. Editorial Category — 65/35 women/men */}
      <EditorialCategoryBlock />

      {/* 3. Seçki — featured product grid */}
      <SecimProductGrid />

      {/* 4. Full-bleed editorial — atelier ambiance */}
      <FullBleedEditorial />

      {/* 5. Brand story teaser — pure typography */}
      <BrandStoryTeaser />

      {/* 6. Footer (with newsletter) is in layout */}
    </div>
  );
}
