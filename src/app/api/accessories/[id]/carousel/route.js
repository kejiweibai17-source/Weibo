import { NextResponse } from "next/server";
import { fetchAccessoryDetailBySlug } from "@/lib/accessoriesWoo.server";
import { normalizeRouteSlug } from "@/lib/utils";

export async function GET(_request, { params }) {
  const { id: rawId } = await params;
  const id = normalizeRouteSlug(rawId);
  const product = await fetchAccessoryDetailBySlug(id);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    auto: false,
    images: product.images ?? [],
  });
}
