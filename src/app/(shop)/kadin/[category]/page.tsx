import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CategoryPage } from "@/components/shop/CategoryPage";

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getCategory(slug: string) {
  try {
    const category = await prisma.category.findFirst({
      where: {
        slug,
        gender: "KADIN",
        isActive: true,
      },
    });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getProducts(categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        gender: { in: ["KADIN", "UNISEX"] },
        categoryId,
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 2,
        },
        variants: {
          where: { stock: { gt: 0 } },
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            stock: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || product.id,
      gender: product.gender,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt || undefined })),
      colors: Array.from(
        new Map(
          product.variants
            .filter((v) => v.colorHex)
            .map((v) => [v.colorHex, { name: v.color || "", hex: v.colorHex || "" }] as const)
        ).values()
      ),
      sizes: Array.from(new Set(product.variants.map((v) => v.size))),
      categorySlug: product.category?.slug || null,
      createdAt: product.createdAt.toISOString(),
      isNew: product.isNew,
      isSale: product.compareAtPrice ? Number(product.compareAtPrice) > Number(product.basePrice) : false,
      isBestseller: product.isBestSeller,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        gender: "KADIN",
        isActive: true,
      },
      orderBy: { position: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count.products,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    };
  }

  return {
    title: `Kadın ${category.name}`,
    description: category.description || `Premium el yapımı kadın ${category.name.toLowerCase()} koleksiyonu. Bodrum esintili tasarımlar.`,
  };
}

export default async function KadinCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProducts(category.id),
    getCategories(),
  ]);

  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Kadın", href: "/kadin" },
    { label: category.name, href: `/kadin/${category.slug}` },
  ];

  return (
    <CategoryPage
      title={`Kadın ${category.name}`}
      description={category.description || `Premium el yapımı kadın ${category.name.toLowerCase()} koleksiyonu.`}
      products={products}
      categories={categories}
      gender="women"
      breadcrumbs={breadcrumbs}
    />
  );
}
