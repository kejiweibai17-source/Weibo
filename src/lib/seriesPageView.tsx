import { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildSeriesPageSchemas } from "@/lib/seo/schemas";
import type { SeriesPage } from "@/lib/seriesProducts.types";
import SeriesPageClient from "@/app/series/[slug]/client";

const SITE_URL = getSiteUrl();

export function getSeriesCanonicalPath(slug: string): string {
  return `/series/${encodeURIComponent(slug)}`;
}

export function buildSeriesMetadata(page: SeriesPage): Metadata {
  const canonical = getSeriesCanonicalPath(page.slug);
  const ogImage = page.ogImage
    ? page.ogImage.startsWith("http")
      ? page.ogImage
      : `${SITE_URL}${page.ogImage}`
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: [
      "昔馬",
      "SMASMALL",
      page.title,
      "系列商品",
      "電動刮鬍刀",
      "鋅合金",
      "威柏科技",
      "台灣總代理",
      "嘉義",
    ],
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      url: `${SITE_URL}${canonical}`,
      siteName: SEO_CONFIG.siteName,
      title: page.seoTitle,
      description: page.seoDescription,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function SeriesPageView({ page }: { page: SeriesPage }) {
  const schemas = buildSeriesPageSchemas(page, SITE_URL);

  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <SeriesPageClient page={page} />
    </>
  );
}
