import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

// Simple rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = schema.parse(body);

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: true,
          message: "Bu e-posta adresi zaten kayıtlı.",
        });
      } else {
        // Reactivate subscription
        await db.newsletterSubscriber.update({
          where: { email: email.toLowerCase() },
          data: { isActive: true },
        });
      }
    } else {
      // Create new subscription
      await db.newsletterSubscriber.create({
        data: {
          email: email.toLowerCase(),
          source: "website",
        },
      });
    }

    // Send welcome email
    const emailTemplate = newsletterWelcomeEmail(email);
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      message: "Bültene başarıyla kaydoldunuz!",
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
