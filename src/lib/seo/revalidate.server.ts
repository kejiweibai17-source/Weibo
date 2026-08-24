/** 精簡版快取刷新設定 */
export type RevalidateType = "product" | "series" | "blog" | "sitemap" | "all";
export type RevalidateResult = { ok: boolean; tags: string[]; paths: string[]; message?: string };

export const SITEMAP_CACHE_TAG = "sitemap";
export const PRODUCTS_CACHE_TAG = "products-all";
export const SERIES_CACHE_TAG = "series-all";
export const BLOG_CACHE_TAG = "blog-all";
export const SITEMAP_REVALIDATE_SECONDS = 3600;

export function revalidateSitemapCache() {
  return { tags: [] as string[], paths: [] as string[] };
}
export function revalidateProductCache(_slug = "") {
  return { ok: false, tags: [], paths: [], message: "disabled in client package" } as RevalidateResult;
}
export function revalidateSeriesCache(_slug = "") {
  return { ok: false, tags: [], paths: [], message: "disabled in client package" } as RevalidateResult;
}
export function revalidateBlogCache(_slug = "") {
  return { ok: false, tags: [], paths: [], message: "disabled in client package" } as RevalidateResult;
}
export function runRevalidate(_type: RevalidateType, _slug = "") {
  return { ok: false, tags: [], paths: [], message: "disabled in client package" } as RevalidateResult;
}
