import { revalidatePath, revalidateTag } from "next/cache";
import { LEGACY_PRODUCT_SLUGS } from "@/lib/seriesProducts.legacy";
import { productFetchCacheTag } from "@/lib/utils";

export type RevalidateType = "product" | "series" | "blog" | "sitemap" | "all";

export type RevalidateResult = {
  type: RevalidateType;
  slug: string | null;
  tags: string[];
  paths: string[];
};

/** Sitemap ISR 快取標籤（與 unstable_cache / fetch tags 對齊） */
export const SITEMAP_CACHE_TAG = "sitemap";
export const PRODUCTS_CACHE_TAG = "products-all";
export const SERIES_CACHE_TAG = "series-all";
export const BLOG_CACHE_TAG = "blog-all";

/** Sitemap 預設 ISR 秒數（後台 webhook 可立即刷新） */
export const SITEMAP_REVALIDATE_SECONDS = 3600;

function unique(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

/** 避免中文 slug 已被 percent-encode 時再 encode 一次（變成 %25e9...） */
function pathSegment(slug: string): string {
  if (!slug) return "";
  if (/%[0-9A-Fa-f]{2}/.test(slug)) return slug;
  return encodeURIComponent(slug);
}

function blogPathCandidates(slug: string): string[] {
  if (!slug) return [];
  const paths = [`/blog/${pathSegment(slug)}`];
  try {
    if (/%[0-9A-Fa-f]{2}/.test(slug)) {
      const decoded = decodeURIComponent(slug);
      if (decoded && decoded !== slug) {
        paths.push(`/blog/${encodeURIComponent(decoded)}`);
        paths.push(`/blog/${decoded}`);
      }
    }
  } catch {
    // ignore malformed URI
  }
  return paths;
}

export function revalidateSitemapCache(): { tags: string[]; paths: string[] } {
  const tags = [SITEMAP_CACHE_TAG];
  const paths = ["/sitemap.xml"];
  for (const tag of tags) revalidateTag(tag);
  for (const path of paths) revalidatePath(path);
  return { tags, paths };
}

export function revalidateProductCache(slug = ""): RevalidateResult {
  const tags = [PRODUCTS_CACHE_TAG, SITEMAP_CACHE_TAG];
  const paths = ["/accessories", "/sitemap.xml"];

  if (slug) {
    tags.push(productFetchCacheTag(slug));
    paths.push(`/accessories/${pathSegment(slug)}`);
  }

  for (const tag of unique(tags)) revalidateTag(tag);
  for (const path of unique(paths)) revalidatePath(path);

  return { type: "product", slug: slug || null, tags: unique(tags), paths: unique(paths) };
}

export function revalidateSeriesCache(slug = ""): RevalidateResult {
  const tags = [SERIES_CACHE_TAG, SITEMAP_CACHE_TAG];
  const paths = ["/series", "/sitemap.xml"];

  if (slug) {
    tags.push(`series-${slug}`);
    paths.push(`/series/${pathSegment(slug)}`);

    for (const [legacyPath, legacySlug] of Object.entries(LEGACY_PRODUCT_SLUGS)) {
      if (legacySlug === slug) {
        paths.push(`/${legacyPath}`);
      }
    }
  }

  for (const tag of unique(tags)) revalidateTag(tag);
  for (const path of unique(paths)) revalidatePath(path);

  return { type: "series", slug: slug || null, tags: unique(tags), paths: unique(paths) };
}

export function revalidateBlogCache(slug = ""): RevalidateResult {
  const tags = [BLOG_CACHE_TAG, SITEMAP_CACHE_TAG];
  const paths = ["/blog", "/sitemap.xml"];

  if (slug) {
    tags.push(`blog-${slug}`);
    paths.push(...blogPathCandidates(slug));
  }

  for (const tag of unique(tags)) revalidateTag(tag);
  for (const path of unique(paths)) revalidatePath(path);

  return { type: "blog", slug: slug || null, tags: unique(tags), paths: unique(paths) };
}

export function runRevalidate(
  type: RevalidateType,
  slug = "",
): RevalidateResult {
  switch (type) {
    case "product":
      return revalidateProductCache(slug);
    case "series":
      return revalidateSeriesCache(slug);
    case "blog":
      return revalidateBlogCache(slug);
    case "sitemap": {
      const { tags, paths } = revalidateSitemapCache();
      return { type: "sitemap", slug: null, tags, paths };
    }
    case "all": {
      const product = revalidateProductCache(slug);
      const series = revalidateSeriesCache(slug);
      const blog = revalidateBlogCache(slug);
      return {
        type: "all",
        slug: slug || null,
        tags: unique([...product.tags, ...series.tags, ...blog.tags]),
        paths: unique([...product.paths, ...series.paths, ...blog.paths]),
      };
    }
  }
}
