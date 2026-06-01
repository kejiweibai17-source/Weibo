import { NextResponse } from "next/server";
import { fetchAccessoryDetailBySlug } from "@/lib/accessoriesWoo.server";

export async function GET(_request, { params }) {
  const { id } = await params;
  const product = await fetchAccessoryDetailBySlug(id);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    auto: false,
    images: product.images ?? [],
  });
}
