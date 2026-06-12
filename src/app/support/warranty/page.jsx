import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildSupportWebPageSchema,
  buildWarrantyPolicySchema,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/warranty";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "昔馬 SMASMALL 保固登錄｜線上 1 分鐘完成・保固 12 個月",
  },
  description:
    "買了記得登錄保固！昔馬 SMASMALL 提供機身 12 個月雲端保固，透過 LINE @weibo 或掃 QRcode 即可完成註冊，售後安心無負擔，立即登錄。",
  keywords: [
    "昔馬保固",
    "SMASMALL 保固",
    "電動刮鬍刀保固",
    "威柏科技售後",
    "產品註冊",
    "原廠保固",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: "昔馬 SMASMALL 保固登錄｜線上 1 分鐘完成・保固 12 個月",
    description:
      "買了記得登錄保固！昔馬 SMASMALL 提供機身 12 個月雲端保固，透過 LINE @weibo 或掃 QRcode 即可完成註冊，售後安心無負擔，立即登錄。",
    images: [
      {
        url: "/images/og-4.jpg",
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬產品保固與註冊",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 保固登錄｜線上 1 分鐘完成・保固 12 個月",
    description:
      "買了記得登錄保固！昔馬 SMASMALL 提供機身 12 個月雲端保固，透過 LINE @weibo 或掃 QRcode 即可完成註冊，售後安心無負擔，立即登錄。",
    images: ["/images/og-4.jpg"],
  },
};

export default function WarrantyPage() {
  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬產品保固與註冊",
      description:
        "12 個月原廠保固、保固申請流程、保固範圍說明與購買憑證留存指引。",
      pageType: "WebPage",
    }),
    buildWarrantyPolicySchema(SITE_URL),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support/faq" },
      { name: "產品保固與註冊", path: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
