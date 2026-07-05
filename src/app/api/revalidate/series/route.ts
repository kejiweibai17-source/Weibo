import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { LEGACY_PRODUCT_SLUGS } from "@/lib/seriesProducts.legacy";

export const runtime = "nodejs";

type Body = {
  slug?: string;
};

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
  const paths: string[] = ["/series"];

  revalidateTag("series-all");

  if (slug) {
    revalidateTag(`series-${slug}`);
    paths.push(`/series/${encodeURIComponent(slug)}`);

    for (const [legacyPath, legacySlug] of Object.entries(LEGACY_PRODUCT_SLUGS)) {
      if (legacySlug === slug) {
        paths.push(`/${legacyPath}`);
      }
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    slug: slug || null,
  });
}
