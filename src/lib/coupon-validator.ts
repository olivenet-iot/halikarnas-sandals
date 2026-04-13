import type { Coupon, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type TxClient = Prisma.TransactionClient;

export type ValidateCouponParams = {
  code: string;
  subtotal: number;
  userId: string | null;
  tx?: TxClient;
};

export type ValidateCouponResult =
  | { valid: true; coupon: Coupon; discountAmount: number }
  | { valid: false; reason: string };

export async function validateCoupon(
  params: ValidateCouponParams
): Promise<ValidateCouponResult> {
  const { code, subtotal, userId, tx } = params;
  const client = tx ?? db;

  if (!code) {
    return { valid: false, reason: "Kupon kodu gerekli" };
  }

  const coupon = await client.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { valid: false, reason: "Geçersiz kupon kodu" };
  }

  if (!coupon.isActive) {
    return { valid: false, reason: "Bu kupon artık geçerli değil" };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, reason: "Bu kupon henüz aktif değil" };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { valid: false, reason: "Bu kuponun süresi dolmuş" };
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, reason: "Bu kupon kullanım limitine ulaşmış" };
  }

  if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
    return {
      valid: false,
      reason: `Minimum sipariş tutarı ${Number(coupon.minOrderAmount).toLocaleString("tr-TR")} TL`,
    };
  }

  // Per-user limit — only enforced for authenticated users.
  // Guests have no persistent identifier so this check is skipped.
  if (coupon.perUserLimit !== null && userId) {
    const userUsage = await client.order.count({
      where: {
        userId,
        couponId: coupon.id,
        status: { not: "CANCELLED" },
      },
    });
    if (userUsage >= coupon.perUserLimit) {
      return { valid: false, reason: "Bu kuponu daha fazla kullanamazsınız" };
    }
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscount !== null && discountAmount > Number(coupon.maxDiscount)) {
      discountAmount = Number(coupon.maxDiscount);
    }
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  discountAmount = Math.min(discountAmount, subtotal);
  discountAmount = Math.round(discountAmount * 100) / 100;

  return { valid: true, coupon, discountAmount };
}
