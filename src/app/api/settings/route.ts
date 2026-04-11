import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — public endpoint, returns shipping config
export async function GET() {
  try {
    const settings = await db.siteSetting.findMany({
      where: { group: "shipping" },
    });

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({
      freeShippingThreshold: Number(settingsMap["free_shipping_threshold"]) || 500,
      shippingCost: Number(settingsMap["shipping_cost"]) || 49.9,
    });
  } catch (error) {
    console.error("Public settings error:", error);
    // Return defaults on error
    return NextResponse.json({
      freeShippingThreshold: 500,
      shippingCost: 49.9,
    });
  }
}
