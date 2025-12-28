import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password, confirmation } = body;

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Lütfen 'DELETE' yazarak onaylayın" },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // If user has password, verify it
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { error: "Şifre gerekli" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return NextResponse.json(
          { error: "Şifre yanlış" },
          { status: 400 }
        );
      }
    }

    // Delete user (cascades to related records)
    await db.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Hesap silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
