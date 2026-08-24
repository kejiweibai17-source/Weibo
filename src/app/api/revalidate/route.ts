import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST() {
  return NextResponse.json({ ok: false, message: "Revalidate disabled in client package" }, { status: 503 });
}
