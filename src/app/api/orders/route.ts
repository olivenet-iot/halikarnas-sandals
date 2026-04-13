import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates";
import { validateCoupon } from "@/lib/coupon-validator";
import { TERMS_VERSION, KVKK_VERSION } from "@/lib/legal-versions";

// Frontend currently sends legacy "card"; normalize to canonical "credit_card".
const paymentMethodSchema = z
  .enum(["card", "credit_card", "cash_on_delivery"])
  .transform((v) => (v === "card" ? "credit_card" : v));

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().positive().max(10),
      })
    )
    .min(1)
    .max(50),
  shippingInfo: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().regex(/^5[0-9]{9}$/, "Geçerli bir telefon numarası giriniz"),
    city: z.string().min(1),
    cityName: z.string().min(1),
    district: z.string().min(1),
    districtName: z.string().min(1),
    neighborhood: z.string().optional(),
    address: z.string().min(10).max(500),
    postalCode: z.string().optional(),
  }),
  paymentMethod: paymentMethodSchema,
  couponCode: z.string().optional().nullable(),
  customerNote: z.string().max(500).optional(),
  acceptedTerms: z.literal(true, {
    message: "Mesafeli satış sözleşmesi onaylanmalı",
  }),
  acceptedKvkk: z.literal(true, {
    message: "KVKK aydınlatma metni onaylanmalı",
  }),
});

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi" },
      { status: 400 }
    );
  }

  const parsed = createOrderSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "Geçersiz istek" },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Load variants + products in one query
      const variantIds = body.items.map((i) => i.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      // 2. Enrich items with server-trusted prices + validate product status
      let subtotalAcc = 0;
      const enrichedItems = body.items.map((item) => {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) {
          throw new Error(`Ürün bulunamadı (${item.variantId})`);
        }
        if (variant.productId !== item.productId) {
          throw new Error("Ürün ve varyant eşleşmiyor");
        }
        if (variant.product.status !== "ACTIVE") {
          throw new Error(`${variant.product.name} artık satışta değil`);
        }
        const unitPrice = Number(variant.price ?? variant.product.basePrice);
        const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;
        subtotalAcc += lineTotal;
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
          productName: variant.product.name,
          variantSize: variant.size,
          variantColor: variant.color,
          sku: variant.sku,
        };
      });
      const subtotal = Math.round(subtotalAcc * 100) / 100;

      // 3. Atomic stock decrement (sorted by variantId to prevent deadlocks)
      const sortedItems = [...enrichedItems].sort((a, b) =>
        a.variantId.localeCompare(b.variantId)
      );
      for (const item of sortedItems) {
        const rowsAffected = await tx.$executeRaw`
          UPDATE "ProductVariant"
          SET stock = stock - ${item.quantity}
          WHERE id = ${item.variantId} AND stock >= ${item.quantity}
        `;
        if (rowsAffected === 0) {
          throw new Error(`${item.productName} stokta yetersiz`);
        }
      }

      // 4. Shipping cost from SiteSetting (with defaults)
      const shippingSettings = await tx.siteSetting.findMany({
        where: { group: "shipping" },
      });
      const settingsMap: Record<string, string> = {};
      for (const s of shippingSettings) settingsMap[s.key] = s.value;
      const freeThreshold =
        Number(settingsMap["free_shipping_threshold"]) || 500;
      const standardCost = Number(settingsMap["shipping_cost"]) || 49.9;
      const shippingCost = subtotal >= freeThreshold ? 0 : standardCost;

      // 5. Coupon validation + atomic usageCount increment
      let couponId: string | null = null;
      let discountAmount = 0;
      if (body.couponCode) {
        const couponResult = await validateCoupon({
          code: body.couponCode,
          subtotal,
          userId,
          tx,
        });
        if (!couponResult.valid) {
          throw new Error(`Kupon geçersiz: ${couponResult.reason}`);
        }

        // Guarded increment: if usageLimit is set, require usageCount below it.
        // If usageLimit is null, the id-only filter is enough.
        const updateWhere =
          couponResult.coupon.usageLimit === null
            ? { id: couponResult.coupon.id }
            : {
                id: couponResult.coupon.id,
                usageCount: { lt: couponResult.coupon.usageLimit },
              };

        const updateResult = await tx.coupon.updateMany({
          where: updateWhere,
          data: { usageCount: { increment: 1 } },
        });
        if (updateResult.count === 0) {
          throw new Error("Kupon kullanım limiti doldu");
        }

        couponId = couponResult.coupon.id;
        discountAmount = couponResult.discountAmount;
      }

      // 6. Total (server-computed)
      const total =
        Math.round((subtotal + shippingCost - discountAmount) * 100) / 100;

      // 7. Shipping address snapshot (preserve current single-string format)
      const fullAddress = [
        body.shippingInfo.neighborhood,
        body.shippingInfo.address,
        `${body.shippingInfo.districtName}/${body.shippingInfo.cityName}`,
      ]
        .filter(Boolean)
        .join(", ");

      // 8. Create order + items + status history
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          trackingToken: crypto.randomBytes(32).toString("hex"),
          userId,
          guestEmail: userId ? null : body.shippingInfo.email,
          guestPhone: userId ? null : body.shippingInfo.phone,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: body.paymentMethod,
          shippingName: `${body.shippingInfo.firstName} ${body.shippingInfo.lastName}`,
          shippingPhone: body.shippingInfo.phone,
          shippingAddress: fullAddress,
          shippingCity: body.shippingInfo.cityName,
          shippingDistrict: body.shippingInfo.districtName,
          shippingPostalCode: body.shippingInfo.postalCode ?? null,
          subtotal,
          shippingCost,
          discount: discountAmount,
          tax: 0,
          total,
          couponId,
          couponCode: body.couponCode ?? null,
          customerNote: body.customerNote ?? null,
          termsAcceptedAt: new Date(),
          termsVersion: TERMS_VERSION,
          kvkkAcceptedAt: new Date(),
          kvkkVersion: KVKK_VERSION,
          acceptIpAddress: ip,
          items: {
            create: enrichedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantSize: item.variantSize,
              variantColor: item.variantColor,
              sku: item.sku,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              total: item.lineTotal,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "Sipariş oluşturuldu",
              createdBy: userId,
            },
          },
        },
        include: { items: true },
      });

      // 9. Product soldCount bump (grouped per product, sorted for deadlock safety)
      const productTotals = new Map<string, number>();
      for (const item of enrichedItems) {
        productTotals.set(
          item.productId,
          (productTotals.get(item.productId) ?? 0) + item.quantity
        );
      }
      const sortedProductIds = Array.from(productTotals.keys()).sort();
      for (const productId of sortedProductIds) {
        await tx.product.update({
          where: { id: productId },
          data: { soldCount: { increment: productTotals.get(productId)! } },
        });
      }

      return { newOrder, subtotal, shippingCost, discountAmount, total };
    });

    // Outside transaction: fail-tolerant confirmation email
    const { newOrder, subtotal, shippingCost, discountAmount, total } = result;
    const emailItems = newOrder.items.map((item) => ({
      name: item.productName,
      variant: `${item.variantSize}${item.variantColor ? " / " + item.variantColor : ""}`,
      quantity: item.quantity,
      price: Number(item.unitPrice) * item.quantity,
    }));
    const emailTemplate = orderConfirmationEmail({
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.shippingName,
      items: emailItems,
      subtotal,
      shipping: shippingCost,
      discount: discountAmount,
      total,
      shippingAddress: {
        address: body.shippingInfo.address,
        city: body.shippingInfo.cityName,
        district: body.shippingInfo.districtName,
      },
      paymentMethod:
        body.paymentMethod === "credit_card" ? "Kredi Kartı" : "Kapıda Ödeme",
      trackingToken: newOrder.trackingToken!,
    });

    try {
      console.log("📧 Sending order confirmation email to:", body.shippingInfo.email);
      const emailResult = await sendEmail({
        to: body.shippingInfo.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      if (emailResult.success) {
        console.log("✅ Order confirmation email sent:", emailResult.messageId);
      } else {
        console.error("❌ Failed to send email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("❌ Email sending exception:", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      trackingToken: newOrder.trackingToken,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sipariş oluşturulamadı";
    const isBusinessRule =
      message.includes("stokta yetersiz") ||
      message.includes("Kupon") ||
      message.includes("satışta değil") ||
      message.includes("bulunamadı") ||
      message.includes("eşleşmiyor");

    if (isBusinessRule) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Sipariş oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// GET /api/orders — guest lookup path (auth list implemented in Task 5)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (orderNumber && email) {
      const order = await db.order.findFirst({
        where: { orderNumber, guestEmail: email },
        include: { items: true },
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
