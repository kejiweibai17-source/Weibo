import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildSupportWebPageSchema,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/policies";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "使用條款與政策｜SMASMALL 昔馬官方網站",
  description:
    "SMASMALL 昔馬官方網站服務條款、隱私權政策、運送與退換貨規範及防詐騙宣導。由威柏科技台灣總代理提供。",
  keywords: [
    "服務條款",
    "隱私權政策",
    "運送退換貨",
    "防詐騙",
    "SMASMALL",
    "威柏科技",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: "使用條款與政策｜SMASMALL 昔馬",
    description:
      "了解服務條款、隱私權、運送退換貨及消費安全相關政策。",
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬使用條款與政策",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "使用條款與政策｜SMASMALL 昔馬",
    description: "SMASMALL 昔馬官方網站使用條款與政策說明。",
    images: [SEO_CONFIG.defaultOgImage],
  },
};

export default function PoliciesPage() {
  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬使用條款與政策",
      description:
        "服務條款、隱私權政策、運送與退換貨、防詐騙宣導之完整說明。",
      pageType: "WebPage",
    }),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support/faq" },
      { name: "使用條款與政策", path: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
