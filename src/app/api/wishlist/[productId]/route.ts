import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ productId: string }>;
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { productId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Find and delete wishlist item
    const item = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Favori bulunamadı" },
        { status: 404 }
      );
    }

    await db.wishlistItem.delete({
      where: { id: item.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      { error: "Favorilerden kaldırılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
