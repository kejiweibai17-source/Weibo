import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildFaqPageSchema,
  buildSupportWebPageSchema,
  buildSiteNavigationSchema,
} from "@/lib/seo/schemas";
import { getAllSupportFaqs } from "@/data/supportContent";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/faq";
const PAGE_URL = `${SITE_URL}${PATH}`;

const TITLE = "昔馬 SMASMALL 常見問題｜充電・防水・保固一次解答";
const DESCRIPTION =
  "刮鬍刀能水洗嗎？充飽電用多久？昔馬 SMASMALL 常見問題一次解答，涵蓋續航、IPX7 防水、保固範圍與退換貨，找不到答案立即聯繫線上客服。";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "昔馬 FAQ",
    "SMASMALL 常見問題",
    "電動刮鬍刀問答",
    "磁吸刀頭",
    "保固退換貨",
    "威柏科技客服",
    "IPX7 防水",
  ],
  alternates: { canonical: PATH },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: ogImageUrl("/images/og-4.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬常見問題 FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl("/images/og-4.jpg")],
  },
};

export default function FaqPage() {
  const faqs = getAllSupportFaqs();

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬常見問題 FAQ",
      description: DESCRIPTION,
      pageType: "WebPage",
      imagePath: "/images/og-4.jpg",
      speakableCssSelectors: ["h1", "h2", "button", ".faq-answer", "p"],
      extra: {
        mainEntity: { "@id": `${PAGE_URL}#faq` },
        significantLink: [
          `${SITE_URL}/support/warranty`,
          `${SITE_URL}/support/manuals`,
          `${SITE_URL}/contact`,
        ],
      },
    }),
    buildFaqPageSchema(faqs, PAGE_URL, `${PAGE_URL}#faq`),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support" },
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
