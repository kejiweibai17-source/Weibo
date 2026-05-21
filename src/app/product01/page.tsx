import { Metadata } from "next";
import QaClient from "./client";

// 🌟 動態獲取網址：已替換為目前的臨時網域
const getSiteUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "https://weibo-alpha.vercel.app"; // 🌟 這裡已更新
};

const SITE_URL = getSiteUrl();
const MAIN_CORP_URL = "https://www.weiz.com.tw"; // 母公司網址

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
  // 👑 結構化資料 1：Organization (宣告母公司實體，傳遞網域權重)
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${MAIN_CORP_URL}/#organization`,
    name: "威柏實業 (Weiz)",
    url: MAIN_CORP_URL,
    logo: `${MAIN_CORP_URL}/logo.png`, // 替換為實際威柏科技的 Logo
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+886-2-00000000", // 替換為威柏實際電話
      contactType: "customer service",
      areaServed: "TW",
      availableLanguage: "zh-TW",
    },
    sameAs: [
      "https://www.facebook.com/249wzrtv/",
      "https://www.instagram.com/weiz.3c/?hl=zh-tw",
      "https://page.line.me/157yqtwl",
    ],
  };

  // 👑 結構化資料 2：Product (極度詳細的商品定義)
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
    brand: {
      "@type": "Brand",
      name: "SMASMALL 昔馬",
    },
    sku: "SM-DEFENDER-PLUS",
    mpn: "SM-DEF-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product01`,
      priceCurrency: "TWD",
      price: "2480", // 實際售價
      priceValidUntil: "2027-12-31", // 促銷有效期限
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      // 將賣家指向威柏科技的 Organization ID
      seller: {
        "@id": `${MAIN_CORP_URL}/#organization`,
      },
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
    publisher: {
      "@id": `${MAIN_CORP_URL}/#organization`,
    },
  };

  // 👑 結構化資料 4：WebPage (網頁基礎資訊)
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/product01/#webpage`,
    url: `${SITE_URL}/product01`,
    name: "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀｜戰損塗裝、磁吸快拆",
    description:
      "探索昔馬 SMASMALL 捍衛者+ 全合金戰損刮鬍刀。獨創硬派戰損塗裝，展現男士極致理容美學。",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "SMASMALL 昔馬 by 威柏科技",
      url: SITE_URL,
    },
    about: {
      "@id": `${SITE_URL}/product01/#product`,
    },
  };

  // 👑 結構化資料 5：BreadcrumbList (麵包屑)
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "威柏科技",
        item: MAIN_CORP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "昔馬 SMASMALL",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "捍衛者+ 戰損版",
        item: `${SITE_URL}/product01`,
      },
    ],
  };

  return (
    <>
      {/* ==================================================================
          3. 注入 JSON-LD 結構化資料
          ================================================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaVideo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      {/* ==================================================================
          4. 渲染 Client Component 
          ================================================================== */}
      <main className="w-full bg-black min-h-screen">
        <QaClient />
      </main>
    </>
  );
}
