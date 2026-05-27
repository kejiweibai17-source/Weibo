import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

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
