import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Minimal Header */}
      <header className="py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <Link
            href="/"
            className="text-heading-3 font-accent text-leather-800 tracking-wider"
          >
            HALIKARNAS
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 px-4 text-center">
        <p className="text-body-xs text-leather-400">
          &copy; {new Date().getFullYear()} Halikarnas Sandals. Tüm hakları
          saklıdır.
        </p>
      </footer>
    </div>
  );
}
