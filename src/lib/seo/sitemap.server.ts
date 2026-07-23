import "server-only";
import { unstable_cache } from "next/cache";
import { getSiteUrl, SITELINK_SITEMAP_PRIORITY } from "@/lib/seo/config";
import {
  BLOG_CACHE_TAG,
  PRODUCTS_CACHE_TAG,
  SERIES_CACHE_TAG,
  SITEMAP_CACHE_TAG,
  SITEMAP_REVALIDATE_SECONDS,
} from "@/lib/seo/revalidate.server";
import { blogPostPath } from "@/lib/utils";

export type SitemapEntrySource = {
  path: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

const SITE_URL = getSiteUrl();

function sitelinkPriority(path: string, fallback: number) {
  const map = SITELINK_SITEMAP_PRIORITY as Record<string, number>;
  return map[path] ?? fallback;
}

/** 靜態頁：Sitelinks 候選頁 priority 提高，加速收錄權重訊號 */
const STATIC_PAGES: SitemapEntrySource[] = [
  { path: "/", changeFrequency: "daily", priority: sitelinkPriority("/", 1.0) },
  {
    path: "/series",
    changeFrequency: "weekly",
    priority: sitelinkPriority("/series", 0.98),
  },
  {
    path: "/accessories",
    changeFrequency: "daily",
    priority: sitelinkPriority("/accessories", 0.97),
  },
  {
    path: "/brand",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/brand", 0.9),
  },
  {
    path: "/blog",
    changeFrequency: "daily",
    priority: sitelinkPriority("/blog", 0.88),
  },
  {
    path: "/stores",
    changeFrequency: "weekly",
    priority: sitelinkPriority("/stores", 0.86),
  },
  {
    path: "/support",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/support", 0.86),
  },
  {
    path: "/contact",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/contact", 0.85),
  },
  {
    path: "/support/faq",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/support/faq", 0.82),
  },
  { path: "/support/manuals", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support/warranty", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support/policies", changeFrequency: "monthly", priority: 0.65 },
  {
    path: "/weibo",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/weibo", 0.75),
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: sitelinkPriority("/about", 0.75),
  },
];

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function fetchAccessoryEntries(): Promise<SitemapEntrySource[]> {
  try {
    const { fetchProductsForSitemap } = await import("@/lib/woo");
    const products = await fetchProductsForSitemap();
    return products.map((product) => ({
      path: `/accessories/${product.slug}`,
      lastModified: parseDate(product.dateModified),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    try {
      const { buildAccessoryCatalog } = await import(
        "@/data/accessories.server"
      );
      return buildAccessoryCatalog().map((p) => ({
        path: `/accessories/${p.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch {
      return [];
    }
  }
}

async function fetchSeriesEntries(): Promise<SitemapEntrySource[]> {
  try {
    const { fetchSeriesSitemapEntries } = await import(
      "@/lib/seriesProducts.server"
    );
    const entries = await fetchSeriesSitemapEntries();
    return entries.map((entry) => ({
      path: `/series/${encodeURIComponent(entry.slug)}`,
      lastModified: parseDate(entry.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    return [];
  }
}

async function fetchBlogEntries(): Promise<SitemapEntrySource[]> {
  try {
    const rawBase =
      process.env.WORDPRESS_API_URL ||
      process.env.WC_API_BASE ||
      "https://inf.fjg.mybluehost.me/website_b45d1e40";
    const cleanBase = rawBase.split("/wp-json")[0].replace(/\/$/, "");
    const res = await fetch(
      `${cleanBase}/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified`,
      {
        next: {
          revalidate: SITEMAP_REVALIDATE_SECONDS,
          tags: [BLOG_CACHE_TAG, SITEMAP_CACHE_TAG],
        },
      },
    );
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts
      .map((post: { slug?: string; modified?: string }): SitemapEntrySource | null => {
        if (!post?.slug) return null;
        const entry: SitemapEntrySource = {
          path: blogPostPath(post.slug),
          changeFrequency: "monthly",
          priority: 0.6,
        };
        const modified = parseDate(post.modified);
        if (modified) entry.lastModified = modified;
        return entry;
      })
      .filter((entry): entry is SitemapEntrySource => entry !== null);
  } catch {
    return [];
  }
}

async function buildSitemapEntries(): Promise<SitemapEntrySource[]> {
  const [accessoryEntries, seriesEntries, blogEntries] = await Promise.all([
    fetchAccessoryEntries(),
    fetchSeriesEntries(),
    fetchBlogEntries(),
  ]);

  return [
    ...STATIC_PAGES,
    ...seriesEntries,
    ...accessoryEntries,
    ...blogEntries,
  ];
}

/** ISR + cache tags：後台 webhook 可立刻刷新 sitemap */
export const getCachedSitemapEntries = unstable_cache(
  buildSitemapEntries,
  ["sitemap-entries-v1"],
  {
    revalidate: SITEMAP_REVALIDATE_SECONDS,
    tags: [
      SITEMAP_CACHE_TAG,
      PRODUCTS_CACHE_TAG,
      SERIES_CACHE_TAG,
      BLOG_CACHE_TAG,
    ],
  },
);

export function toMetadataSitemap(
  entries: SitemapEntrySource[],
  fallbackDate = new Date(),
) {
  return entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified ?? fallbackDate,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
