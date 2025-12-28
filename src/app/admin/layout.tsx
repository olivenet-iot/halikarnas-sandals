import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double-check admin access (middleware should handle this, but extra safety)
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/giris");
  }

  // Get pending orders count for sidebar badge
  const pendingOrdersCount = await db.order.count({
    where: {
      status: "PENDING",
    },
  });

  return (
    <AdminShell pendingOrdersCount={pendingOrdersCount}>
      {children}
    </AdminShell>
  );
}
