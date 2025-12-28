import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-[120px] md:text-[180px] font-bold text-sand-200 leading-none select-none">
            404
          </div>
          <div className="relative -mt-16 md:-mt-20">
            <div className="w-32 h-32 mx-auto rounded-full bg-sand-100 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-sand-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Sandal icon */}
                <path d="M4 18c0-1 1-2 3-2h10c2 0 3 1 3 2v2H4v-2z" />
                <path d="M7 16V8c0-2 1-4 5-4s5 2 5 4v8" />
                <path d="M9 12h6" />
                <path d="M9 9h6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-leather-900 mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-leather-600 mb-8">
          Aradığınız sayfa taşınmış veya silinmiş olabilir.
          Anasayfaya dönebilir veya arama yapabilirsiniz.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Anasayfa
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/arama">
              <Search className="mr-2 h-4 w-4" />
              Ürün Ara
            </Link>
          </Button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-leather-500 mb-4">Popüler Sayfalar</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/kadin"
              className="px-3 py-1.5 text-sm bg-sand-100 text-leather-700 rounded-full hover:bg-sand-200 transition-colors"
            >
              Kadın
            </Link>
            <Link
              href="/erkek"
              className="px-3 py-1.5 text-sm bg-sand-100 text-leather-700 rounded-full hover:bg-sand-200 transition-colors"
            >
              Erkek
            </Link>
            <Link
              href="/koleksiyonlar"
              className="px-3 py-1.5 text-sm bg-sand-100 text-leather-700 rounded-full hover:bg-sand-200 transition-colors"
            >
              Koleksiyonlar
            </Link>
            <Link
              href="/yeni-gelenler"
              className="px-3 py-1.5 text-sm bg-sand-100 text-leather-700 rounded-full hover:bg-sand-200 transition-colors"
            >
              Yeni Gelenler
            </Link>
            <Link
              href="/iletisim"
              className="px-3 py-1.5 text-sm bg-sand-100 text-leather-700 rounded-full hover:bg-sand-200 transition-colors"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
