const BASE_URL = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

export function welcomeEmail(name: string) {
  return {
    subject: "Halikarnas Ailesine Hoş Geldiniz!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #4A3728; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #1E5F74, #2980b9); border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 2px; }
          .content { padding: 30px; background: #fff; }
          .button { display: inline-block; padding: 14px 30px; background: #1E5F74; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
          .coupon-box { background: linear-gradient(135deg, #D4B896, #C17E61); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .coupon-code { font-size: 24px; font-weight: bold; color: white; letter-spacing: 3px; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <h2>Hoş Geldiniz, ${name}!</h2>
            <p>Halikarnas Sandals ailesine katıldığınız için teşekkür ederiz.</p>
            <p>Bodrum'un antik mirası Halikarnas'tan ilham alan, hakiki deriden el yapımı sandaletlerimizi keşfetmeye hazır mısınız?</p>

            <div class="coupon-box">
              <p style="color: white; margin: 0 0 10px 0;">İlk siparişinizde %10 indirim için:</p>
              <p class="coupon-code">HOSGELDIN</p>
            </div>

            <p style="text-align: center;">
              <a href="${BASE_URL}" class="button">Alışverişe Başla</a>
            </p>

            <p>Sorularınız için bize ulaşın: info@halikarnassandals.com</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Halikarnas Sandals. Tüm hakları saklıdır.</p>
            <p>Bodrum, Muğla, Türkiye</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
