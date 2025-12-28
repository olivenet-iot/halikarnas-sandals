import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/cart - Get cart for user or session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;
    // TODO: Get userId from auth session when implemented
    const userId = null;

    if (!userId && !sessionId) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      slug: item.product.slug,
      color: item.variant.colorHex || "",
      colorName: item.variant.color || "",
      size: item.variant.size,
      price: Number(item.variant.price || item.product.basePrice),
      compareAtPrice: item.product.compareAtPrice
        ? Number(item.product.compareAtPrice)
        : undefined,
      image: item.product.images[0]?.url || "",
      quantity: item.quantity,
      maxQuantity: item.variant.stock,
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Sepet yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, quantity = 1 } = body;

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: "Ürün ve varyant bilgisi gerekli" },
        { status: 400 }
      );
    }

    // Check stock
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: "Yetersiz stok" }, { status: 400 });
    }

    const sessionId = request.cookies.get("sessionId")?.value;
    const userId = null; // TODO: Get from auth

    // Get or create cart
    let cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: userId ? { userId } : { sessionId },
      });
    }

    // Check if item already in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + quantity,
        variant.stock
      );
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity: Math.min(quantity, variant.stock),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Sepete eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || quantity === undefined) {
      return NextResponse.json(
        { error: "Varyant ve miktar bilgisi gerekli" },
        { status: 400 }
      );
    }

    const sessionId = request.cookies.get("sessionId")?.value;
    const userId = null;

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Sepet bulunamadı" }, { status: 404 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
      include: {
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Ürün sepette bulunamadı" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: cartItem.id } });
    } else {
      const newQuantity = Math.min(quantity, cartItem.variant.stock);
      await db.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Sepet güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get("variantId");

    if (!variantId) {
      return NextResponse.json(
        { error: "Varyant bilgisi gerekli" },
        { status: 400 }
      );
    }

    const sessionId = request.cookies.get("sessionId")?.value;
    const userId = null;

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Sepet bulunamadı" }, { status: 404 });
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Ürün kaldırılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
