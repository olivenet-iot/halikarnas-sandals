import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isActive: z.boolean(),
});

// GET - List all pages
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const pages = await db.page.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Get pages error:", error);
    return NextResponse.json(
      { error: "Sayfalar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create page
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = pageSchema.parse(body);

    // Check if slug already exists
    const existing = await db.page.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const page = await db.page.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("Create page error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sayfa oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
