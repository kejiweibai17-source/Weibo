import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildAccessoryProducts } from "@/data/accessories.server";
import {
  COMPATIBILITY_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/data/accessories";
import { fetchAccessoriesPageData } from "@/lib/accessoriesWoo.server";
import { absoluteUrl, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildAccessoriesCollectionSchemas } from "@/lib/seo/schemas";
import AccessoriesPageClient from "./AccessoriesPageClient";

const SITE_URL = getSiteUrl();

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "昔馬 SMASMALL 配件專區｜禮盒・刀頭・收納｜威柏科技台灣總代理",
  description:
    "探索昔馬 SMASMALL 電動刮鬍刀禮盒、星座系列、青春版、捍衛者、黑夜騎士與理容配件。全合金機身、磁吸刀頭、IPX7 防水，由威柏科技台灣總代理。",
  keywords: [
    "昔馬",
    "SMASMALL",
    "電動刮鬍刀禮盒",
    "配件",
    "星座系列",
    "青春版",
    "捍衛者",
    "黑夜騎士",
    "小金剛",
    "鼻毛修剪器",
    "威柏科技",
    "嘉義",
    "台灣總代理",
  ],
  alternates: { canonical: "/accessories" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/accessories",
    siteName: SEO_CONFIG.siteName,
    title: "昔馬 SMASMALL 配件專區｜威柏科技",
    description:
      "昔馬 SMASMALL 全系列禮盒與配件，台灣總代理威柏科技原廠授權與保固。",
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬配件專區",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 配件專區",
    description: "探索昔馬全系列禮盒與理容配件。",
    images: [absoluteUrl(SITE_URL, SEO_CONFIG.defaultOgImage)],
  },
};

export default async function AccessoriesPage() {
  let products = [];
  let productFilters = COMPATIBILITY_OPTIONS;
  let accessoryFilters = CATEGORY_OPTIONS;
  let filtersFromWoo = false;

  try {
    const data = await fetchAccessoriesPageData();
    products = data.products;
    productFilters = data.productFilters;
    accessoryFilters = data.accessoryFilters;
    filtersFromWoo = true;
  } catch {
    // 若 WooCommerce 暫時不可用，回退到原本本地資料，避免頁面中斷
    products = buildAccessoryProducts();
  }

  const schemas = buildAccessoriesCollectionSchemas(products, SITE_URL);

  return (
    <>
      <JsonLd data={schemas} />
      <AccessoriesPageClient
        products={products}
        productFilters={productFilters}
        accessoryFilters={accessoryFilters}
        filtersFromWoo={filtersFromWoo}
      />
    </>
  );
}
