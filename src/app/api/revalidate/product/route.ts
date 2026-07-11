import { NextRequest, NextResponse } from "next/server";
import { revalidateProductCache } from "@/lib/seo/revalidate.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  slug?: string;
};

/**
 * WooCommerce 商品儲存後 webhook：
 * POST /api/revalidate/product
 * Header: x-revalidate-secret
 * Body: { "slug": "product-slug" }
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
  const result = revalidateProductCache(slug);

  return NextResponse.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
    revalidated: result.paths,
    ...result,
  });
}
