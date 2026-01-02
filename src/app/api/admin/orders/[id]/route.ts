import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { shippingNotificationEmail } from "@/lib/email-templates";

// GET - Get order detail
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

    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                  select: { url: true },
                },
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Convert Decimal to number for JSON
    const serializedOrder = {
      ...order,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      tax: Number(order.tax),
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
    };

    return NextResponse.json({ order: serializedOrder });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Sipariş getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]).optional(),
  statusNote: z.string().optional(),
  trackingNumber: z.string().nullable().optional(),
  carrier: z.string().nullable().optional(),
  adminNote: z.string().nullable().optional(),
});

// PATCH - Update order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    // Handle status update
    if (validatedData.status && validatedData.status !== existingOrder.status) {
      updateData.status = validatedData.status;

      // Update timestamp based on new status
      if (validatedData.status === "SHIPPED") {
        updateData.shippedAt = new Date();
      } else if (validatedData.status === "DELIVERED") {
        updateData.deliveredAt = new Date();
      }

      // Create status history entry
      await db.orderStatusHistory.create({
        data: {
          orderId: id,
          status: validatedData.status,
          note: validatedData.statusNote || null,
          createdBy: session.user.id,
        },
      });
    }

    // Handle tracking info update
    if (validatedData.trackingNumber !== undefined) {
      updateData.trackingNumber = validatedData.trackingNumber;
    }
    if (validatedData.carrier !== undefined) {
      updateData.carrier = validatedData.carrier;
    }

    // Handle admin note update
    if (validatedData.adminNote !== undefined) {
      updateData.adminNote = validatedData.adminNote;
    }

    // Update order if there's anything to update
    if (Object.keys(updateData).length > 0) {
      await db.order.update({
        where: { id },
        data: updateData,
      });
    }

    // Send shipping notification email when status changes to SHIPPED
    if (validatedData.status === "SHIPPED" && existingOrder.status !== "SHIPPED") {
      const customerEmail = existingOrder.guestEmail || existingOrder.userId
        ? (await db.user.findUnique({ where: { id: existingOrder.userId! }, select: { email: true } }))?.email
        : null;

      if (customerEmail && validatedData.trackingNumber && validatedData.carrier) {
        const emailTemplate = shippingNotificationEmail(
          existingOrder.shippingName || "Değerli Müşterimiz",
          existingOrder.orderNumber,
          validatedData.trackingNumber,
          validatedData.carrier,
          existingOrder.trackingToken || ""
        );

        await sendEmail({
          to: customerEmail,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sipariş güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
