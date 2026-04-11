import { redirect } from "next/navigation";
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
    <div className="bg-v2-bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Mobile Menu Trigger */}
        <div className="mb-6 lg:hidden">
          <AccountMobileSidebar />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <AccountSidebar />
          </div>

          {/* Content */}
          <main className="lg:col-span-9 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
