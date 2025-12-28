import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url(),
  mobileImageUrl: z.string().url().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  position: z.string().min(1),
  sortOrder: z.coerce.number().min(0),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

// GET - List all banners
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const banners = await db.banner.findMany({
      orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "Bannerlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create banner
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bannerSchema.parse(body);

    const banner = await db.banner.create({
      data: {
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        imageUrl: validatedData.imageUrl,
        mobileImageUrl: validatedData.mobileImageUrl || null,
        linkUrl: validatedData.linkUrl || null,
        linkText: validatedData.linkText || null,
        position: validatedData.position,
        sortOrder: validatedData.sortOrder,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("Create banner error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Banner oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
