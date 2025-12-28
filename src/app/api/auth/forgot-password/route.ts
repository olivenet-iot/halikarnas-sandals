import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gereklidir" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Delete any existing reset tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token
    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sifre-sifirla/${token}`;

    // Send password reset email
    const emailTemplate = passwordResetEmail(user.name || "Değerli Müşterimiz", resetUrl);
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Şifre sıfırlama işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
