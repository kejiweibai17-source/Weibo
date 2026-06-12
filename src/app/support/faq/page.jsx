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
  title: {
    absolute: "昔馬 SMASMALL 常見問題｜充電・防水・保固一次解答",
  },
  description:
    "刮鬍刀能水洗嗎？充飽電用多久？昔馬 SMASMALL 常見問題一次解答，涵蓋續航、IPX7 防水、保固範圍與退換貨，找不到答案立即聯繫線上客服。",
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
    title: "昔馬 SMASMALL 常見問題｜充電・防水・保固一次解答",
    description:
      "刮鬍刀能水洗嗎？充飽電用多久？昔馬 SMASMALL 常見問題一次解答，涵蓋續航、IPX7 防水、保固範圍與退換貨，找不到答案立即聯繫線上客服。",
    images: [
      {
        url: "/images/og-4.jpg",
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬常見問題 FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 常見問題｜充電・防水・保固一次解答",
    description:
      "刮鬍刀能水洗嗎？充飽電用多久？昔馬 SMASMALL 常見問題一次解答，涵蓋續航、IPX7 防水、保固範圍與退換貨，找不到答案立即聯繫線上客服。",
    images: ["/images/og-4.jpg"],
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
