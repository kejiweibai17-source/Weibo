import { MetadataRoute } from "next";
import {
  getCachedSitemapEntries,
  toMetadataSitemap,
} from "@/lib/seo/sitemap.server";
import { SITEMAP_REVALIDATE_SECONDS } from "@/lib/seo/revalidate.server";

/**
 * 動態 Sitemap（SSG + ISR）
 * - 預設每小時背景更新
 * - 後台新增／更新產品、系列、文章時，透過 /api/revalidate 立刻刷新
 */
export const revalidate = SITEMAP_REVALIDATE_SECONDS;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getCachedSitemapEntries();
  return toMetadataSitemap(entries);
}
