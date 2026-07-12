import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { buildAccessoryCatalog } from "@/data/accessories.server";
import {
  fetchAccessoryDetailBySlug,
  fetchAccessoriesFromWoo,
} from "@/lib/accessoriesWoo.server";
import { absoluteUrl, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { accessoryDetailPath, normalizeRouteSlug } from "@/lib/utils";
import { buildAccessoryDetailSchemas } from "@/lib/seo/schemas";
import AccessoryDetailClient from "./AccessoryDetailClient";

const SITE_URL = getSiteUrl();

/**
 * 中文 slug 不可走 ISR：Next.js 會把路徑寫進 x-next-cache-tags，
 * 非 ASCII 字元會觸發 ERR_INVALID_CHAR → 正式環境 500。
 * @see https://github.com/vercel/next.js/issues/93142
 */
export const dynamic = "force-dynamic";

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
  const { id: rawId } = await params;
  const id = normalizeRouteSlug(rawId);
  const detail = await fetchAccessoryDetailBySlug(id);

  if (!detail) {
    return { title: "商品不存在" };
  }

  const title = detail.seoTitle?.trim() || `${detail.title}｜昔馬 SMASMALL`;
  const description =
    detail.seoDescription?.trim() ||
    detail.shortDesc ||
    `昔馬 SMASMALL ${detail.title}。由台灣總代理威柏科技原廠授權，提供完善保固與售後。`;
  const ogImage = detail.images?.[0] ?? SEO_CONFIG.defaultOgImage;
  const pageUrl = accessoryDetailPath(id);
  const keywords = [
    "昔馬",
    "SMASMALL",
    detail.title,
    "電動刮鬍刀",
    "威柏科技",
    "配件",
    "禮盒",
    ...(detail.seoFocusKeyword ? [detail.seoFocusKeyword] : []),
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
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
  const { id: rawId } = await params;
  const id = normalizeRouteSlug(rawId);
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
