import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - List all orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { shippingName: { contains: search, mode: "insensitive" } },
        { guestEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          items: {
            select: { id: true },
          },
        },
      }),
      db.order.count({ where }),
    ]);

    // Convert Decimal to number for JSON
    const serializedOrders = orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      tax: Number(order.tax),
      total: Number(order.total),
    }));

    return NextResponse.json({
      orders: serializedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Siparişler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
