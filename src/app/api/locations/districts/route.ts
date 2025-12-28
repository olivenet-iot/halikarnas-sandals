import { NextRequest, NextResponse } from "next/server";
import { getDistrictsSorted } from "@/lib/turkey-locations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId");

  if (!cityId) {
    return NextResponse.json(
      { error: "cityId parametresi gerekli" },
      { status: 400 }
    );
  }

  const districts = getDistrictsSorted(cityId);
  return NextResponse.json({ districts });
}
