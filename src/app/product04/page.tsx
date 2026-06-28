import { Metadata } from "next";
import QaClient from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";
import { PRODUCT04_SLIDES } from "@/data/productSlides";

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);
const OG_IMAGE = `${SITE_URL}${PRODUCT04_SLIDES.ogImage}`;

// ============================================================================
// 1. SEO Metadata（OG 預覽圖取自 Slider04 第一張產品圖）
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 星座系列 CQ 電動刮鬍刀｜三色限量禮盒",
  description:
    "昔馬 SMASMALL 星座系列 CQ 電動刮鬍刀，三色限量禮盒設計。精緻星座圖騰外觀，搭載高性能馬達，是最佳生日與節慶禮品選擇。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "CQ系列",
    "星座系列",
    "電動刮鬍刀",
    "禮盒",
    "限量版",
    "男士理容",
    "威柏科技",
  ],
  alternates: {
    canonical: "/product04",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: `${SITE_URL}/product04`,
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "昔馬 SMASMALL 星座系列 CQ 電動刮鬍刀 三色限量禮盒",
    description:
      "精緻星座圖騰外觀，三色限量禮盒，搭載高性能馬達，是最佳生日與節慶禮品選擇。",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "昔馬 SMASMALL 星座系列 CQ 電動刮鬍刀 三色限量禮盒",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 星座系列 CQ 電動刮鬍刀 三色限量禮盒",
    description: "精緻星座圖騰外觀，三色限量禮盒，搭載高性能馬達。",
    images: [OG_IMAGE],
  },
};

// ============================================================================
// 2. Server Component 主頁面與強化的 JSON-LD
// ============================================================================
export default function Product01Page() {
  const schemaProduct = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}/product04/#product`,
    name: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀",
    image: [
      `${SITE_URL}/images/捍衛者/捍衛者-01.png`,
      `${SITE_URL}/images/捍衛者/捍衛者-02.png`,
      `${SITE_URL}/images/捍衛者/捍衛者-03.png`,
    ],
    description:
      "高溫壓鑄全合金機身，手工打磨戰損塗裝。搭載德國進口自研磨刀片、雙環超薄刀網與毫秒級高速抗震低噪馬達，支援 IPX7 級防水。",
    brand: { "@id": ids.brand },
    sku: "SM-DEFENDER-PLUS",
    mpn: "SM-DEF-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product04`,
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
      ratingValue: "4.9",
      reviewCount: "128",
    },
  };

  // 👑 結構化資料 3：VideoObject (針對首頁彈窗的 YouTube 影片)
  const schemaVideo = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "昔馬 SMASMALL 捍衛者+ 實測與工藝介紹",
    description:
      "深入了解昔馬 SMASMALL 捍衛者+ 的全合金壓鑄工藝與磁吸快拆技術實測展示。",
    thumbnailUrl: [
      `${SITE_URL}/images/捍衛者/捍衛者-01.png`, // 可換成 YouTube 封面圖
    ],
    uploadDate: "2024-05-20T08:00:00+08:00",
    embedUrl: "https://www.youtube.com/embed/j9MOH9FR-T8",
    publisher: { "@id": ids.organization },
  };

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/product04/#webpage`,
    url: `${SITE_URL}/product04`,
    name: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀｜戰損塗裝、磁吸快拆",
    description:
      "探索昔馬 SMASMALL 捍衛者+ 全合金戰損塗裝，展現男士極致理容美學。",
    isPartOf: { "@id": ids.website },
    about: { "@id": `${SITE_URL}/product04/#product` },
    mainEntity: { "@id": `${SITE_URL}/product04/#product` },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaProduct,
    schemaVideo,
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "捍衛者+", path: "/product04" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      {/* ==================================================================
          4. 渲染 Client Component 
          ================================================================== */}
      <main className="w-full bg-black min-h-screen">
        <QaClient />
      </main>
    </>
  );
}
