import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
import { contactNotificationEmail } from "@/lib/email-templates";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
  honeypot: z.string().max(0), // Spam prevention
});

// Simple rate limiting using Map (in production, use Redis)
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
        { error: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Honeypot check - if filled, it's a bot
    if (validatedData.honeypot) {
      // Silently succeed to not tip off bots
      return NextResponse.json({ success: true });
    }

    // Send email notification to admin
    const emailTemplate = contactNotificationEmail({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
