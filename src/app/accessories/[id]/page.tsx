import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { buildAccessoryCatalog } from "@/data/accessories.server";
import {
  ACCESSORY_PAGE_REVALIDATE,
  fetchAccessoryDetailBySlug,
  fetchAccessoriesFromWoo,
} from "@/lib/accessoriesWoo.server";
import { isAsciiSlug, toPublicProductSlug } from "@/lib/productPublicSlug";
import { absoluteUrl, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { accessoryDetailPath, normalizeRouteSlug } from "@/lib/utils";
import { buildAccessoryDetailSchemas } from "@/lib/seo/schemas";
import AccessoryDetailClient from "./AccessoryDetailClient";

const SITE_URL = getSiteUrl();

/** SSG：建置時預產英文 slug；ISR：每小時背景更新；後台 webhook 可立刻刷新 */
export const revalidate = ACCESSORY_PAGE_REVALIDATE;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await fetchAccessoriesFromWoo();
    return products
      .map((item) => ({ id: toPublicProductSlug(item.id) }))
      .filter((item) => isAsciiSlug(item.id));
  } catch {
    return buildAccessoryCatalog()
      .map((item) => ({ id: toPublicProductSlug(item.id) }))
      .filter((item) => isAsciiSlug(item.id));
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
  const pageUrl = accessoryDetailPath(detail.id);
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
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: pageUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
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

  if (normalizeRouteSlug(id) !== normalizeRouteSlug(detail.id)) {
    permanentRedirect(accessoryDetailPath(detail.id));
  }

  const schemaSeed = {
    id: detail.id,
    title: detail.title,
    category: detail.category || "",
    series: detail.series || "",
    imageFiles: detail.images ?? [],
    detail: {
      shortDesc: detail.shortDesc,
      images: detail.images ?? [],
      imageFiles: detail.images ?? [],
      features: detail.features ?? [],
      details: detail.details ?? "",
      rating: detail.rating,
      reviews: detail.reviews,
      price: detail.price,
    },
  };
  const schemas = buildAccessoryDetailSchemas(schemaSeed, SITE_URL);
  const featureText = (detail.features ?? [])
    .map((feature) => {
      const body =
        feature.bullets?.length > 0
          ? feature.bullets.join("、")
          : feature.content || "";
      return body ? `${feature.title}：${body}` : feature.title;
    })
    .filter(Boolean);

  return (
    <>
      <JsonLd data={schemas} />
      <noscript>
        <article>
          <h1>{detail.title}</h1>
          {detail.shortDesc ? <p>{detail.shortDesc}</p> : null}
          {featureText.length > 0 ? (
            <ul>
              {featureText.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      </noscript>
      <AccessoryDetailClient productId={detail.id} initialProduct={detail} />
    </>
  );
}
