export function passwordChangedEmail(name: string, supportEmail: string) {
  return {
    subject: "Şifreniz Değiştirildi - Halikarnas Sandals",
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
          .alert { background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
          a { color: #1E5F74; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <h2>Şifreniz Değiştirildi</h2>
            <p>Merhaba ${name},</p>
            <p>Halikarnas Sandals hesabınızın şifresi az önce başarıyla değiştirildi.</p>
            <p>Eğer bu işlemi siz yaptıysanız bu emaili yok sayabilirsiniz.</p>
            <div class="alert">
              <strong>Bu işlemi siz yapmadıysanız</strong>, hesabınızın güvenliği tehlikede olabilir. Lütfen hemen
              <a href="mailto:${supportEmail}">${supportEmail}</a> adresinden bizimle iletişime geçin.
            </div>
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
