import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildAccessoryCatalog,
} from "@/data/accessories.server";
import {
  fetchAccessoryDetailBySlug,
  fetchAccessoriesFromWoo,
} from "@/lib/accessoriesWoo.server";
import { absoluteUrl, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildAccessoryDetailSchemas } from "@/lib/seo/schemas";
import AccessoryDetailClient from "./AccessoryDetailClient";

const SITE_URL = getSiteUrl();

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await fetchAccessoriesFromWoo();
    return products.map((item) => ({ id: item.id }));
  } catch {
    return buildAccessoryCatalog().map((item) => ({ id: item.id }));
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await fetchAccessoryDetailBySlug(id);

  if (!detail) {
    return { title: "商品不存在" };
  }

  const title = `${detail.title}｜昔馬 SMASMALL`;
  const description =
    detail.shortDesc ??
    `探索昔馬 SMASMALL ${detail.title}。由台灣總代理威柏科技原廠授權，提供完善保固與售後。`;
  const ogImage = detail.images?.[0] ?? SEO_CONFIG.defaultOgImage;
  const pageUrl = `/accessories/${id}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "昔馬",
      "SMASMALL",
      detail.title,
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
          alt: detail.title,
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
  const detail = await fetchAccessoryDetailBySlug(id);

  if (!detail) {
    notFound();
  }

  const schemaSeed = {
    id: detail.id,
    title: detail.title,
    category: "Misc",
    series: "Defender",
    imageFiles: [],
    detail: {
      shortDesc: detail.shortDesc,
      imageFiles: detail.images ?? [],
      features: detail.features ?? [],
      details: detail.details ?? "",
      rating: detail.rating,
      reviews: detail.reviews,
      price: detail.price,
    },
  };
  const schemas = buildAccessoryDetailSchemas(schemaSeed, SITE_URL);

  return (
    <>
      <JsonLd data={schemas} />
      <AccessoryDetailClient productId={id} />
    </>
  );
}
