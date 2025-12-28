import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, gender: true, slug: true },
    }),
    db.collection.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün</h1>
        <p className="text-gray-500 mt-1">
          Yeni bir ürün oluşturun
        </p>
      </div>

      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
