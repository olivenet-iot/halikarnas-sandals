import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/email-templates";
import { rateLimit, getClientIp, rateLimitResponseHeaders } from "@/lib/rate-limit";
import { SUPPORT_EMAIL } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    try {
      const rl = await rateLimit({
        key: `reset:ip:${ip}`,
        limit: 10,
        windowSeconds: 60 * 60,
      });
      if (!rl.success) {
        return NextResponse.json(
          { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(rl) }
        );
      }
    } catch (err) {
      console.error("[rate-limit] fail-open reset-password:", err);
    }

    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve şifre gereklidir" },
        { status: 400 }
      );
    }

    if (password.length < 12) {
      return NextResponse.json(
        { error: "Şifre en az 12 karakter olmalıdır" },
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

    const confirmation = passwordChangedEmail(user.name || "Değerli Müşterimiz", SUPPORT_EMAIL);
    try {
      await sendEmail({
        to: user.email,
        subject: confirmation.subject,
        html: confirmation.html,
      });
    } catch (err) {
      console.error("[reset-password] confirmation email send failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Şifre güncelleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
