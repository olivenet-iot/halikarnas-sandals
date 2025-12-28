import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = passwordSchema.parse(body);

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Bu hesap için şifre değiştirme desteklenmiyor" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Mevcut şifre yanlış" },
        { status: 400 }
      );
    }

    // Check if new password is same as current
    const isSame = await bcrypt.compare(
      validatedData.newPassword,
      user.password
    );

    if (isSame) {
      return NextResponse.json(
        { error: "Yeni şifre mevcut şifre ile aynı olamaz" },
        { status: 400 }
      );
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);

    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Şifre değiştirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
