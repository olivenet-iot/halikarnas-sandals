import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  stock: z.coerce.number().min(0),
  sku: z.string().min(1),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: z.string().optional(),
  color: z.string().optional().nullable(),
  position: z.number().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  basePrice: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().optional().nullable(),
  categoryId: z.string().min(1, "Kategori gerekli"),
  gender: z.enum(["KADIN", "ERKEK", "UNISEX"]).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  material: z.string().optional(),
  heelHeight: z.string().optional(),
  soleType: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  collectionIds: z.array(z.string()).optional(),
  variants: z.array(variantSchema).min(1, "En az bir varyant gerekli"),
  images: z.array(imageSchema),
});

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { position: "asc" }, take: 1 },
          variants: { select: { id: true, stock: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Ürünler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check slug uniqueness
    const existingSlug = await db.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Check SKU uniqueness if provided
    if (validatedData.sku) {
      const existingSku = await db.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingSku) {
        return NextResponse.json(
          { error: `Bu SKU (${validatedData.sku}) zaten kullanılıyor. Lütfen farklı bir SKU girin.` },
          { status: 409 }
        );
      }
    }

    // Check variant SKU uniqueness
    const variantSkus = validatedData.variants.map(v => v.sku);
    const existingVariants = await db.productVariant.findMany({
      where: { sku: { in: variantSkus } },
      select: { sku: true },
    });

    if (existingVariants.length > 0) {
      const duplicateSkus = existingVariants.map(v => v.sku).join(', ');
      return NextResponse.json(
        { error: `Bu varyant SKU'ları zaten kullanılıyor: ${duplicateSkus}` },
        { status: 409 }
      );
    }

    // Create product with variants and images
    const product = await db.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription || null,
        sku: validatedData.sku || null,
        basePrice: validatedData.basePrice,
        compareAtPrice: validatedData.compareAtPrice || null,
        categoryId: validatedData.categoryId,
        gender: validatedData.gender || null,
        status: validatedData.status,
        isFeatured: validatedData.isFeatured,
        isNew: validatedData.isNew,
        isBestSeller: validatedData.isBestSeller,
        material: validatedData.material || null,
        heelHeight: validatedData.heelHeight || null,
        soleType: validatedData.soleType || null,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        variants: {
          create: validatedData.variants.map((v) => ({
            size: v.size,
            color: v.color || null,
            colorHex: v.colorHex || null,
            stock: v.stock,
            sku: v.sku,
          })),
        },
        images: {
          create: validatedData.images.map((img, index) => ({
            url: img.url,
            alt: img.alt || null,
            color: img.color || null,
            position: img.position ?? index,
          })),
        },
        collections: validatedData.collectionIds?.length
          ? {
              create: validatedData.collectionIds.map((collectionId, index) => ({
                collectionId,
                position: index,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
        images: true,
        category: true,
        collections: { include: { collection: true } },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    // Prisma unique constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (target?.includes('sku')) {
        return NextResponse.json(
          { error: 'Bu SKU zaten kullanılıyor. Lütfen farklı bir SKU girin.' },
          { status: 409 }
        );
      }
      if (target?.includes('slug')) {
        return NextResponse.json(
          { error: 'Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Bu değer zaten kullanılıyor.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Ürün oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
