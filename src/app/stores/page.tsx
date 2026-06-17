import { Metadata } from "next";
import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { RETAIL_STORES, getGoogleMapsUrl } from "@/data/retailStores";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";

export const revalidate = 86400;

const SITE_URL = getSiteUrl();
const PATH = "/stores";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "全台門市據點｜昔馬 SMASMALL 電動刮鬍刀哪裡買 - 威柏科技",
  },
  description:
    "查詢全台販售昔馬 SMASMALL 電動刮鬍刀的實體門市，含 WEiZ 嘉義、台中、高雄與 JC科技台中公益店。附地址、電話、營業時間與 Google 地圖連結。",
  keywords: [
    "昔馬門市",
    "SMASMALL 哪裡買",
    "電動刮鬍刀門市",
    "WEiZ 門市",
    "威柏科技",
    "台中刮鬍刀",
    "嘉義刮鬍刀",
    "高雄刮鬍刀",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: "全台門市據點｜昔馬 SMASMALL 電動刮鬍刀哪裡買",
    description:
      "查詢全台販售昔馬 SMASMALL 電動刮鬍刀的實體門市，附 Google 地圖連結。",
    images: [
      {
        url: ogImageUrl("/images/og-3.jpg"),
        width: 1200,
        height: 630,
        alt: "昔馬 SMASMALL 全台門市據點",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "全台門市據點｜昔馬 SMASMALL 電動刮鬍刀哪裡買",
    description:
      "查詢全台販售昔馬 SMASMALL 電動刮鬍刀的實體門市，附 Google 地圖連結。",
    images: [ogImageUrl("/images/og-3.jpg")],
  },
};

export default function StoresPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "昔馬 SMASMALL 全台門市據點",
    description: "販售昔馬 SMASMALL 電動刮鬍刀之實體門市列表",
    numberOfItems: RETAIL_STORES.length,
    itemListElement: RETAIL_STORES.map((store, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Store",
        name: store.name,
        telephone: store.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: store.address,
          addressLocality: store.city,
          addressRegion: store.region,
          addressCountry: "TW",
        },
        url: getGoogleMapsUrl(store.address),
        brand: {
          "@type": "Brand",
          name: "SMASMALL 昔馬",
        },
      },
    })),
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    itemListSchema,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "全台門市", path: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <main className="w-full min-h-screen">
        <Client />
      </main>
    </>
  );
}
