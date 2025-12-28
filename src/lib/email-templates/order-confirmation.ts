const BASE_URL = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  items: { name: string; variant: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    district: string;
  };
  paymentMethod: string;
}

export function orderConfirmationEmail(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name} <span style="color: #888;">(${item.variant})</span></td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₺${item.price.toLocaleString("tr-TR")}</td>
    </tr>
  `
    )
    .join("");

  return {
    subject: `Siparişiniz Alındı - #${data.orderNumber}`,
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
          .success-icon { font-size: 48px; text-align: center; margin-bottom: 10px; }
          .order-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { font-weight: bold; font-size: 18px; background: #f0f0f0; }
          .button { display: inline-block; padding: 12px 24px; background: #1E5F74; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <h2 style="text-align: center; margin-top: 0;">Siparişiniz Alındı!</h2>
            <p style="text-align: center;">Merhaba ${data.customerName}, siparişiniz başarıyla oluşturuldu.</p>

            <div class="order-box">
              <p style="margin: 0;"><strong>Sipariş No:</strong> ${data.orderNumber}</p>
              <p style="margin: 10px 0 0 0;"><strong>Ödeme:</strong> ${data.paymentMethod}</p>
            </div>

            <h3>Sipariş Detayları</h3>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 12px; text-align: left;">Ürün</th>
                  <th style="padding: 12px; text-align: center;">Adet</th>
                  <th style="padding: 12px; text-align: right;">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right;">Ara Toplam:</td>
                  <td style="padding: 12px; text-align: right;">₺${data.subtotal.toLocaleString("tr-TR")}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right;">Kargo:</td>
                  <td style="padding: 12px; text-align: right;">${data.shipping === 0 ? "Ücretsiz" : "₺" + data.shipping.toLocaleString("tr-TR")}</td>
                </tr>
                ${
                  data.discount > 0
                    ? `
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; color: #22c55e;">İndirim:</td>
                  <td style="padding: 12px; text-align: right; color: #22c55e;">-₺${data.discount.toLocaleString("tr-TR")}</td>
                </tr>
                `
                    : ""
                }
                <tr class="total-row">
                  <td colspan="2" style="padding: 12px; text-align: right;">TOPLAM:</td>
                  <td style="padding: 12px; text-align: right;">₺${data.total.toLocaleString("tr-TR")}</td>
                </tr>
              </tfoot>
            </table>

            <div class="order-box">
              <h4 style="margin-top: 0;">Teslimat Adresi</h4>
              <p style="margin: 0;">${data.shippingAddress.address}<br>
              ${data.shippingAddress.district} / ${data.shippingAddress.city}</p>
            </div>

            <p style="text-align: center;">
              <a href="${BASE_URL}/hesabim/siparislerim" class="button">Siparişinizi Takip Edin</a>
            </p>
          </div>
          <div class="footer">
            <p>Tahmini teslimat: 3-5 iş günü</p>
            <p>&copy; 2024 Halikarnas Sandals</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
