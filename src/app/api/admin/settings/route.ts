import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get all settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const settings = await db.siteSetting.findMany();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  group: z.string().optional(),
});

const updateSchema = z.object({
  settings: z.array(settingSchema),
});

// PUT - Update settings (bulk)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Upsert each setting
    await Promise.all(
      validatedData.settings.map((setting) =>
        db.siteSetting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            group: setting.group || "general",
          },
          create: {
            key: setting.key,
            value: setting.value,
            group: setting.group || "general",
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
