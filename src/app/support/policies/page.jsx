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
  title: {
    absolute: "昔馬 SMASMALL 使用條款與隱私政策｜威柏科技 WEIBO",
  },
  description:
    "昔馬 SMASMALL 官網使用條款、隱私權與個資保護說明，清楚說明資料蒐集、會員權益與購物規範，保障你每一次的瀏覽與消費權益。",
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
    title: "昔馬 SMASMALL 使用條款與隱私政策｜威柏科技 WEIBO",
    description:
      "昔馬 SMASMALL 官網使用條款、隱私權與個資保護說明，清楚說明資料蒐集、會員權益與購物規範，保障你每一次的瀏覽與消費權益。",
    images: [
      {
        url: "/images/og-4.jpg",
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬使用條款與政策",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 使用條款與隱私政策｜威柏科技 WEIBO",
    description:
      "昔馬 SMASMALL 官網使用條款、隱私權與個資保護說明，清楚說明資料蒐集、會員權益與購物規範，保障你每一次的瀏覽與消費權益。",
    images: ["/images/og-4.jpg"],
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
