import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { rateLimit, getClientIp, rateLimitResponseHeaders } from "@/lib/rate-limit";

const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO3Ql0R8c7kk7q8pQ5g8vL9.u0Kd0F1s.";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gereklidir" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase();

    try {
      const ipRl = await rateLimit({
        key: `forgot:ip:${ip}`,
        limit: 3,
        windowSeconds: 60 * 60,
      });
      if (!ipRl.success) {
        return NextResponse.json(
          { error: "Çok fazla şifre sıfırlama denemesi. Lütfen biraz sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(ipRl) }
        );
      }
      const emailRl = await rateLimit({
        key: `forgot:email:${normalizedEmail}`,
        limit: 3,
        windowSeconds: 60 * 60,
      });
      if (!emailRl.success) {
        return NextResponse.json(
          { error: "Çok fazla şifre sıfırlama denemesi. Lütfen biraz sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(emailRl) }
        );
      }
    } catch (err) {
      console.error("[rate-limit] fail-open forgot-password:", err);
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    await bcrypt.compare("dummy-constant-time-equalizer", user?.password ?? DUMMY_HASH);

    if (user) {
      await db.passwordResetToken.deleteMany({
        where: { email: normalizedEmail },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await db.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token,
          expires,
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/sifre-sifirla/${token}`;

      const emailTemplate = passwordResetEmail(user.name || "Değerli Müşterimiz", resetUrl);
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Şifre sıfırlama işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
