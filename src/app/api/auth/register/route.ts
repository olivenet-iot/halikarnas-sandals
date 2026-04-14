import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";
import { rateLimit, getClientIp, rateLimitResponseHeaders } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır").max(100, "Ad en fazla 100 karakter olabilir"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(12, "Şifre en az 12 karakter olmalıdır"),
  acceptNewsletter: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    try {
      const rl = await rateLimit({
        key: `register:ip:${ip}`,
        limit: 5,
        windowSeconds: 60 * 60,
      });
      if (!rl.success) {
        return NextResponse.json(
          { error: "Çok fazla kayıt denemesi. Lütfen biraz sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(rl) }
        );
      }
    } catch (err) {
      console.error("[rate-limit] fail-open register:", err);
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    const { name, password, acceptNewsletter } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (acceptNewsletter) {
      await db.newsletterSubscriber.upsert({
        where: { email },
        update: { isActive: true },
        create: {
          email,
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
