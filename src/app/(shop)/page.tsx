import { HeroSection } from "@/components/home/HeroSection";
import { BrandPromise } from "@/components/home/BrandPromise";
import { BestSellers } from "@/components/home/BestSellers";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CraftsmanshipMini } from "@/components/home/CraftsmanshipMini";
import { Newsletter } from "@/components/home/Newsletter";

export default async function Home() {
  return (
    <div className="bg-luxury-cream">
      {/* 1. Hero - Full screen immersive */}
      <HeroSection />

      {/* 2. Brand Promise Strip - Right after hero */}
      <BrandPromise />

      {/* 3. Best Sellers - Featured products */}
      <BestSellers />

      {/* 4. Featured Categories - Editorial layout */}
      <FeaturedCategories />

      {/* 5. Craftsmanship - Immersive story */}
      <CraftsmanshipMini />

      {/* 6. Newsletter - Luxury minimal */}
      <Newsletter />
    </div>
  );
}
