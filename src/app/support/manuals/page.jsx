import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
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
  title: {
    absolute: "昔馬 SMASMALL 刮鬍刀保養教學｜延長壽命這樣做",
  },
  description:
    "刮鬍刀越用越鈍？昔馬 SMASMALL 完整保養指南教你正確充電、IPX7 水洗清潔與刀頭保養，3 分鐘上手，讓愛刀常保鋒利如新。",
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
    title: "昔馬 SMASMALL 刮鬍刀保養教學｜延長壽命這樣做",
    description:
      "刮鬍刀越用越鈍？昔馬 SMASMALL 完整保養指南教你正確充電、IPX7 水洗清潔與刀頭保養，3 分鐘上手，讓愛刀常保鋒利如新。",
    images: [
      {
        url: ogImageUrl("/images/og-1.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬使用與保養指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 刮鬍刀保養教學｜延長壽命這樣做",
    description:
      "刮鬍刀越用越鈍？昔馬 SMASMALL 完整保養指南教你正確充電、IPX7 水洗清潔與刀頭保養，3 分鐘上手，讓愛刀常保鋒利如新。",
    images: [ogImageUrl("/images/og-1.jpg")],
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
