import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateInvoice } from "@/lib/invoice-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const invoiceData = {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingDistrict: order.shippingDistrict,
      shippingPostalCode: order.shippingPostalCode,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      total: Number(order.total),
      items: order.items.map((item) => ({
        productName: item.productName,
        variantColor: item.variantColor,
        variantSize: item.variantSize,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
    };

    const pdfArrayBuffer = await generateInvoice(invoiceData);

    return new Response(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=fatura-${order.orderNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Invoice generation failed" },
      { status: 500 }
    );
  }
}
