import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export const FROM_EMAIL =
  "Halikarnas Sandals <info@halikarnassandals.com>";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "info@halikarnassandals.com";

// Development'ta console.log, production'da gerçek email
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  // In development or when no API key is set, just log the email
  if (process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY) {
    console.log("📧 EMAIL PREVIEW:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html.substring(0, 500) + "...");
    return { success: true, messageId: "dev-" + Date.now() };
  }

  try {
    const resend = getResend();
    if (!resend) {
      console.warn("Resend not initialized - email not sent");
      return { success: false, error: "Email service not configured" };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("Email send error:", result.error);
      return { success: false, error: result.error };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
