import { SITE_URL } from "@/lib/config";

const BASE_URL = SITE_URL;

export function shippingNotificationEmail(
  customerName: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string,
  trackingToken: string
) {
  const trackingUrls: Record<string, string> = {
    MNG: `https://www.mngkargo.com.tr/takip?no=${trackingNumber}`,
    "MNG Kargo": `https://www.mngkargo.com.tr/takip?no=${trackingNumber}`,
    Yurtiçi: `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNumber}`,
    "Yurtiçi Kargo": `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNumber}`,
    Aras: `https://www.araskargo.com.tr/trmobile/gonderi/${trackingNumber}`,
    "Aras Kargo": `https://www.araskargo.com.tr/trmobile/gonderi/${trackingNumber}`,
    PTT: `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingNumber}`,
    "PTT Kargo": `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingNumber}`,
    UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    DHL: `https://www.dhl.com/tr-tr/home/tracking.html?tracking-id=${trackingNumber}`,
  };

  const trackingUrl = trackingUrls[carrier] || "#";

  return {
    subject: `Siparişiniz Kargoya Verildi! #${orderNumber}`,
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
          .content { padding: 30px; background: #fff; }
          .truck-icon { font-size: 48px; text-align: center; margin-bottom: 10px; }
          .tracking-box { background: #e8f5e9; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .tracking-number { font-size: 28px; font-weight: bold; color: #1E5F74; letter-spacing: 3px; margin: 15px 0; }
          .button { display: inline-block; padding: 14px 30px; background: #1E5F74; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
          .info-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <div class="truck-icon">🚚</div>
            <h2 style="text-align: center; margin-top: 0;">Kargonuz Yola Çıktı!</h2>
            <p>Merhaba ${customerName},</p>
            <p><strong>#${orderNumber}</strong> numaralı siparişiniz <strong>${carrier}</strong> ile yola çıktı!</p>

            <div class="tracking-box">
              <p style="margin: 0;">Kargo Takip Numaranız:</p>
              <p class="tracking-number">${trackingNumber}</p>
              <a href="${trackingUrl}" class="button">Kargonu Takip Et</a>
            </div>

            <div class="info-box">
              <p style="margin: 0;"><strong>Tahmini Teslimat:</strong> 1-3 iş günü</p>
              <p style="margin: 10px 0 0 0;">Teslimat sırasında evde olmamanız durumunda kargo görevlisi size ulaşacaktır.</p>
            </div>

            <p style="text-align: center;">
              <a href="${BASE_URL}/siparis/${trackingToken}" style="color: #1E5F74;">Siparişinizi Görüntüleyin →</a>
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
