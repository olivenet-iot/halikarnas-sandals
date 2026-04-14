import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { z } from "zod";
import { rateLimit, getClientIp, rateLimitResponseHeaders } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    try {
      const rl = await rateLimit({
        key: `newsletter:ip:${ip}`,
        limit: 5,
        windowSeconds: 60 * 60,
      });
      if (!rl.success) {
        return NextResponse.json(
          { error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: rateLimitResponseHeaders(rl) }
        );
      }
    } catch (err) {
      console.error("[rate-limit] fail-open newsletter:", err);
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
