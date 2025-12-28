import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity, ActivityActions } from "@/lib/activity-logger";
import Papa from "papaparse";

// Türkçe alan adlarını İngilizce'ye map et
const FIELD_MAP: Record<string, string> = {
  urun_kodu: "handle",
  urun_adi: "title",
  aciklama: "description",
  kategori: "category",
  cinsiyet: "gender",
  renk: "color",
  beden: "size",
  stok_kodu: "sku",
  fiyat: "price",
  indirimli_fiyat: "compare_price",
  stok: "stock",
  gorsel_url: "image",
};

// Gender map
const GENDER_MAP: Record<string, "KADIN" | "ERKEK" | "UNISEX"> = {
  kadın: "KADIN",
  kadin: "KADIN",
  erkek: "ERKEK",
  unisex: "UNISEX",
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const text = await file.text();
    // BOM karakterini temizle
    const cleanText = text.replace(/^\uFEFF/, "");

    const { data, errors: parseErrors } = Papa.parse(cleanText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => {
        const cleaned = h.trim().toLowerCase().replace(/\s+/g, "_");
        return FIELD_MAP[cleaned] || cleaned;
      },
    });

    if (parseErrors.length > 0) {
      return NextResponse.json(
        {
          error: "CSV okuma hatası",
          details: parseErrors,
        },
        { status: 400 }
      );
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    // Get default category
    let defaultCategory = await prisma.category.findFirst({
      where: { slug: "sandaletler" },
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: "Sandaletler",
          slug: "sandaletler",
          isActive: true,
        },
      });
    }

    // Handle'a göre grupla - both new and old field names
    const productGroups = new Map<string, Record<string, string>[]>();
    for (const row of data as Record<string, string>[]) {
      const handle = (row.handle || row.urun_kodu)?.trim();
      if (!handle) continue;

      if (!productGroups.has(handle)) {
        productGroups.set(handle, []);
      }
      productGroups.get(handle)!.push(row);
    }

    // Her ürünü işle
    for (const [handle, rows] of Array.from(productGroups.entries())) {
      try {
        const firstRow = rows[0];

        // Get values with fallback for both field naming conventions
        const title = firstRow.title || firstRow.urun_adi || handle;
        const description = firstRow.description || firstRow.body_html || firstRow.aciklama || "";
        const basePrice = parseFloat(firstRow.price || firstRow.variant_price || "0") || 0;
        const compareAtPrice = firstRow.compare_price || firstRow.variant_compare_at_price
          ? parseFloat(firstRow.compare_price || firstRow.variant_compare_at_price)
          : null;

        // Gender'ı dönüştür
        const genderInput = (firstRow.gender || firstRow.cinsiyet || "").toLowerCase();
        const gender = GENDER_MAP[genderInput] || null;

        // Upsert product
        const product = await prisma.product.upsert({
          where: { slug: handle },
          update: {
            name: title,
            description,
            basePrice,
            compareAtPrice,
            gender,
          },
          create: {
            slug: handle,
            name: title,
            description,
            basePrice,
            compareAtPrice,
            status: "ACTIVE",
            categoryId: defaultCategory.id,
            gender,
          },
        });

        // Process variants
        for (const row of rows) {
          const sku = row.sku || row.variant_sku || row.stok_kodu;
          if (sku) {
            const variantPrice = parseFloat(row.price || row.variant_price || row.fiyat || "0") || null;
            const stock = parseInt(row.stock || row.variant_inventory_qty || row.stok || "0") || 0;
            const color = row.color || row.option1_value || row.renk || "Standart";
            const size = row.size || row.option2_value || row.beden || "STD";

            await prisma.productVariant.upsert({
              where: { sku },
              update: {
                price: variantPrice,
                stock,
                color,
                size,
              },
              create: {
                productId: product.id,
                sku,
                color,
                colorHex: "#8B4513",
                size,
                price: variantPrice,
                stock,
              },
            });
          }
        }

        // Process images
        const imageRows = rows.filter((r) => r.image || r.image_src || r.gorsel_url);
        for (let i = 0; i < imageRows.length; i++) {
          const row = imageRows[i];
          const imageUrl = (row.image || row.image_src || row.gorsel_url || "").trim();

          // URL validasyonu
          if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            continue;
          }

          const existingImage = await prisma.productImage.findFirst({
            where: {
              productId: product.id,
              url: imageUrl,
            },
          });

          if (!existingImage) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                url: imageUrl,
                alt: title,
                position: parseInt(row.image_position) || i,
                isPrimary: i === 0,
              },
            });
          }
        }

        success++;
      } catch (error) {
        failed++;
        errors.push(
          `${handle}: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
        );
        console.error(`Error processing ${handle}:`, error);
      }
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.PRODUCT_BULK_IMPORT,
      details: `${success} ürün içe aktarıldı${failed > 0 ? `, ${failed} başarısız` : ""}`,
      request,
    });

    return NextResponse.json({
      success,
      failed,
      errors,
      message: `${success} ürün başarıyla içe aktarıldı${failed > 0 ? `, ${failed} ürün başarısız` : ""}`,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "İçe aktarma başarısız" },
      { status: 500 }
    );
  }
}
