import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildPoliciesPageSchemas,
  buildSiteNavigationSchema,
  buildSupportWebPageSchema,
} from "@/lib/seo/schemas";
import { POLICY_SECTIONS } from "@/data/policyContent";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/policies";

const TITLE = "昔馬 SMASMALL 使用條款與隱私政策｜威柏科技貿易有限公司";
const DESCRIPTION =
  "了解 SMASMALL 昔馬官方網站之服務條款、隱私權保護、運送退換貨規範及消費安全宣導。最後更新：2026 年 6 月。";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "服務條款",
    "隱私權政策",
    "運送退換貨",
    "防詐騙",
    "SMASMALL",
    "威柏科技貿易有限公司",
    "個人資料保護",
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
        alt: "SMASMALL 昔馬使用條款與政策",
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

export default function PoliciesPage() {
  const policySchemas = buildPoliciesPageSchemas(POLICY_SECTIONS, SITE_URL);

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬使用條款與政策",
      description: DESCRIPTION,
      pageType: "WebPage",
      dateModified: "2026-06-01",
      imagePath: "/images/og-4.jpg",
      speakableCssSelectors: ["h1", "h2", "h3", "article p", "p"],
      extra: {
        hasPart: POLICY_SECTIONS.map((section) => ({
          "@id": `${SITE_URL}${PATH}#${section.id}`,
        })),
        mainEntity: { "@id": `${SITE_URL}${PATH}#policy-list` },
      },
    }),
    ...policySchemas,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support" },
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
