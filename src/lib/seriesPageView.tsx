import { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import { buildBreadcrumbList } from "@/lib/seo/schemas";
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
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      url: `${SITE_URL}${canonical}`,
      siteName: "SMASMALL 昔馬 by 威柏科技",
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
  const ids = entityIds(SITE_URL);
  const canonical = getSeriesCanonicalPath(page.slug);

  const breadcrumb = buildBreadcrumbList(SITE_URL, [
    { name: "首頁", path: "/" },
    { name: "系列商品", path: canonical },
    { name: page.title, path: canonical },
  ]);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}${canonical}#product`,
    name: page.title,
    description: page.seoDescription,
    brand: { "@id": ids.brand },
    ...(page.ogImage
      ? {
          image: page.ogImage.startsWith("http")
            ? page.ogImage
            : `${SITE_URL}${page.ogImage}`,
        }
      : {}),
    ...(page.wcProductId
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/accessories/${page.wcProductId}`,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={productSchema} />
      <SeriesPageClient page={page} />
    </>
  );
}
