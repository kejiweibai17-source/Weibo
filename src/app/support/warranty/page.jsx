import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildSiteNavigationSchema,
  buildSupportWebPageSchema,
  buildWarrantyHowToSchema,
  buildWarrantyPolicySchema,
  buildWarrantyServiceSchema,
} from "@/lib/seo/schemas";
import { WARRANTY_STEPS } from "@/data/supportContent";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/warranty";

const TITLE = "昔馬 SMASMALL 產品保固｜12 個月原廠保固・購買憑證即可申請";
const DESCRIPTION =
  "昔馬 SMASMALL 提供機身 12 個月原廠保固，保固以購買憑證為準、無需額外線上註冊。威柏科技台灣總代理協助維修換貨，客服專線 +886-5-3209919。";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "昔馬保固",
    "SMASMALL 保固",
    "電動刮鬍刀保固",
    "威柏科技售後",
    "原廠保固",
    "保固申請流程",
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
        alt: "SMASMALL 昔馬產品保固與註冊",
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

export default function WarrantyPage() {
  const howTo = buildWarrantyHowToSchema(WARRANTY_STEPS, SITE_URL);

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬產品保固與註冊",
      description: DESCRIPTION,
      pageType: "WebPage",
      imagePath: "/images/og-4.jpg",
      speakableCssSelectors: ["h1", "h2", "h3", "p", "li"],
      extra: {
        mainEntity: [
          { "@id": `${SITE_URL}${PATH}#warranty` },
          { "@id": `${SITE_URL}${PATH}#howto-apply` },
          { "@id": `${SITE_URL}${PATH}#service` },
        ],
      },
    }),
    buildWarrantyPolicySchema(SITE_URL),
    buildWarrantyServiceSchema(SITE_URL),
    howTo,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support" },
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
