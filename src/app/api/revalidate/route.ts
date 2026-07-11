import { NextRequest, NextResponse } from "next/server";
import {
  runRevalidate,
  type RevalidateType,
} from "@/lib/seo/revalidate.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  type?: RevalidateType;
  /** 相容舊 series webhook：未帶 type 時視為 series */
  slug?: string;
};

function authorize(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const headerSecret = request.headers.get("x-revalidate-secret");
  return headerSecret === secret;
}

export async function POST(request: NextRequest) {
  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "REVALIDATE_SECRET 未設定" },
      { status: 503 },
    );
  }

  if (!authorize(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const type = (body.type || "all") as RevalidateType;
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const allowed: RevalidateType[] = [
    "product",
    "series",
    "blog",
    "sitemap",
    "all",
  ];

  if (!allowed.includes(type)) {
    return NextResponse.json(
      { ok: false, message: `type 必須為 ${allowed.join(" | ")}` },
      { status: 400 },
    );
  }

  const result = runRevalidate(type, slug);

  return NextResponse.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
    ...result,
  });
}
