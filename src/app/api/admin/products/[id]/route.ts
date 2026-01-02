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
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  basePrice: z.coerce.number().min(0).optional(),
  compareAtPrice: z.coerce.number().optional().nullable(),
  categoryId: z.string().min(1).optional(),
  gender: z.enum(["KADIN", "ERKEK", "UNISEX"]).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  material: z.string().optional().nullable(),
  heelHeight: z.string().optional().nullable(),
  soleType: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  collectionIds: z.array(z.string()).optional(),
  variants: z.array(variantSchema).optional(),
  images: z.array(imageSchema).optional(),
});

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: { orderBy: { position: "asc" } },
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Ürün alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if product exists
    const existing = await db.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await db.product.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Update product with transaction
    const product = await db.$transaction(async (tx) => {
      // Update variants if provided (upsert pattern - siparişte kullanılanları koru)
      if (validatedData.variants) {
        // Mevcut variant ID'lerini al
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });
        const existingIds = existingVariants.map((v) => v.id);

        // Gelen variant'ları işle
        for (const variant of validatedData.variants) {
          if (variant.id && existingIds.includes(variant.id)) {
            // Mevcut variant - güncelle
            await tx.productVariant.update({
              where: { id: variant.id },
              data: {
                size: variant.size,
                color: variant.color || null,
                colorHex: variant.colorHex || null,
                stock: variant.stock,
                sku: variant.sku,
              },
            });
          } else if (!variant.id) {
            // Yeni variant - oluştur
            await tx.productVariant.create({
              data: {
                productId: id,
                size: variant.size,
                color: variant.color || null,
                colorHex: variant.colorHex || null,
                stock: variant.stock,
                sku: variant.sku,
              },
            });
          }
        }

        // Silinmesi gereken variant'ları kontrol et
        const incomingIds = validatedData.variants
          .filter((v) => v.id)
          .map((v) => v.id as string);
        const toDeleteIds = existingIds.filter((id) => !incomingIds.includes(id));

        for (const variantId of toDeleteIds) {
          // Siparişte kullanılıyor mu kontrol et
          const orderItemCount = await tx.orderItem.count({
            where: { variantId },
          });

          if (orderItemCount === 0) {
            // Siparişte kullanılmıyor - silebiliriz
            await tx.productVariant.delete({
              where: { id: variantId },
            });
          } else {
            // Siparişte kullanılıyor - stok'u 0 yap, silme
            await tx.productVariant.update({
              where: { id: variantId },
              data: { stock: 0 },
            });
          }
        }
      }

      // Update images if provided
      if (validatedData.images) {
        // Delete old images and create new ones
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: validatedData.images.map((img, index) => ({
            productId: id,
            url: img.url,
            alt: img.alt || null,
            color: img.color || null,
            position: img.position ?? index,
          })),
        });
      }

      // Update collections if provided
      if (validatedData.collectionIds !== undefined) {
        // Delete old collection associations and create new ones
        await tx.collectionProduct.deleteMany({ where: { productId: id } });
        if (validatedData.collectionIds.length > 0) {
          await tx.collectionProduct.createMany({
            data: validatedData.collectionIds.map((collectionId, index) => ({
              productId: id,
              collectionId,
              position: index,
            })),
          });
        }
      }

      // Update product
      return tx.product.update({
        where: { id },
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          shortDescription: validatedData.shortDescription,
          sku: validatedData.sku,
          basePrice: validatedData.basePrice,
          compareAtPrice: validatedData.compareAtPrice,
          categoryId: validatedData.categoryId,
          gender: validatedData.gender,
          status: validatedData.status,
          isFeatured: validatedData.isFeatured,
          isNew: validatedData.isNew,
          isBestSeller: validatedData.isBestSeller,
          material: validatedData.material,
          heelHeight: validatedData.heelHeight,
          soleType: validatedData.soleType,
          metaTitle: validatedData.metaTitle,
          metaDescription: validatedData.metaDescription,
        },
        include: {
          variants: true,
          images: { orderBy: { position: "asc" } },
          category: true,
          collections: { include: { collection: true } },
        },
      });
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (soft delete if used in orders)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Siparişte kullanılıyor mu kontrol et
    const orderItemCount = await db.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      // Siparişte kullanılıyorsa ARCHIVED yap (soft delete)
      await db.product.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });

      return NextResponse.json({
        success: true,
        message: `Bu ürün ${orderItemCount} siparişte kullanıldığı için arşivlendi.`,
        archived: true,
      });
    }

    // Siparişte kullanılmıyorsa tamamen sil
    await db.$transaction(async (tx) => {
      // İlişkili kayıtları sil
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.wishlistItem.deleteMany({ where: { productId: id } });
      await tx.collectionProduct.deleteMany({ where: { productId: id } });

      // CartItem'lar variant üzerinden bağlı, önce onları temizle
      const variants = await tx.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      if (variants.length > 0) {
        await tx.cartItem.deleteMany({
          where: { variantId: { in: variants.map((v) => v.id) } },
        });
      }

      // Variant'ları sil
      await tx.productVariant.deleteMany({ where: { productId: id } });

      // Ürünü sil
      await tx.product.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: "Ürün başarıyla silindi.",
      archived: false,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
