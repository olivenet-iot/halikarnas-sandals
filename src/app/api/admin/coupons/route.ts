import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).transform((v) => v.toUpperCase()),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional().nullable(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().min(0).optional().nullable(),
  perUserLimit: z.coerce.number().min(0).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

// GET - List all coupons
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json(
      { error: "Kuponlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create coupon
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = couponSchema.parse(body);

    // Check if code already exists
    const existing = await db.coupon.findUnique({
      where: { code: validatedData.code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu kupon kodu zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: validatedData.code,
        description: validatedData.description || null,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        minOrderAmount: validatedData.minOrderAmount || null,
        maxDiscount: validatedData.maxDiscount || null,
        usageLimit: validatedData.usageLimit || null,
        perUserLimit: validatedData.perUserLimit || null,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kupon oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
