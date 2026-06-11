import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/config";

const SITE_URL = getSiteUrl();

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/accessories", changeFrequency: "daily", priority: 0.9 },
  { path: "/brand", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support/manuals", changeFrequency: "monthly", priority: 0.65 },
  { path: "/support/warranty", changeFrequency: "monthly", priority: 0.65 },
  { path: "/support/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support/policies", changeFrequency: "monthly", priority: 0.65 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/product01", changeFrequency: "weekly", priority: 0.85 },
  { path: "/product02", changeFrequency: "weekly", priority: 0.85 },
  { path: "/product03", changeFrequency: "weekly", priority: 0.85 },
  { path: "/product04", changeFrequency: "weekly", priority: 0.85 },
];

async function fetchAccessorySlugs(): Promise<string[]> {
  try {
    const { fetchAccessoriesFromWoo } = await import(
      "@/lib/accessoriesWoo.server"
    );
    const products = await fetchAccessoriesFromWoo();
    return products.map((p) => p.id);
  } catch {
    try {
      const { buildAccessoryCatalog } = await import(
        "@/data/accessories.server"
      );
      return buildAccessoryCatalog().map((p) => p.id);
    } catch {
      return [];
    }
  }
}

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const rawBase =
      process.env.WORDPRESS_API_URL ||
      "https://inf.fjg.mybluehost.me/website_b45d1e40";
    const cleanBase = rawBase.split("/wp-json")[0].replace(/\/$/, "");
    const res = await fetch(
      `${cleanBase}/wp-json/wp/v2/posts?per_page=100&_fields=slug`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts.map((p: { slug: string }) => p.slug) : [];
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [accessorySlugs, blogSlugs] = await Promise.all([
    fetchAccessorySlugs(),
    fetchBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const accessoryEntries: MetadataRoute.Sitemap = accessorySlugs.map((id) => ({
    url: `${SITE_URL}/accessories/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...accessoryEntries, ...blogEntries];
}
