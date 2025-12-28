import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const collectionSchema = z.object({
  name: z.string().min(1, "Koleksiyon adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET - List all collections
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const collections = await db.collection.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Get collections error:", error);
    return NextResponse.json(
      { error: "Koleksiyonlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create collection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = collectionSchema.parse(body);

    // Check slug uniqueness
    const existing = await db.collection.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const collection = await db.collection.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        isActive: validatedData.isActive ?? true,
      },
    });

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    console.error("Create collection error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Koleksiyon oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
