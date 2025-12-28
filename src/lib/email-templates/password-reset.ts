export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: "Şifre Sıfırlama Talebi - Halikarnas Sandals",
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
          .button { display: inline-block; padding: 14px 30px; background: #1E5F74; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HALİKARNAS</h1>
          </div>
          <div class="content">
            <h2>Şifre Sıfırlama</h2>
            <p>Merhaba ${name},</p>
            <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>

            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
            </p>

            <div class="warning">
              <strong>⚠️ Önemli:</strong> Bu link 1 saat içinde geçerliliğini yitirecektir. Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
            </div>

            <p style="font-size: 12px; color: #888;">Link çalışmıyorsa, aşağıdaki URL'yi tarayıcınıza kopyalayın:<br>
            <span style="word-break: break-all;">${resetUrl}</span></p>
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
