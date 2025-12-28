import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const collectionSchema = z.object({
  name: z.string().min(1, "Koleksiyon adı gerekli").optional(),
  slug: z.string().min(1, "Slug gerekli").optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  position: z.number().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// PATCH - Update collection
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
    const validatedData = collectionSchema.parse(body);

    // Check if collection exists
    const existing = await db.collection.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Koleksiyon bulunamadı" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await db.collection.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const collection = await db.collection.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ collection });
  } catch (error) {
    console.error("Update collection error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Koleksiyon güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete collection
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

    // Check if collection exists
    const existing = await db.collection.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Koleksiyon bulunamadı" }, { status: 404 });
    }

    // Delete collection (CollectionProduct entries will be cascade deleted)
    await db.collection.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete collection error:", error);
    return NextResponse.json(
      { error: "Koleksiyon silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
