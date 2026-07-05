import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchSeriesPage,
  SERIES_PAGE_REVALIDATE,
} from "@/lib/seriesProducts.server";
import {
  type LegacyProductPath,
  LEGACY_PRODUCT_SLUGS,
} from "@/lib/seriesProducts.legacy";
import { buildSeriesMetadata, SeriesPageView } from "@/lib/seriesPageView";

export function createLegacySeriesPage(legacyPath: LegacyProductPath) {
  const seriesSlug = LEGACY_PRODUCT_SLUGS[legacyPath];

  async function generateMetadata(): Promise<Metadata> {
    const page = await fetchSeriesPage(seriesSlug);
    if (!page) {
      return { title: "找不到系列產品" };
    }
    return buildSeriesMetadata(page);
  }

  async function Page() {
    const page = await fetchSeriesPage(seriesSlug);
    if (!page) notFound();
    return <SeriesPageView page={page} />;
  }

  return {
    generateMetadata,
    default: Page,
    revalidate: SERIES_PAGE_REVALIDATE,
  };
}
