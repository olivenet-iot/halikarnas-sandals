import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get page detail
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

    const page = await db.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Get page error:", error);
    return NextResponse.json(
      { error: "Sayfa getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  content: z.string().min(1).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// PATCH - Update page
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

    // Check if page exists
    const existingPage = await db.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    // Check if new slug already exists
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugExists = await db.page.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const page = await db.page.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Update page error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sayfa güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete page
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

    // Check if page exists
    const existingPage = await db.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    await db.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete page error:", error);
    return NextResponse.json(
      { error: "Sayfa silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
