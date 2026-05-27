import { NextResponse } from "next/server";
import { getAccessoryCatalogItem } from "@/data/accessories.server";
import { enrichSmasmallProductInfo } from "@/lib/smasmallProductEnrichment";

export async function GET(_request, { params }) {
  const { id } = await params;
  const item = getAccessoryCatalogItem(id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const info = await enrichSmasmallProductInfo({
    seriesKey: item.series,
    title: item.title,
  });

  return NextResponse.json(info, {
    headers: {
      "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
