import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl, ogImageUrl } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

// ============================================================================
// 1. 強大的 SEO Metadata 設定 (昔馬品牌故事專屬)
// ============================================================================
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "關於昔馬 SMASMALL｜2024 網路熱門刮鬍刀領導品牌的故事",
  },
  description:
    "為什麼眾多男士選擇昔馬 SMASMALL？我們以鋅合金壓鑄工藝與智能技術，打造復古未來主義個護品牌，森田愛用、媒體推薦。認識我們如何重新定義男士儀容。",
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
    siteName: "昔馬電動刮鬍刀",
    title: "關於昔馬 SMASMALL｜2024 網路熱門刮鬍刀領導品牌的故事",
    description:
      "為什麼眾多男士選擇昔馬 SMASMALL？我們以鋅合金壓鑄工藝與智能技術，打造復古未來主義個護品牌，森田愛用、媒體推薦。認識我們如何重新定義男士儀容。",
    images: [
      {
        url: ogImageUrl("/images/og-3.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬品牌故事與核心理念",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "關於昔馬 SMASMALL｜2024 網路熱門刮鬍刀領導品牌的故事",
    description:
      "為什麼眾多男士選擇昔馬 SMASMALL？我們以鋅合金壓鑄工藝與智能技術，打造復古未來主義個護品牌，森田愛用、媒體推薦。認識我們如何重新定義男士儀容。",
    images: [ogImageUrl("/images/og-3.jpg")],
  },
};

export default function AboutPage() {
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about/#webpage`,
    url: `${SITE_URL}/about`,
    name: "關於昔馬 SMASMALL｜品牌故事與極致工藝",
    description:
      "了解 SMASMALL 昔馬的品牌願景、第一原則與創新技術，探索復古未來主義理容科技。",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "品牌故事", path: "/about" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
