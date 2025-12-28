import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve şifre gereklidir" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Find valid reset token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Geçersiz şifre sıfırlama linki" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: "Şifre sıfırlama linkinizin süresi dolmuş" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // TODO: Send password changed confirmation email
    console.log(`[EMAIL] Password changed confirmation would be sent to: ${user.email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Şifre güncelleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
