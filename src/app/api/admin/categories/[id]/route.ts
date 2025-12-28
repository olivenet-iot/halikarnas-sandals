import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli").optional(),
  slug: z.string().min(1, "Slug gerekli").optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  gender: z.enum(["KADIN", "ERKEK", "UNISEX"]).optional().nullable(),
});

// PATCH - Update category
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
    const validatedData = categorySchema.parse(body);

    // Check if category exists
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    // Check slug+gender uniqueness if changing
    const newSlug = validatedData.slug || existing.slug;
    const newGender = validatedData.gender !== undefined ? validatedData.gender : existing.gender;

    if (newSlug !== existing.slug || newGender !== existing.gender) {
      const slugExists = await db.category.findFirst({
        where: {
          slug: newSlug,
          gender: newGender,
          id: { not: id },
        },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug ve cinsiyet kombinasyonu zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const category = await db.category.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Update category error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kategori güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
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

    // Check if category exists and has products
    const existing = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: "Bu kategoride ürünler var. Önce ürünleri başka kategoriye taşıyın." },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Kategori silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
