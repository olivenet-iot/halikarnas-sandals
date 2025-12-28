import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "relevance";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query && !category && !gender) {
      return NextResponse.json({ products: [], total: 0 });
    }

    // Build where clause
    const where: Record<string, unknown> = {
      status: "ACTIVE",
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { parent: { slug: category } },
        ],
      };
    }

    if (gender) {
      where.gender = gender;
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) {
        (where.basePrice as Record<string, unknown>).gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        (where.basePrice as Record<string, unknown>).lte = parseFloat(maxPrice);
      }
    }

    // Build orderBy
    let orderBy: Record<string, string>[] = [];
    switch (sort) {
      case "price-asc":
        orderBy = [{ basePrice: "asc" }];
        break;
      case "price-desc":
        orderBy = [{ basePrice: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "bestseller":
        orderBy = [{ soldCount: "desc" }];
        break;
      default:
        // relevance - prioritize featured, then bestseller
        orderBy = [{ isFeatured: "desc" }, { isBestSeller: "desc" }, { soldCount: "desc" }];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: {
            orderBy: { position: "asc" },
            take: 2,
          },
          variants: {
            select: {
              color: true,
              colorHex: true,
            },
            distinct: ["color"],
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    // Transform products
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || product.id,
      gender: product.gender,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt || product.name })),
      colors: product.variants
        .filter((v) => v.color && v.colorHex)
        .map((v) => ({ name: v.color!, hex: v.colorHex! })),
      categorySlug: product.category?.slug || null,
      isNew: product.isNew,
      isSale: product.compareAtPrice ? Number(product.compareAtPrice) > Number(product.basePrice) : false,
      isBestseller: product.isBestSeller,
      category: product.category,
    }));

    return NextResponse.json({
      products: transformedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Arama yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
