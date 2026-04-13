import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupon-validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (typeof code !== "string" || typeof subtotal !== "number") {
      return NextResponse.json(
        { valid: false, error: "Geçersiz istek" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    const result = await validateCoupon({ code, subtotal, userId });

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.reason },
        { status: 400 }
      );
    }

    const { coupon, discountAmount } = result;

    // Preserve public response shape consumed by cart-store's AppliedCoupon type.
    // discountType is lowercase here by contract.
    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType === "PERCENTAGE" ? "percentage" : "fixed",
      discountValue: Number(coupon.discountValue),
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
      discount: discountAmount,
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
