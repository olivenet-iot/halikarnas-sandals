import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filter === "low") {
      where.stock = { gt: 0, lt: 10 };
    } else if (filter === "out") {
      where.stock = 0;
    }

    if (search) {
      where.OR = [
        { sku: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json(
      variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        productName: v.product.name,
        productSlug: v.product.slug,
        color: v.color,
        size: v.size,
        stock: v.stock,
      }))
    );
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
