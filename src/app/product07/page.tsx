import { Metadata } from "next";
import QaClient from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";
import { PRODUCT07_SLIDES } from "@/data/productSlides";

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);
const OG_IMAGE = `${SITE_URL}${PRODUCT07_SLIDES.ogImage}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1｜鐵系列三機禮盒",
  description:
    "昔馬 SMASMALL 完美紳士 MATEBOX 3in1 鐵系列禮盒。波紋合金電動刮鬍刀、電動鼻毛刀、鑰匙圈迷你刀三機並陳，工業插畫禮盒設計，送禮自用皆上乘。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "完美紳士",
    "MATEBOX",
    "3in1禮盒",
    "電動刮鬍刀",
    "鐵系列",
    "威柏科技",
    "男士理容禮盒",
  ],
  alternates: { canonical: "/product07" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: `${SITE_URL}/product07`,
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1 鐵系列三機禮盒",
    description: "波紋合金電動刮鬍刀、鼻毛刀、鑰匙圈刀三機一盒，工業蒸汽龐克插畫禮盒，致敬為更好生活奮鬥的人。",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1 鐵系列禮盒",
    description: "波紋合金三機禮盒，工業蒸汽龐克插畫外盒，送禮自用首選。",
    images: [OG_IMAGE],
  },
};

export default function Product07Page() {
  const schemaProduct = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}/product07/#product`,
    name: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1 鐵系列",
    image: [
      `${SITE_URL}/images/accessories/完美紳士/情境圖/玩美-1.jpg`,
      `${SITE_URL}/images/accessories/完美紳士/情境圖/玩美-3.jpg`,
    ],
    description:
      "波紋合金電動刮鬍刀、電動鼻毛刀、鑰匙圈迷你修剪刀三機並陳，鐵系列工業蒸汽龐克插畫 MATEBOX 禮盒，致敬為更好生活而奮鬥的人。",
    brand: { "@id": ids.brand },
    sku: "SM-MB-3IN1-01",
    mpn: "SM-MB-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product07`,
      priceCurrency: "TWD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ids.organization },
      availableAtOrFrom: { "@id": ids.localBusiness },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TW",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: "7",
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "TWD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "TW" },
      },
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "36" },
  };

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/product07/#webpage`,
    url: `${SITE_URL}/product07`,
    name: "昔馬 SMASMALL 完美紳士 MATEBOX 3in1｜鐵系列三機禮盒",
    description: "探索昔馬 SMASMALL 完美紳士 MATEBOX，波紋合金三機禮盒，鐵系列工業蒸汽龐克設計，送禮首選。",
    isPartOf: { "@id": ids.website },
    about: { "@id": `${SITE_URL}/product07/#product` },
    mainEntity: { "@id": `${SITE_URL}/product07/#product` },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaProduct,
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "完美紳士 MATEBOX 3in1", path: "/product07" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <main className="w-full bg-black min-h-screen">
        <QaClient />
      </main>
    </>
  );
}
