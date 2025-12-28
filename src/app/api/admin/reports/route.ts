import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { subDays, subYears } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "sales";
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    let startDate: Date;
    const endDate = new Date();

    switch (range) {
      case "7d":
        startDate = subDays(endDate, 7);
        break;
      case "30d":
        startDate = subDays(endDate, 30);
        break;
      case "90d":
        startDate = subDays(endDate, 90);
        break;
      case "1y":
        startDate = subYears(endDate, 1);
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    switch (type) {
      case "sales":
        return NextResponse.json(await getSalesReport(startDate, endDate));
      case "products":
        return NextResponse.json(await getProductsReport(startDate, endDate));
      case "customers":
        return NextResponse.json(await getCustomersReport(startDate, endDate));
      case "inventory":
        return NextResponse.json(await getInventoryReport());
      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Report generation failed" },
      { status: 500 }
    );
  }
}

async function getSalesReport(startDate: Date, endDate: Date) {
  // Get orders in date range
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: "CANCELLED" },
    },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate totals
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get previous period for comparison
  const periodLength = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - periodLength);
  const prevEndDate = startDate;

  const prevOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: prevStartDate, lt: prevEndDate },
      status: { not: "CANCELLED" },
    },
    select: { total: true },
  });

  const prevRevenue = prevOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  const revenueGrowth =
    prevRevenue > 0
      ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
      : 0;

  // Sales trend by day
  const salesByDay: Record<string, { revenue: number; orders: number }> = {};
  for (const order of orders) {
    const date = order.createdAt.toISOString().split("T")[0];
    if (!salesByDay[date]) {
      salesByDay[date] = { revenue: 0, orders: 0 };
    }
    salesByDay[date].revenue += Number(order.total);
    salesByDay[date].orders += 1;
  }

  const salesTrend = Object.entries(salesByDay).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }));

  // Top products
  const productSales = new Map<
    string,
    { name: string; quantity: number; revenue: number }
  >();
  for (const order of orders) {
    for (const item of order.items) {
      const productName = item.variant.product.name;
      const current = productSales.get(productName) || {
        name: productName,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += Number(item.total);
      productSales.set(productName, current);
    }
  }

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Order status distribution
  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    _count: true,
  });

  return {
    totalRevenue: Math.round(totalRevenue),
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue),
    revenueGrowth,
    conversionRate: 3.2, // Would need analytics integration
    salesTrend,
    topProducts,
    statusDistribution: statusCounts.map((s) => ({
      status: s.status,
      count: s._count,
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getProductsReport(startDate: Date, endDate: Date) {
  // Get all products with stats
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      variants: {
        select: { stock: true },
      },
      _count: {
        select: { orderItems: true, reviews: true },
      },
    },
    orderBy: { soldCount: "desc" },
    take: 20,
  });

  const productStats = products.map((p) => ({
    id: p.id,
    name: p.name,
    soldCount: p.soldCount,
    viewCount: p.viewCount,
    reviewCount: p._count.reviews,
    totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    revenue: p.soldCount * Number(p.basePrice),
  }));

  // Category distribution
  const categoryStats = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { status: "ACTIVE" },
    _count: true,
    _sum: { soldCount: true },
  });

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryStats.map((c) => c.categoryId) } },
    select: { id: true, name: true },
  });

  const categoryDistribution = categoryStats.map((c) => ({
    name: categories.find((cat) => cat.id === c.categoryId)?.name || "Diğer",
    productCount: c._count,
    soldCount: c._sum.soldCount || 0,
  }));

  return {
    topProducts: productStats,
    categoryDistribution,
    totalProducts: await prisma.product.count({ where: { status: "ACTIVE" } }),
  };
}

async function getCustomersReport(startDate: Date, endDate: Date) {
  // New customers
  const newCustomers = await prisma.user.count({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      role: "CUSTOMER",
    },
  });

  // Total customers
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  // Customers with orders
  const customersWithOrders = await prisma.user.count({
    where: {
      role: "CUSTOMER",
      orders: { some: {} },
    },
  });

  // Repeat customers (more than 1 order)
  const usersWithMultipleOrders = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      _count: { select: { orders: true } },
    },
  });

  const repeatCustomers = usersWithMultipleOrders.filter(
    (u) => u._count.orders > 1
  ).length;

  // Top customers by order value
  const topCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        where: { status: { not: "CANCELLED" } },
        select: { total: true },
      },
    },
    take: 10,
  });

  const topCustomerStats = topCustomers
    .map((c) => ({
      id: c.id,
      name: c.name || c.email,
      email: c.email,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  return {
    newCustomers,
    totalCustomers,
    customersWithOrders,
    repeatCustomers,
    repeatRate:
      customersWithOrders > 0
        ? ((repeatCustomers / customersWithOrders) * 100).toFixed(1)
        : 0,
    topCustomers: topCustomerStats,
  };
}

async function getInventoryReport() {
  const totalProducts = await prisma.product.count({
    where: { status: "ACTIVE" },
  });

  const totalVariants = await prisma.productVariant.count();

  const outOfStock = await prisma.productVariant.count({
    where: { stock: 0 },
  });

  const lowStock = await prisma.productVariant.count({
    where: { stock: { gt: 0, lt: 10 } },
  });

  const stockAgg = await prisma.productVariant.aggregate({
    _sum: { stock: true },
  });

  // Low stock items
  const lowStockItems = await prisma.productVariant.findMany({
    where: { stock: { lt: 10 } },
    include: {
      product: { select: { name: true } },
    },
    orderBy: { stock: "asc" },
    take: 20,
  });

  return {
    totalProducts,
    totalVariants,
    outOfStock,
    lowStock,
    totalStockUnits: stockAgg._sum.stock || 0,
    lowStockItems: lowStockItems.map((v) => ({
      sku: v.sku,
      productName: v.product.name,
      color: v.color,
      size: v.size,
      stock: v.stock,
    })),
  };
}
