import { Metadata } from "next";
import QaClient from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";
import { PRODUCT05_SLIDES } from "@/data/productSlides";

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);
const OG_IMAGE = `${SITE_URL}${PRODUCT05_SLIDES.ogImage}`;

// ============================================================================
// 1. SEO Metadata
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀｜旗艦級三刀頭設計",
  description:
    "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀。三組獨立浮動刀頭大面積覆蓋，磁吸快拆、IPX7 防水、Type-C 快充，旗艦工藝滿足日常理容需求。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "小金剛",
    "三刀頭",
    "旗艦電動刮鬍刀",
    "電動刮鬍刀",
    "IPX7防水",
    "男士理容",
    "威柏科技",
  ],
  alternates: {
    canonical: "/product05",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: `${SITE_URL}/product05`,
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀",
    description:
      "三組獨立浮動刀頭大面積覆蓋，磁吸快拆、IPX7 防水、Type-C 快充，旗艦工藝一次到位。",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀",
    description: "三組獨立浮動刀頭，磁吸快拆、IPX7 防水、Type-C 快充。",
    images: [OG_IMAGE],
  },
};

// ============================================================================
// 2. Server Component 主頁面與 JSON-LD
// ============================================================================
export default function Product05Page() {
  const schemaProduct = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}/product05/#product`,
    name: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀",
    image: [
      `${SITE_URL}/images/accessories/小金剛旗艦三刀頭電動刮鬍刀/情境圖/1.jpg`,
      `${SITE_URL}/images/accessories/小金剛旗艦三刀頭電動刮鬍刀/情境圖/2.jpg`,
    ],
    description:
      "三組獨立浮動刀頭同步運作，大面積覆蓋一次剃乾淨。磁吸快拆刀頭、IPX7 全機防水、Type-C 快充，旗艦工藝滿足日常理容需求。",
    brand: { "@id": ids.brand },
    sku: "SM-XJG-01",
    mpn: "SM-XJG-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product05`,
      priceCurrency: "TWD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ids.organization },
      availableAtOrFrom: { "@id": ids.localBusiness },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TW",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: "7",
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "TWD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "TW",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "64",
    },
  };

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/product05/#webpage`,
    url: `${SITE_URL}/product05`,
    name: "昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀｜三刀頭旗艦",
    description:
      "探索昔馬 SMASMALL 小金剛旗艦三刀頭電動刮鬍刀，三組獨立浮動刀頭，旗艦工藝滿足日常理容。",
    isPartOf: { "@id": ids.website },
    about: { "@id": `${SITE_URL}/product05/#product` },
    mainEntity: { "@id": `${SITE_URL}/product05/#product` },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaProduct,
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "小金剛旗艦三刀頭", path: "/product05" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <main className="w-full bg-black min-h-screen">
        <QaClient />
      </main>
    </>
  );
}
