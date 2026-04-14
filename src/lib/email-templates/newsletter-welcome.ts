import { SITE_URL } from "@/lib/config";

const BASE_URL = SITE_URL;

export function newsletterWelcomeEmail(email: string) {
  return {
    subject: "Bültene Hoş Geldiniz! %10 İndirim Kodunuz",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #4A3728; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: #1E5F74; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 2px; }
          .content { padding: 30px; background: #fff; text-align: center; }
          .gift-icon { font-size: 48px; margin-bottom: 10px; }
          .coupon-box { background: linear-gradient(135deg, #D4B896, #C17E61); padding: 30px; border-radius: 10px; margin: 25px 0; }
          .coupon-label { color: white; margin: 0 0 10px 0; font-size: 16px; }
          .coupon-code { font-size: 36px; font-weight: bold; color: white; letter-spacing: 5px; margin: 10px 0; }
          .coupon-discount { color: white; margin: 10px 0 0 0; font-size: 18px; }
          .button { display: inline-block; padding: 14px 30px; background: #1E5F74; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
          .benefits { text-align: left; background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefits ul { margin: 0; padding-left: 20px; }
          .benefits li { margin: 8px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <div class="gift-icon">🎁</div>
            <h2 style="margin-top: 0;">Bültene Hoş Geldiniz!</h2>
            <p>Artık yeni koleksiyonlardan, özel indirimlerden ve kampanyalardan ilk siz haberdar olacaksınız.</p>

            <div class="coupon-box">
              <p class="coupon-label">İlk Alışverişinize Özel</p>
              <p class="coupon-code">BULTEN10</p>
              <p class="coupon-discount">%10 İndirim</p>
            </div>

            <div class="benefits">
              <strong>Bülten abonesi olarak:</strong>
              <ul>
                <li>Yeni koleksiyonlardan ilk siz haberdar olun</li>
                <li>Özel indirim ve kampanyalara erişin</li>
                <li>Sezonluk trendleri kaçırmayın</li>
              </ul>
            </div>

            <a href="${BASE_URL}" class="button">Alışverişe Başla</a>

            <p style="font-size: 12px; color: #888; margin-top: 30px;">
              Bu e-postayı almak istemiyorsanız <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #888;">buraya tıklayarak</a> abonelikten çıkabilirsiniz.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Halikarnas Sandals</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
