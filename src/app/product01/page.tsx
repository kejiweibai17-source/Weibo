import { Metadata } from "next";
import QaClient from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

// ============================================================================
// 1. 強大的 SEO Metadata 設定
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀｜戰損塗裝、磁吸快拆",
  description:
    "探索昔馬 SMASMALL 捍衛者+ 全合金戰損刮鬍刀。獨創硬派戰損塗裝，搭載雙環開放式浮動圓刀頭與荷蘭進口自銳刀片。1小時快充，60天極致續航，展現男士極致理容美學。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "捍衛者",
    "電動刮鬍刀",
    "全合金刮鬍刀",
    "戰損塗裝",
    "磁吸快拆刀頭",
    "男士理容",
    "威柏科技",
  ],
  alternates: {
    canonical: "/product01",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://weibo-alpha.vercel.app/product01", // 直接寫死絕對路徑
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀",
    description:
      "硬派美學，戰損塗裝。搭載荷蘭進口刀片與一秒磁吸快拆技術，為亞洲男士打造的頂級理容體驗。",
    images: [
      {
        // 🌟 核心修復：直接貼上你找到的、已經過 URL 編碼的正確圖片網址
        url: "https://weibo-alpha.vercel.app/images/%E6%8D%8D%E8%A1%9B%E8%80%85-001.png",
        width: 1200,
        height: 630,
        alt: "昔馬 SMASMALL 捍衛者+ 全合金戰損刮鬍刀",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀",
    description: "硬派美學，戰損塗裝。搭載荷蘭進口刀片與一秒磁吸快拆技術。",
    // 🌟 這裡也同步更新為編碼後的網址
    images: [
      "https://weibo-alpha.vercel.app/images/%E6%8D%8D%E8%A1%9B%E8%80%85-001.png",
    ],
  },
};

// ============================================================================
// 2. Server Component 主頁面與強化的 JSON-LD
// ============================================================================
export default function Product01Page() {
  const schemaProduct = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}/product01/#product`,
    name: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀",
    image: [
      `${SITE_URL}/images/捍衛者/捍衛者-01.png`,
      `${SITE_URL}/images/捍衛者/捍衛者-02.png`,
      `${SITE_URL}/images/捍衛者/捍衛者-03.png`,
    ],
    description:
      "高溫壓鑄全合金機身，手工打磨戰損塗裝。搭載荷蘭進口自研磨刀片、雙環超薄刀網與毫秒級高速抗震低噪馬達，支援 IPX7 級防水。",
    brand: { "@id": ids.brand },
    sku: "SM-DEFENDER-PLUS",
    mpn: "SM-DEF-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product01`,
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
    "@id": `${SITE_URL}/product01/#webpage`,
    url: `${SITE_URL}/product01`,
    name: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀｜戰損塗裝、磁吸快拆",
    description:
      "探索昔馬 SMASMALL 捍衛者+ 全合金戰損刮鬍刀。獨創硬派戰損塗裝，展現男士極致理容美學。",
    isPartOf: { "@id": ids.website },
    about: { "@id": `${SITE_URL}/product01/#product` },
    mainEntity: { "@id": `${SITE_URL}/product01/#product` },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaProduct,
    schemaVideo,
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "捍衛者+", path: "/product01" },
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
