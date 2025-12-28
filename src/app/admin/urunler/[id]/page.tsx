import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: { orderBy: { position: "asc" } },
        collections: {
          include: { collection: { select: { id: true } } },
        },
      },
    }),
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

  if (!product) {
    notFound();
  }

  // Transform for form
  const formProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    sku: product.sku || "",
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    categoryId: product.categoryId,
    // Gender is required in form, fallback to KADIN if null
    gender: product.gender ?? "KADIN" as const,
    status: product.status,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    material: product.material || "",
    heelHeight: product.heelHeight || "",
    soleType: product.soleType || "",
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
    collectionIds: product.collections.map((c) => c.collection.id),
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color || "",
      colorHex: v.colorHex || "",
      stock: v.stock,
      sku: v.sku,
    })),
    images: product.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt || "",
      color: i.color || null,
      position: i.position,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ürünü Düzenle</h1>
        <p className="text-gray-500 mt-1">{product.name}</p>
      </div>

      <ProductForm
        product={formProduct}
        categories={categories}
        collections={collections}
      />
    </div>
  );
}
