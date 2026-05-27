import { NextResponse } from "next/server";
import { getAccessoryDetailFromCatalog } from "@/data/accessories.server";

export async function GET(_request, { params }) {
  const { id } = await params;
  const product = getAccessoryDetailFromCatalog(id);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
