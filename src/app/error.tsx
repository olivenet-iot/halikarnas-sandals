"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Error Visual */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-leather-900 mb-3">
          Bir Hata Oluştu
        </h1>
        <p className="text-leather-600 mb-8">
          Üzgünüz, beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya
          anasayfaya dönün.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Hata Kodu: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Anasayfa
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-leather-500 mb-2">
            Sorun devam ederse bizimle iletişime geçin
          </p>
          <a
            href="mailto:destek@halikarnassandals.com"
            className="text-sm text-aegean-600 hover:underline"
          >
            destek@halikarnassandals.com
          </a>
        </div>
      </div>
    </div>
  );
}
