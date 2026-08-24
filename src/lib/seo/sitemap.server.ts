import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getSiteUrl } from "@/lib/seo/config";

export type SitemapEntrySource = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

async function buildEntries(): Promise<SitemapEntrySource[]> {
  const site = getSiteUrl();
  return [
    { url: site, priority: 1, changeFrequency: "weekly" },
    { url: `${site}/series`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${site}/accessories`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${site}/stores`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${site}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${site}/support`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${site}/contact`, priority: 0.7, changeFrequency: "monthly" },
  ];
}

export const getCachedSitemapEntries = unstable_cache(buildEntries, ["sitemap-client-basic"], {
  revalidate: 3600,
  tags: ["sitemap"],
});

export function toMetadataSitemap(entries: SitemapEntrySource[]): MetadataRoute.Sitemap {
  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
