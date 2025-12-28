import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  phone: z.string().optional(),
  // Note: email is not editable
});

// GET - Get user profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Profil bilgileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        phone: validatedData.phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Profil güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
