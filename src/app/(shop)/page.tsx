import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryCards } from "@/components/home/CategoryCards";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BestSellers } from "@/components/home/BestSellers";
import { CraftsmanshipMini } from "@/components/home/CraftsmanshipMini";
import { BrandPromise } from "@/components/home/BrandPromise";
import { Newsletter } from "@/components/home/Newsletter";

export default async function Home() {
  return (
    <div className="bg-luxury-cream">
      {/* 1. Hero - Full screen immersive */}
      <HeroSection />

      {/* 2. Featured Products - Seçtiklerimiz carousel */}
      <FeaturedProducts />

      {/* 3. Category Cards - Kadın/Erkek */}
      <CategoryCards />

      {/* 4. Featured Collection - Quote format */}
      <FeaturedCollection />

      {/* 5. Best Sellers - Featured products */}
      <BestSellers />

      {/* 6. Craftsmanship - Immersive story */}
      <CraftsmanshipMini />

      {/* 7. Brand Promise Strip */}
      <BrandPromise />

      {/* 8. Newsletter - Luxury minimal */}
      <Newsletter />
    </div>
  );
}
