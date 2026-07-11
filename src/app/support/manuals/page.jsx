import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCareGuideHowToSchemas,
  buildCoreEntityGraph,
  buildSiteNavigationSchema,
  buildSupportWebPageSchema,
} from "@/lib/seo/schemas";
import { CARE_GUIDE_SECTIONS } from "@/data/supportContent";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support/manuals";

const TITLE = "昔馬 SMASMALL 刮鬍刀保養教學｜延長壽命這樣做";
const DESCRIPTION =
  "刮鬍刀越用越鈍？昔馬 SMASMALL 完整保養指南教你正確充電、IPX7 水洗清潔與刀頭保養，3 分鐘上手，讓愛刀常保鋒利如新。";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "昔馬保養",
    "電動刮鬍刀清潔",
    "磁吸刀頭保養",
    "IPX7 防水使用",
    "SMASMALL 說明書",
    "威柏科技",
    "刮鬍刀保養步驟",
  ],
  alternates: { canonical: PATH },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: TITLE,
    description: DESCRIPTION,
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
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl("/images/og-1.jpg")],
  },
};

export default function ManualsPage() {
  const howTos = buildCareGuideHowToSchemas(CARE_GUIDE_SECTIONS, SITE_URL);

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
    buildSupportWebPageSchema({
      siteUrl: SITE_URL,
      path: PATH,
      name: "SMASMALL 昔馬使用與保養指南",
      description: DESCRIPTION,
      pageType: "WebPage",
      imagePath: "/images/og-1.jpg",
      speakableCssSelectors: ["h1", "h2", "h3", "ol li", "p"],
      extra: {
        mainEntity: howTos.map((howto) => ({ "@id": howto["@id"] })),
        hasPart: CARE_GUIDE_SECTIONS.map((section) => ({
          "@type": "WebPageElement",
          "@id": `${SITE_URL}${PATH}#section-${section.id}`,
          name: section.title,
          description: section.summary,
          url: `${SITE_URL}${PATH}#section-${section.id}`,
        })),
      },
    }),
    ...howTos,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: "/support" },
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
