import { Metadata } from "next";
import QaClient from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";
import { PRODUCT06_SLIDES } from "@/data/productSlides";

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);
const OG_IMAGE = `${SITE_URL}${PRODUCT06_SLIDES.ogImage}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 電動鼻毛修剪器｜Icebreaker 冰晶白限定款",
  description:
    "昔馬 SMASMALL 電動鼻毛修剪器 Icebreaker 款。白色荔枝紋皮革機身、磁吸 USB 快充、IPX5 防水，無痛旋轉刀頭精準修剪，送禮自用兩相宜。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "電動鼻毛修剪器",
    "Icebreaker",
    "鼻毛刀",
    "男士理容",
    "磁吸充電",
    "威柏科技",
  ],
  alternates: { canonical: "/product06" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: `${SITE_URL}/product06`,
    siteName: "SMASMALL 昔馬 by 威柏科技",
    title: "昔馬 SMASMALL 電動鼻毛修剪器 Icebreaker 冰晶白限定款",
    description: "白色皮革機身、磁吸快充、IPX5 防水，無痛精準修剪，限定插畫禮盒送禮首選。",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "昔馬 SMASMALL 電動鼻毛修剪器 Icebreaker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 電動鼻毛修剪器 Icebreaker 冰晶白",
    description: "白色皮革機身、磁吸快充、IPX5 防水，無痛精準修剪。",
    images: [OG_IMAGE],
  },
};

export default function Product06Page() {
  const schemaProduct = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${SITE_URL}/product06/#product`,
    name: "昔馬 SMASMALL 電動鼻毛修剪器 Icebreaker 冰晶白",
    image: [
      `${SITE_URL}/images/accessories/電動鼻毛修剪器/情境圖/01.jpg`,
      `${SITE_URL}/images/accessories/電動鼻毛修剪器/情境圖/04.png`,
    ],
    description:
      "白色荔枝紋皮革機身搭配鏡面鉻銀旋轉刀頭，磁吸 USB 充電、IPX5 全機防水，無痛精準修剪，Icebreaker 限定插畫禮盒設計。",
    brand: { "@id": ids.brand },
    sku: "SM-NT-ICE-01",
    mpn: "SM-NT-001",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product06`,
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
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "48" },
  };

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/product06/#webpage`,
    url: `${SITE_URL}/product06`,
    name: "昔馬 SMASMALL 電動鼻毛修剪器｜Icebreaker 冰晶白限定款",
    description: "探索昔馬 SMASMALL 電動鼻毛修剪器，白色皮革機身搭配限定 Icebreaker 禮盒，精準修剪、送禮首選。",
    isPartOf: { "@id": ids.website },
    about: { "@id": `${SITE_URL}/product06/#product` },
    mainEntity: { "@id": `${SITE_URL}/product06/#product` },
    publisher: { "@id": ids.organization },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaProduct,
    schemaWebPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "電動鼻毛修剪器", path: "/product06" },
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
