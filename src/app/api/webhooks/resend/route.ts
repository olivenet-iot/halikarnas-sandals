import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: { type?: string; data?: { to?: string[]; email_id?: string } };
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, headers) as typeof event;
  } catch (err) {
    console.warn("[resend-webhook] invalid signature:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = event.type ?? "unknown";
  const recipient = event.data?.to?.[0] ?? "unknown";

  if (eventType === "email.bounced" || eventType === "email.complained") {
    // Launch sonrası: bounced/complained kayıtlarını DB'ye yaz, admin paneline göster.
    console.warn(`[resend-webhook] ${eventType}: ${recipient}`);
  }

  return NextResponse.json({ received: true });
}
