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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Update address
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Check if address belongs to user
    const existingAddress = await db.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    // If setting as default, unset other defaults
    if (validatedData.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: {
        title: validatedData.title,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        district: validatedData.district,
        postalCode: validatedData.postalCode,
        isDefault: validatedData.isDefault,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Update address error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Adres güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Check if address belongs to user
    const existingAddress = await db.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    // If deleted address was default, make another one default
    if (existingAddress.isDefault) {
      const firstAddress = await db.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "asc" },
      });

      if (firstAddress) {
        await db.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Adres silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
