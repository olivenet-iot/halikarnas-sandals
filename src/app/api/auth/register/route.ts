import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, acceptNewsletter } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Ad, e-posta ve şifre gereklidir" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Subscribe to newsletter if opted in
    if (acceptNewsletter) {
      await db.newsletterSubscriber.upsert({
        where: { email: email.toLowerCase() },
        update: { isActive: true },
        create: {
          email: email.toLowerCase(),
          name,
          source: "registration",
        },
      });
    }

    // Send welcome email
    const emailTemplate = welcomeEmail(user.name || "Değerli Müşterimiz");
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
