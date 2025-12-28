import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity, ActivityActions } from "@/lib/activity-logger";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates data" },
        { status: 400 }
      );
    }

    // Batch update with transaction
    await prisma.$transaction(
      updates.map((update: { id: string; stock: number }) =>
        prisma.productVariant.update({
          where: { id: update.id },
          data: { stock: update.stock },
        })
      )
    );

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.BULK_STOCK_UPDATE,
      details: `${updates.length} varyant stok güncellendi`,
      request,
    });

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error("Bulk stock update error:", error);
    return NextResponse.json(
      { error: "Stok güncelleme başarısız" },
      { status: 500 }
    );
  }
}
