import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - List user's wishlist items
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const items = await db.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            gender: true,
            basePrice: true,
            compareAtPrice: true,
            status: true,
            category: {
              select: { slug: true },
            },
            images: {
              orderBy: { position: "asc" },
              take: 1,
              select: { url: true },
            },
            variants: {
              select: {
                stock: true,
              },
            },
          },
        },
      },
    });

    // Calculate if product is in stock
    const wishlistItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        sku: item.product.sku,
        gender: item.product.gender,
        categorySlug: item.product.category?.slug || null,
        basePrice: item.product.basePrice,
        compareAtPrice: item.product.compareAtPrice,
        image: item.product.images[0]?.url || null,
        inStock: item.product.variants.some((v) => v.stock > 0),
        isActive: item.product.status === "ACTIVE",
      },
    }));

    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { error: "Favoriler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Ürün ID gerekli" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu ürün zaten favorilerinizde" },
        { status: 400 }
      );
    }

    // Add to wishlist
    const wishlistItem = await db.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ item: wishlistItem }, { status: 201 });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json(
      { error: "Favorilere eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
