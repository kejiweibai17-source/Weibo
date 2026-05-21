import { Metadata } from "next";
import Client from "./client"; // 確保這裡指向你的 SmasmallCollections 元件檔案

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
// 1. 強大的 SEO Metadata 設定 (昔馬專屬)
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "探索昔馬 SMASMALL 系列｜全合金精品電動刮鬍刀｜台灣總代理威柏科技",
  description:
    "為追求極致的品味男士，打造專屬的理容藝術品。探索昔馬 SMASMALL S1經典青春版、S3小金剛旗艦版與黑夜騎士系列。由台灣總代理威柏科技提供最完善的原廠保固與品質承諾。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "威柏科技",
    "電動刮鬍刀",
    "合金刮鬍刀",
    "S1經典版",
    "S3旗艦版",
    "男士理容",
    "送禮首選",
    "精品刮鬍刀",
  ],
  alternates: {
    // ⚠️ 這裡請換成你實際的路由，例如 "/brand" 或 "/about"
    canonical: "/brand",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    // ⚠️ 這裡請換成你實際的路由
    url: "/brand",
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "探索昔馬 SMASMALL 系列｜全合金精品電動刮鬍刀",
    description:
      "為追求極致的品味男士，打造專屬的理容藝術品。探索昔馬 SMASMALL 產品系列，原廠授權品質承諾。",
    images: [
      {
        url: "/images/defender-og.png", // 使用你剛剛設定好的全英文 OG 圖片
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬品牌系列總覽",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "探索昔馬 SMASMALL 系列｜全合金精品電動刮鬍刀",
    description:
      "為追求極致的品味男士，打造專屬的理容藝術品。台灣總代理威柏科技。",
    images: ["/images/defender-og.png"],
  },
};

// ============================================================================
// 2. Server Component 主頁面與強化的 JSON-LD
// ============================================================================
export default function BrandPage() {
  // 👑 結構化資料 1：Organization & Brand (定義代理商與品牌的關係)
  const schemaBusiness = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${MAIN_CORP_URL}/#organization`,
    name: "威柏實業 (Weiz)",
    url: MAIN_CORP_URL,
    logo: `${MAIN_CORP_URL}/logo.png`,
    description:
      "威柏科技為昔馬 SMASMALL 於台灣之合法總代理，提供全系列高階男士理容產品與完善售後保固。",
    brand: {
      "@type": "Brand",
      name: "SMASMALL 昔馬",
      logo: `${SITE_URL}/images/logo-white.png`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+886-2-00000000", // 替換為實際電話
      areaServed: "TW",
      availableLanguage: ["zh-TW", "en"],
    },
    sameAs: [
      "https://www.facebook.com/249wzrtv/",
      "https://www.instagram.com/weiz.3c/?hl=zh-tw",
      "https://page.line.me/157yqtwl",
    ],
  };

  // 👑 結構化資料 2：CollectionPage (宣告這是一個「產品系列」頁面)
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    // ⚠️ 這裡請換成你實際的路由
    "@id": `${SITE_URL}/brand/#webpage`,
    url: `${SITE_URL}/brand`,
    name: "探索昔馬 SMASMALL 產品系列",
    description:
      "深入了解昔馬 SMASMALL S1 經典合金系列與專屬理容配件。由台灣總代理威柏科技原廠授權。",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${MAIN_CORP_URL}/#organization`,
    },
  };

  // 👑 結構化資料 3：BreadcrumbList (麵包屑導覽)
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // ⚠️ 這裡請換成你實際的路由
    "@id": `${SITE_URL}/brand/#breadcrumb`,
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
        name: "探索昔馬系列",
        // ⚠️ 這裡請換成你實際的路由
        item: `${SITE_URL}/brand`,
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

      {/* ==================================================================
          4. 渲染包含動畫的 Client 端元件
          注意：因為你的 SmasmallCollections 元件不需要 props，所以直接呼叫 <Client />
          這同時解決了之前的 TypeScript 報錯問題！
          ================================================================== */}
      <main className="w-full bg-[#f8f9fb] min-h-screen">
        <Client />
      </main>
    </>
  );
}
