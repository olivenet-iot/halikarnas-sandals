import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Papa from "papaparse";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.email = { contains: search, mode: "insensitive" };
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Export as CSV
    if (format === "csv") {
      const csv = Papa.unparse(
        subscribers.map((s) => ({
          email: s.email,
          name: s.name || "",
          source: s.source || "",
          status: s.isActive ? "active" : "inactive",
          subscribed_at: s.createdAt.toISOString(),
        }))
      );

      const date = new Date().toISOString().split("T")[0];
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=aboneler-${date}.csv`,
        },
      });
    }

    return NextResponse.json({
      subscribers: subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        name: s.name,
        source: s.source,
        isActive: s.isActive,
        createdAt: s.createdAt.toISOString(),
      })),
      total: subscribers.length,
      active: subscribers.filter((s) => s.isActive).length,
    });
  } catch (error) {
    console.error("Subscribers GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribers DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("Subscribers PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
