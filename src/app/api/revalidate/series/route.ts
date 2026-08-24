import { NextRequest, NextResponse } from "next/server";
import { revalidateSeriesCache } from "@/lib/seo/revalidate.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  slug?: string;
};

/**
 * 相容舊版 WP webhook：POST /api/revalidate/series
 * 同時會刷新 /sitemap.xml（ISR on-demand）
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "REVALIDATE_SECRET 未設定" },
      { status: 503 },
    );
  }

  const headerSecret = request.headers.get("x-revalidate-secret");
  if (headerSecret !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const result = revalidateSeriesCache(slug);

  return NextResponse.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
    revalidated: result.paths,
    ...result,
  });
}
