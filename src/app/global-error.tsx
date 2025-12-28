"use client";

import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center max-w-lg">
            {/* Error Visual */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Kritik Bir Hata Oluştu
            </h1>
            <p className="text-gray-600 mb-8">
              Üzgünüz, uygulama yüklenirken bir hata oluştu. Lütfen sayfayı
              yenilemeyi deneyin.
            </p>

            {/* Actions */}
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sayfayı Yenile
            </button>

            {/* Error Code */}
            {error.digest && (
              <p className="mt-8 text-xs text-gray-400">
                Hata Kodu: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
