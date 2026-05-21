import Client from "./client"; // 確保這個指向你的 SmasmallStory 元件檔案

export const revalidate = 60;

// 🌟 動態獲取網址：目前使用臨時網域
const getSiteUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "https://weibo-alpha.vercel.app";
};

const SITE_URL = getSiteUrl();
const MAIN_CORP_URL = "https://www.weiz.com.tw"; // 母公司網址

// ============================================================================
// 1. 強大的 SEO Metadata 設定 (昔馬品牌故事專屬)
// ============================================================================
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "品牌故事｜昔馬 SMASMALL - 復古未來主義理容科技",
  description:
    "了解昔馬 SMASMALL 的品牌故事。由台灣總代理威柏科技原廠授權，專注於全合金工藝與高端磁吸機構，為追求極致的品味男士打造專屬的理容藝術品。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "品牌故事",
    "威柏科技",
    "電動刮鬍刀",
    "全合金工藝",
    "復古未來主義",
    "男士精品",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/about",
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "品牌故事｜昔馬 SMASMALL - 復古未來主義理容科技",
    description:
      "Ignite Possibilities Through Ultimate Innovation. 以極致硬派工藝，重新定義品味男士的日常剃鬚革命。",
    images: [
      {
        url: "/images/defender-og.png", // 統一使用全英文命名的 OG 圖片
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬品牌故事與核心理念",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "品牌故事｜昔馬 SMASMALL - 復古未來主義理容科技",
    description: "以極致硬派工藝，重新定義品味男士的日常剃鬚革命。",
    images: ["/images/defender-og.png"],
  },
};

export default function AboutPage() {
  // ===================== 👑 結構化資料 1：品牌與代理商實體 (Organization) =====================
  const schemaBusiness = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${MAIN_CORP_URL}/#organization`,
    name: "威柏實業 (Weiz)",
    url: MAIN_CORP_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo-white.png`,
    },
    image: `${SITE_URL}/images/defender-og.png`,
    description:
      "威柏科技有限公司（Weibo Technology）為台灣唯一官方授權總代理，引進全球高端理容品牌 SMASMALL 昔馬，致力於提供品味男士極致的理容體驗。",
    brand: {
      "@type": "Brand",
      name: "SMASMALL 昔馬",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+886-2-00000000", // 建議替換為威柏實際電話
      areaServed: "TW",
      availableLanguage: ["zh-TW", "en"],
    },
    sameAs: [
      "https://www.facebook.com/249wzrtv/",
      "https://www.instagram.com/weiz.3c/?hl=zh-tw",
      "https://page.line.me/157yqtwl",
    ],
  };

  // ===================== 👑 結構化資料 2：關於我們網頁資訊 (AboutPage) =====================
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about/#webpage`,
    url: `${SITE_URL}/about`,
    name: "關於昔馬 SMASMALL｜品牌故事與極致工藝",
    description:
      "了解 SMASMALL 昔馬的品牌願景、第一原則與創新技術，探索復古未來主義理容科技。",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${MAIN_CORP_URL}/#organization`,
    },
  };

  // ===================== 👑 結構化資料 3：麵包屑導覽 (BreadcrumbList) =====================
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/about/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "品牌故事",
        item: `${SITE_URL}/about`,
      },
    ],
  };

  return (
    <>
      {/* 獨立拆分，逐一注入 JSON-LD 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      {/* 🌟 渲染主頁面元件：移除了多餘且報錯的 faqs 屬性 */}
      <Client />
    </>
  );
}
