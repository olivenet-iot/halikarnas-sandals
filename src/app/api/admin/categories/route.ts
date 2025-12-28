import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().optional(),
  image: z.string().optional(),
  gender: z.enum(["KADIN", "ERKEK", "UNISEX"]).optional().nullable(),
});

// GET - List all categories
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Kategoriler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check slug+gender uniqueness
    const existing = await db.category.findFirst({
      where: {
        slug: validatedData.slug,
        gender: validatedData.gender || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug ve cinsiyet kombinasyonu zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        gender: validatedData.gender || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kategori oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
