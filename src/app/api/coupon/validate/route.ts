import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Kupon kodu gerekli" },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Geçersiz kupon kodu" },
        { status: 400 }
      );
    }

    // Check if active
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: "Bu kupon artık geçerli değil" },
        { status: 400 }
      );
    }

    // Check date validity
    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json(
        { valid: false, error: "Bu kupon henüz aktif değil" },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { valid: false, error: "Bu kuponun süresi dolmuş" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: "Bu kupon kullanım limitine ulaşmış" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json(
        {
          valid: false,
          error: `Bu kupon için minimum sipariş tutarı ${Number(coupon.minOrderAmount).toLocaleString("tr-TR")} TL`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    } else {
      // FIXED_AMOUNT
      discount = Number(coupon.discountValue);
    }

    // Don't discount more than subtotal
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType === "PERCENTAGE" ? "percentage" : "fixed",
      discountValue: Number(coupon.discountValue),
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
      discount,
      description: coupon.description,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { valid: false, error: "Kupon doğrulanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
