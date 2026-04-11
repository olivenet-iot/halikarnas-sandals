import { PrismaClient, Gender } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const newCategories = [
  // Kadın kategorileri
  {
    name: "Bodrum Sandalet",
    slug: "bodrum-sandalet",
    gender: Gender.KADIN,
    description: "El yapımı hakiki deri Bodrum sandaletleri",
    position: 1,
  },
  {
    name: "Bodrum Terlik",
    slug: "bodrum-terlik",
    gender: Gender.KADIN,
    description: "Rahat ve şık Bodrum terlikleri",
    position: 2,
  },
  {
    name: "Takunyalar",
    slug: "takunyalar",
    gender: Gender.KADIN,
    description: "Geleneksel el yapımı takunyalar",
    position: 3,
  },
  // Erkek kategorileri
  {
    name: "Bodrum Sandalet",
    slug: "bodrum-sandalet",
    gender: Gender.ERKEK,
    description: "El yapımı hakiki deri erkek Bodrum sandaletleri",
    position: 1,
  },
  {
    name: "Bodrum Terlik",
    slug: "bodrum-terlik",
    gender: Gender.ERKEK,
    description: "Erkek Bodrum terlikleri",
    position: 2,
  },
];

async function main() {
  console.log("🌱 Kategori seed başlıyor...\n");

  // 1. Önce ürünlere bağlı verileri sil
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  console.log("✓ Ürün bağlantılı veriler silindi");

  // 2. Ürünleri sil
  const productDeleteResult = await prisma.product.deleteMany();
  console.log(`✓ ${productDeleteResult.count} ürün silindi`);

  // 3. Kategorileri sil
  const deleteResult = await prisma.category.deleteMany();
  console.log(`✓ ${deleteResult.count} eski kategori silindi`);

  // 2. Yeni kategorileri ekle
  for (const cat of newCategories) {
    await prisma.category.create({
      data: {
        ...cat,
        isActive: true,
      },
    });
    console.log(`✓ ${cat.gender} - ${cat.name} eklendi`);
  }

  // 3. Sonuçları göster
  const categories = await prisma.category.findMany({
    orderBy: [{ gender: "asc" }, { position: "asc" }],
  });

  console.log("\n📋 Oluşturulan kategoriler:");
  console.table(
    categories.map((c) => ({
      id: c.id.substring(0, 8) + "...",
      name: c.name,
      slug: c.slug,
      gender: c.gender,
    }))
  );

  console.log("\n✅ Kategori seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
