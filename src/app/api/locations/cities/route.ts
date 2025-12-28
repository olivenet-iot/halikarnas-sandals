import { NextResponse } from "next/server";
import { getCitiesSorted } from "@/lib/turkey-locations";

export async function GET() {
  const cities = getCitiesSorted();
  return NextResponse.json({ cities });
}
