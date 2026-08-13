import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAsciiSlug,
  toPublicProductSlug,
} from "@/lib/productPublicSlug";
import { normalizeRouteSlug } from "@/lib/utils";

/**
 * 舊中文配件網址 → 英文公開 slug（308 永久轉址）
 * 必須在進 ISR 頁面前攔截，否則中文路徑會觸發 Next.js cache-tag 500。
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/accessories\/([^/]+)\/?$/);
  if (!match?.[1]) return NextResponse.next();

  const requestSlug = normalizeRouteSlug(match[1]);
  if (!requestSlug || isAsciiSlug(requestSlug)) return NextResponse.next();

  const publicSlug = toPublicProductSlug(requestSlug);
  if (!publicSlug || publicSlug === requestSlug.toLowerCase()) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/accessories/${publicSlug}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/accessories/:slug"],
};
