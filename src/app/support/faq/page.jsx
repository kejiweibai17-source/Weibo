import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildFaqPageSchema,
  buildSupportWebPageSchema,
} from "@/lib/seo/schemas";
import { getAllSupportFaqs } from "@/data/supportContent";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/faq";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "常見問題 FAQ｜SMASMALL 昔馬電動刮鬍刀",
  description:
    "SMASMALL 昔馬電動刮鬍刀常見問題：產品特色、購買配送、保固售後、使用保養。由威柏科技台灣總代理提供完整解答。",
  keywords: [
    "昔馬 FAQ",
    "SMASMALL 常見問題",
    "電動刮鬍刀問答",
    "磁吸刀頭",
    "保固退換貨",
    "威柏科技客服",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: "常見問題 FAQ｜SMASMALL 昔馬",
    description:
      "關於昔馬全合金刮鬍刀、保固、配送與保養的常見問題完整解答。",
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬常見問題 FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "常見問題 FAQ｜SMASMALL 昔馬",
    description: "SMASMALL 昔馬電動刮鬍刀常見問題完整解答。",
    images: [SEO_CONFIG.defaultOgImage],
  },
};

export default function FaqPage() {
  const faqs = getAllSupportFaqs();

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬常見問題 FAQ",
      description:
        "產品技術、購買配送、保固售後與使用保養的常見問題解答。",
      pageType: "FAQPage",
    }),
    buildFaqPageSchema(faqs, `${SITE_URL}${PATH}`, `${SITE_URL}${PATH}#faq`),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: PATH },
      { name: "常見問題 FAQ", path: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Client />
    </>
  );
}
