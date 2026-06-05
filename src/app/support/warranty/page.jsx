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
  title: "產品保固與註冊｜SMASMALL 昔馬一年原廠保固",
  description:
    "SMASMALL 昔馬電動刮鬍刀享有 12 個月原廠保固，由威柏科技台灣總代理提供售後服務。了解保固範圍、申請流程與保固註冊方式。",
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
    title: "產品保固與註冊｜SMASMALL 昔馬",
    description:
      "12 個月原廠保固，台灣總代理威柏科技提供完善售後服務與保固申請協助。",
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬產品保固與註冊",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "產品保固與註冊｜SMASMALL 昔馬",
    description: "SMASMALL 昔馬 12 個月原廠保固說明與申請流程。",
    images: [SEO_CONFIG.defaultOgImage],
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
