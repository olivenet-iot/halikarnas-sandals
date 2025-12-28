import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { AccountSidebar, AccountMobileSidebar } from "@/components/account/AccountSidebar";

export default async function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris?callbackUrl=/hesabim");
  }

  return (
    <div className="bg-sand-50 min-h-screen">
      <div className="container-custom py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-leather-500 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-aegean-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-leather-800 font-medium">Hesabım</span>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="mb-4 lg:hidden">
          <AccountMobileSidebar />
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <AccountSidebar className="hidden lg:block" />

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
