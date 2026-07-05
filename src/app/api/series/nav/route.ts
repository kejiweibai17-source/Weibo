import { NextResponse } from "next/server";
import { fetchSeriesNavItems } from "@/lib/seriesProducts.server";

export const revalidate = 60;

export async function GET() {
  const items = await fetchSeriesNavItems();
  return NextResponse.json({ items });
}
