export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactNotificationEmail(data: ContactFormData) {
  return {
    subject: `[İletişim Formu] ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
          .header { background: #1E5F74; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 12px; border: 1px solid #ddd; }
          .label { font-weight: bold; background: #f9f9f9; width: 30%; }
          .message-content { white-space: pre-wrap; }
          .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">Yeni İletişim Formu Mesajı</h2>
          </div>
          <div class="content">
            <table>
              <tr>
                <td class="label">Ad Soyad:</td>
                <td>${data.name}</td>
              </tr>
              <tr>
                <td class="label">E-posta:</td>
                <td><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td class="label">Konu:</td>
                <td>${data.subject}</td>
              </tr>
              <tr>
                <td class="label">Mesaj:</td>
                <td class="message-content">${data.message}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p>Bu mesaj halikarnassandals.com iletişim formundan gönderildi.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
