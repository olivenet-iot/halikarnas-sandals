import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const trackOrderSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  orderNumber: z.string().min(1, "Siparis numarasi gerekli"),
});

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Cok fazla istek gonderdiniz. Lutfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = trackOrderSchema.parse(body);

    // Find order by order number
    const order = await db.order.findUnique({
      where: { orderNumber: validated.orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Siparis bulunamadi. Lutfen bilgilerinizi kontrol edin." },
        { status: 404 }
      );
    }

    // Verify email matches either guestEmail or user email
    const emailLower = validated.email.toLowerCase();
    const orderEmail = order.guestEmail?.toLowerCase() || order.user?.email?.toLowerCase();

    if (emailLower !== orderEmail) {
      return NextResponse.json(
        { success: false, error: "Siparis bulunamadi. Lutfen bilgilerinizi kontrol edin." },
        { status: 404 }
      );
    }

    // Format order for response
    const orderResponse = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      trackingToken: order.trackingToken,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      createdAt: order.createdAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        variantSize: item.variantSize,
        variantColor: item.variantColor,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
        image: item.product.images[0]?.url || null,
      })),
      shippingAddress: {
        name: order.shippingName,
        phone: order.shippingPhone,
        address: order.shippingAddress,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
      },
      totals: {
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        discount: Number(order.discount),
        total: Number(order.total),
      },
      statusHistory: order.statusHistory.map((h) => ({
        status: h.status,
        note: h.note,
        createdAt: h.createdAt,
      })),
    };

    return NextResponse.json({ success: true, order: orderResponse });
  } catch (error) {
    console.error("Order track error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Gecersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
