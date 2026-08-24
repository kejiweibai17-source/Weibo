import "server-only";
import type { SeriesNavItem, SeriesPage } from "@/lib/seriesProducts.types";
import { SERIES_NAV_FALLBACK } from "@/lib/seriesProducts.constants";

export { SERIES_NAV_FALLBACK };
export const SERIES_PAGE_REVALIDATE = 3600;

export async function fetchSeriesNavItems(): Promise<SeriesNavItem[]> {
  return [...SERIES_NAV_FALLBACK];
}
export async function fetchSeriesSlugs(): Promise<string[]> {
  return SERIES_NAV_FALLBACK.map((i) => i.slug);
}
export async function fetchSeriesSitemapEntries() {
  return SERIES_NAV_FALLBACK.map((item) => ({ slug: item.slug }));
}
export async function fetchSeriesPage(_slug: string): Promise<SeriesPage | null> {
  return null;
}
