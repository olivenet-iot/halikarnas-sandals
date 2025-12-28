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
    const filter = searchParams.get("filter") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 50;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filter) {
      where.action = { startsWith: filter };
    }

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      activities: activities.map((a) => ({
        id: a.id,
        action: a.action,
        entity: a.entity,
        entityId: a.entityId,
        details: a.details,
        user: {
          name: a.user.name || a.user.email,
          email: a.user.email,
        },
        ipAddress: a.ipAddress,
        createdAt: a.createdAt.toISOString(),
      })),
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
