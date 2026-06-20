import { NextResponse } from "next/server";
import { fetchAccessoriesNavItems } from "@/lib/accessoriesNav.server";

export const revalidate = 60;

export async function GET() {
  const items = await fetchAccessoriesNavItems();
  return NextResponse.json({ items });
}
