import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl, ogImageUrl } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

// ============================================================================
// 威柏科技 (WEIBO) 企業介紹頁 SEO Metadata
// ============================================================================
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "威柏科技｜從進出口到總代理，網羅全球創意生活品牌",
  },
  description:
    "威柏科技貿易有限公司成立於 2015 年，立足全球視野、深耕台灣市場，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者。",
  keywords: [
    "威柏科技",
    "WEIBO",
    "總代理",
    "品牌代理",
    "國際外銷",
    "台灣全通路",
    "企業採購",
    "昔馬 SMASMALL",
  ],
  alternates: {
    canonical: "/weibo",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/weibo",
    siteName: "昔馬電動刮鬍刀",
    title: "威柏科技｜從進出口到總代理，網羅全球創意生活品牌",
    description:
      "威柏科技貿易有限公司成立於 2015 年，立足全球視野、深耕台灣市場，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者。",
    images: [
      {
        url: ogImageUrl("/images/og-3.jpg"),
        width: 1200,
        height: 630,
        alt: "威柏科技企業介紹",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "威柏科技｜從進出口到總代理，網羅全球創意生活品牌",
    description:
      "威柏科技貿易有限公司成立於 2015 年，立足全球視野、深耕台灣市場，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者。",
    images: [ogImageUrl("/images/og-3.jpg")],
  },
};

export default function WeiboPage() {
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/weibo/#webpage`,
    url: `${SITE_URL}/weibo`,
    name: "威柏科技｜企業介紹",
    description:
      "威柏科技貿易有限公司成立於 2015 年，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者。",
    isPartOf: { "@id": ids.website },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "威柏科技", path: "/weibo" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
