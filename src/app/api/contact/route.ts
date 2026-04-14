import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
import { contactNotificationEmail } from "@/lib/email-templates";
import { rateLimit, getClientIp, rateLimitResponseHeaders } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
  honeypot: z.string().max(0), // Spam prevention
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    try {
      const rl = await rateLimit({
        key: `contact:ip:${ip}`,
        limit: 5,
        windowSeconds: 60 * 60,
      });
      if (!rl.success) {
        return NextResponse.json(
          { error: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(rl) }
        );
      }
    } catch (err) {
      console.error("[rate-limit] fail-open contact:", err);
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
