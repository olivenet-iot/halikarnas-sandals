import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get banner detail
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

    const banner = await db.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Get banner error:", error);
    return NextResponse.json(
      { error: "Banner getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url().optional(),
  mobileImageUrl: z.string().url().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  position: z.string().min(1).optional(),
  sortOrder: z.coerce.number().min(0).optional(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// PATCH - Update banner
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
    const validatedData = updateSchema.parse(body);

    // Check if banner exists
    const existingBanner = await db.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner bulunamadı" }, { status: 404 });
    }

    const banner = await db.banner.update({
      where: { id },
      data: {
        title: validatedData.title,
        subtitle: validatedData.subtitle,
        imageUrl: validatedData.imageUrl,
        mobileImageUrl: validatedData.mobileImageUrl,
        linkUrl: validatedData.linkUrl,
        linkText: validatedData.linkText,
        position: validatedData.position,
        sortOrder: validatedData.sortOrder,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Update banner error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Banner güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner
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

    // Check if banner exists
    const existingBanner = await db.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner bulunamadı" }, { status: 404 });
    }

    await db.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "Banner silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
