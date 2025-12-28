import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get user detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
            items: {
              select: { id: true },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Convert Decimal to number for JSON
    const serializedUser = {
      ...user,
      orders: user.orders.map((order) => ({
        ...order,
        total: Number(order.total),
      })),
    };

    return NextResponse.json({ user: serializedUser });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Kullanıcı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"]).optional(),
});

// PATCH - Update user role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    // Only SUPER_ADMIN can change roles
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Prevent changing own role
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Kendi rolünüzü değiştiremezsiniz" },
        { status: 400 }
      );
    }

    // Update user
    if (validatedData.role) {
      await db.user.update({
        where: { id },
        data: { role: validatedData.role },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
