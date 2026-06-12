import { Metadata } from "next";
import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

// ============================================================================
// 1. 強大的 SEO Metadata 設定 (昔馬專屬)
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "昔馬 SMASMALL｜森田愛用・2024 熱門刮鬍刀領導品牌",
  },
  description:
    "昔馬 SMASMALL，Smart + Small 智能個人護理品牌。鋅合金工藝、復古未來主義設計，日本藝人森田愛用，重新定義男士儀容美學。探索完整品牌系列。",
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
    title: "昔馬 SMASMALL｜森田愛用・2024 熱門刮鬍刀領導品牌",
    description:
      "昔馬 SMASMALL，Smart + Small 智能個人護理品牌。鋅合金工藝、復古未來主義設計，日本藝人森田愛用，重新定義男士儀容美學。探索完整品牌系列。",
    images: [
      {
        url: ogImageUrl("/images/og-1.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬品牌系列總覽",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL｜森田愛用・2024 熱門刮鬍刀領導品牌",
    description:
      "昔馬 SMASMALL，Smart + Small 智能個人護理品牌。鋅合金工藝、復古未來主義設計，日本藝人森田愛用，重新定義男士儀容美學。探索完整品牌系列。",
    images: [ogImageUrl("/images/og-1.jpg")],
  },
};

// ============================================================================
// 2. Server Component 主頁面與強化的 JSON-LD
// ============================================================================
export default function BrandPage() {
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/brand/#webpage`,
    url: `${SITE_URL}/brand`,
    name: "探索昔馬 SMASMALL 產品系列",
    description:
      "深入了解昔馬 SMASMALL S1 經典合金系列與專屬理容配件。由台灣總代理威柏科技原廠授權。",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "探索昔馬系列", path: "/brand" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

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
