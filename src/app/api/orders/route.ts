import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates";

interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  cityName: string;
  district: string;
  districtName: string;
  neighborhood?: string;
  address: string;
  postalCode?: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: "card" | "cash_on_delivery";
  couponCode?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const {
      items,
      shippingInfo,
      paymentMethod,
      couponCode,
      subtotal,
      shippingCost,
      discount,
      total,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Sipariş için en az bir ürün gerekli" },
        { status: 400 }
      );
    }

    if (!shippingInfo) {
      return NextResponse.json(
        { error: "Teslimat bilgileri gerekli" },
        { status: 400 }
      );
    }

    // Verify stock for all items
    const stockChecks = await Promise.all(
      items.map(async (item) => {
        const variant = await db.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          return { valid: false, error: `Ürün bulunamadı: ${item.variantId}` };
        }

        if (variant.stock < item.quantity) {
          return {
            valid: false,
            error: `Yetersiz stok: ${variant.product.name} - ${variant.size}`,
          };
        }

        return {
          valid: true,
          variant,
          quantity: item.quantity,
          unitPrice: Number(variant.price || variant.product.basePrice),
        };
      })
    );

    const invalidStock = stockChecks.find((check) => !check.valid);
    if (invalidStock) {
      return NextResponse.json(
        { error: invalidStock.error },
        { status: 400 }
      );
    }

    // Get coupon if provided
    let couponId: string | null = null;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        couponId = coupon.id;

        // Increment usage count
        await db.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Format address
    const fullAddress = [
      shippingInfo.neighborhood,
      shippingInfo.address,
      `${shippingInfo.districtName}/${shippingInfo.cityName}`,
    ]
      .filter(Boolean)
      .join(", ");

    // Create order with transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          guestEmail: shippingInfo.email,
          guestPhone: shippingInfo.phone,
          status: "PENDING",
          paymentStatus: paymentMethod === "cash_on_delivery" ? "PENDING" : "PENDING",
          paymentMethod: paymentMethod === "cash_on_delivery" ? "Kapıda Ödeme" : "Kredi Kartı",
          shippingName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          shippingPhone: shippingInfo.phone,
          shippingAddress: fullAddress,
          shippingCity: shippingInfo.cityName,
          shippingDistrict: shippingInfo.districtName,
          shippingPostalCode: shippingInfo.postalCode,
          subtotal,
          shippingCost,
          discount,
          total,
          couponId,
          couponCode,
        },
      });

      // Create order items and reduce stock
      for (const check of stockChecks) {
        if (!check.valid || !check.variant) continue;

        const variant = check.variant;
        const itemTotal = check.unitPrice * check.quantity;

        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: variant.productId,
            variantId: variant.id,
            productName: variant.product.name,
            variantSize: variant.size,
            variantColor: variant.color,
            sku: variant.sku,
            unitPrice: check.unitPrice,
            quantity: check.quantity,
            total: itemTotal,
          },
        });

        // Reduce stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: check.quantity } },
        });

        // Increment sold count
        await tx.product.update({
          where: { id: variant.productId },
          data: { soldCount: { increment: check.quantity } },
        });
      }

      // Create status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "PENDING",
          note: "Sipariş oluşturuldu",
        },
      });

      return newOrder;
    });

    // Send order confirmation email
    const orderItems = stockChecks
      .filter((check) => check.valid && check.variant)
      .map((check) => ({
        name: check.variant!.product.name,
        variant: `${check.variant!.size}${check.variant!.color ? " / " + check.variant!.color : ""}`,
        quantity: check.quantity!,
        price: check.unitPrice! * check.quantity!,
      }));

    const emailTemplate = orderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      items: orderItems,
      subtotal,
      shipping: shippingCost,
      discount,
      total,
      shippingAddress: {
        address: shippingInfo.address,
        city: shippingInfo.cityName,
        district: shippingInfo.districtName,
      },
      paymentMethod: paymentMethod === "cash_on_delivery" ? "Kapıda Ödeme" : "Kredi Kartı",
    });

    await sendEmail({
      to: shippingInfo.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Sipariş oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get orders (for authenticated users)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (orderNumber && email) {
      // Guest order lookup
      const order = await db.order.findFirst({
        where: {
          orderNumber,
          guestEmail: email,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Sipariş bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    // TODO: Implement authenticated user order list
    return NextResponse.json({ orders: [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Siparişler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
