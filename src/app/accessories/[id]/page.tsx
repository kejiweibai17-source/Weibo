import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { resolveSeriesImages } from "@/data/accessories";
import {
  buildAccessoryCatalog,
  getAccessoryCatalogItem,
} from "@/data/accessories.server";
import { absoluteUrl, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildAccessoryDetailSchemas } from "@/lib/seo/schemas";
import AccessoryDetailClient from "./AccessoryDetailClient";

const SITE_URL = getSiteUrl();

export const revalidate = 3600;

export async function generateStaticParams() {
  return buildAccessoryCatalog().map((item) => ({ id: item.id }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getAccessoryCatalogItem(id);

  if (!item) {
    return { title: "商品不存在" };
  }

  const title = `${item.title}｜昔馬 SMASMALL`;
  const description =
    item.detail?.shortDesc ??
    `探索昔馬 SMASMALL ${item.title}。由台灣總代理威柏科技原廠授權，提供完善保固與售後。`;
  const images = resolveSeriesImages(
    item.series,
    item.detail?.imageFiles ?? item.imageFiles ?? [],
  );
  const ogImage = images[0] ?? SEO_CONFIG.defaultOgImage;
  const pageUrl = `/accessories/${id}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "昔馬",
      "SMASMALL",
      item.title,
      "電動刮鬍刀",
      "威柏科技",
      "配件",
      "禮盒",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      url: pageUrl,
      siteName: SEO_CONFIG.siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(SITE_URL, ogImage)],
    },
  };
}

export default async function AccessoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getAccessoryCatalogItem(id);

  if (!item) {
    notFound();
  }

  const schemas = buildAccessoryDetailSchemas(item, SITE_URL);

  return (
    <>
      <JsonLd data={schemas} />
      <AccessoryDetailClient productId={id} />
    </>
  );
}
