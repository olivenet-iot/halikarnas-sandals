import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get coupon detail
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

    const coupon = await db.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    // Convert Decimal to number for JSON
    const serializedCoupon = {
      ...coupon,
      discountValue: Number(coupon.discountValue),
      minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    };

    return NextResponse.json({ coupon: serializedCoupon });
  } catch (error) {
    console.error("Get coupon error:", error);
    return NextResponse.json(
      { error: "Kupon getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  code: z.string().min(3).transform((v) => v.toUpperCase()).optional(),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).optional().nullable(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().min(0).optional().nullable(),
  perUserLimit: z.coerce.number().min(0).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// PATCH - Update coupon
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

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    // Check if new code already exists
    if (validatedData.code && validatedData.code !== existingCoupon.code) {
      const codeExists = await db.coupon.findUnique({
        where: { code: validatedData.code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: "Bu kupon kodu zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        code: validatedData.code,
        description: validatedData.description,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        minOrderAmount: validatedData.minOrderAmount,
        maxDiscount: validatedData.maxDiscount,
        usageLimit: validatedData.usageLimit,
        perUserLimit: validatedData.perUserLimit,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kupon güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    // Check if coupon is used in any orders
    const ordersWithCoupon = await db.order.count({
      where: { couponId: id },
    });

    if (ordersWithCoupon > 0) {
      return NextResponse.json(
        { error: `Bu kupon ${ordersWithCoupon} siparişte kullanılmış. Silmek yerine pasif yapabilirsiniz.` },
        { status: 400 }
      );
    }

    await db.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json(
      { error: "Kupon silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
