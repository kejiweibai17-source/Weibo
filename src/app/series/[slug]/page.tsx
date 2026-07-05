import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchSeriesPage,
  fetchSeriesSlugs,
  SERIES_PAGE_REVALIDATE,
} from "@/lib/seriesProducts.server";
import { buildSeriesMetadata, SeriesPageView } from "@/lib/seriesPageView";

type Props = {
  params: { slug: string };
};

/** SSG：建置時預先產生已知 slug；ISR：每小時背景更新 */
export const revalidate = SERIES_PAGE_REVALIDATE;

/** 允許 WP 新增系列後，首次請求時自動產生靜態頁並快取 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await fetchSeriesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const page = await fetchSeriesPage(slug);
  if (!page) {
    return { title: "找不到系列產品" };
  }
  return buildSeriesMetadata(page);
}

export default async function SeriesPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const page = await fetchSeriesPage(slug);
  if (!page) notFound();

  return <SeriesPageView page={page} />;
}
