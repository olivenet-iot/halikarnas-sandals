import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity, ActivityActions } from "@/lib/activity-logger";
import Papa from "papaparse";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { size: "asc" },
        },
        images: {
          orderBy: { position: "asc" },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Flatten to CSV format
    const rows: Record<string, string | number>[] = [];

    for (const product of products) {
      const variants =
        product.variants.length > 0 ? product.variants : [null];

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const image = product.images[i] || null;

        rows.push({
          handle: product.slug,
          title: product.name,
          body_html: product.description,
          vendor: "Halikarnas",
          type: product.category?.name || "",
          tags: product.gender?.toLowerCase() || "",
          published: product.status === "ACTIVE" ? "true" : "false",
          option1_name: variant ? "Renk" : "",
          option1_value: variant?.color || "",
          option2_name: variant ? "Beden" : "",
          option2_value: variant?.size || "",
          variant_sku: variant?.sku || "",
          variant_price: variant?.price?.toString() || product.basePrice.toString(),
          variant_compare_at_price: product.compareAtPrice?.toString() || "",
          variant_inventory_qty: variant?.stock || 0,
          image_src: image?.url || "",
          image_position: image?.position?.toString() || "",
          seo_title: product.metaTitle || "",
          seo_description: product.metaDescription || "",
        });
      }
    }

    const csv = Papa.unparse(rows);

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.PRODUCT_EXPORT,
      details: `${products.length} ürün dışa aktarıldı`,
      request,
    });

    const date = new Date().toISOString().split("T")[0];
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=urunler-${date}.csv`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
