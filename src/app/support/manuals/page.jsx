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
const PATH = "/support/manuals";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "使用與保養指南｜SMASMALL 昔馬電動刮鬍刀",
  description:
    "SMASMALL 昔馬電動刮鬍刀使用與保養指南：日常清潔、刀頭保養、IPX7 防水使用、收納充電建議。由威柏科技台灣總代理提供完整售後支援。",
  keywords: [
    "昔馬保養",
    "電動刮鬍刀清潔",
    "磁吸刀頭保養",
    "IPX7 防水使用",
    "SMASMALL 說明書",
    "威柏科技",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: "使用與保養指南｜SMASMALL 昔馬",
    description:
      "正確保養讓全合金刮鬍刀歷久彌新。日常清潔、刀頭更換與防水使用完整指南。",
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬使用與保養指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "使用與保養指南｜SMASMALL 昔馬",
    description: "SMASMALL 昔馬電動刮鬍刀完整使用與保養指南。",
    images: [SEO_CONFIG.defaultOgImage],
  },
};

export default function ManualsPage() {
  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬使用與保養指南",
      description:
        "電動刮鬍刀日常清潔、刀頭保養、防水使用與收納充電的完整指南。",
      pageType: "WebPage",
    }),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support/faq" },
      { name: "使用與保養指南", path: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
