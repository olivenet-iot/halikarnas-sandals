import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const addressSchema = z.object({
  title: z.string().min(1, "Adres başlığı gerekli"),
  firstName: z.string().min(1, "Ad gerekli"),
  lastName: z.string().min(1, "Soyad gerekli"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
  city: z.string().min(1, "İl seçiniz"),
  district: z.string().min(1, "İlçe seçiniz"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// GET - List user addresses
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { error: "Adresler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    // Check address limit (max 5)
    const addressCount = await db.address.count({
      where: { userId: session.user.id },
    });

    if (addressCount >= 5) {
      return NextResponse.json(
        { error: "En fazla 5 adres ekleyebilirsiniz" },
        { status: 400 }
      );
    }

    // If this is the first address or marked as default, make it default
    const isDefault = addressCount === 0 || validatedData.isDefault;

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        district: validatedData.district,
        postalCode: validatedData.postalCode,
        isDefault,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Create address error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Adres eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
