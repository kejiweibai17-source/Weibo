import { NextResponse } from "next/server";
import { fetchSeriesNavItems } from "@/lib/seriesProducts.server";

/** Navbar 下拉需較即時；避免長時間卡在舊系列列表 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = await fetchSeriesNavItems();
  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
