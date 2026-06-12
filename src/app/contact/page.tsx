import { Metadata } from "next";
import Client from "./client";
import JsonLd from "@/components/seo/JsonLd";
import { entityIds, getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const ids = entityIds(SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "聯繫昔馬 SMASMALL｜客服・門市・保固服務 - 威柏科技",
  },
  description:
    "有任何問題嗎？昔馬 SMASMALL 提供產品諮詢與售後服務，LINE @weibo 線上客服、電話 05-3209919，WEiZ 專櫃可實機體驗，我們竭誠為你服務。",
  keywords: [
    "昔馬客服",
    "SMASMALL 聯絡",
    "威柏科技客服",
    "電動刮鬍刀保固",
    "退換貨",
    "台灣總代理",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/contact",
    siteName: SEO_CONFIG.siteName,
    title: "聯繫昔馬 SMASMALL｜客服・門市・保固服務 - 威柏科技",
    description:
      "有任何問題嗎？昔馬 SMASMALL 提供產品諮詢與售後服務，LINE @weibo 線上客服、電話 05-3209919，WEiZ 專櫃可實機體驗，我們竭誠為你服務。",
    images: [
      {
        url: "/images/og-3.jpg",
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬聯絡我們",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "聯繫昔馬 SMASMALL｜客服・門市・保固服務 - 威柏科技",
    description:
      "有任何問題嗎？昔馬 SMASMALL 提供產品諮詢與售後服務，LINE @weibo 線上客服、電話 05-3209919，WEiZ 專櫃可實機體驗，我們竭誠為你服務。",
    images: ["/images/og-3.jpg"],
  },
};

export default function ContactPage() {
  const schemaContactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact/#webpage`,
    url: `${SITE_URL}/contact`,
    name: "聯絡威柏科技｜昔馬 SMASMALL 台灣總代理客服",
    description:
      "有任何關於昔馬 SMASMALL 電動刮鬍刀的疑問，歡迎透過以下方式聯絡威柏科技客服。",
    inLanguage: SEO_CONFIG.defaultLocale,
    isPartOf: { "@id": ids.website },
    publisher: { "@id": ids.organization },
    mainEntity: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: SEO_CONFIG.organization.name,
      description: SEO_CONFIG.organization.description,
      telephone: SEO_CONFIG.organization.telephone,
      email: SEO_CONFIG.organization.email,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: SEO_CONFIG.geo.streetAddress,
        addressLocality: SEO_CONFIG.geo.addressLocality,
        addressRegion: SEO_CONFIG.geo.addressRegion,
        postalCode: SEO_CONFIG.geo.postalCode,
        addressCountry: SEO_CONFIG.geo.addressCountry,
      },
      openingHoursSpecification: SEO_CONFIG.openingHours.map((slot) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: slot.dayOfWeek,
        opens: slot.opens,
        closes: slot.closes,
      })),
    },
  };

  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    schemaContactPage,
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "聯絡我們", path: "/contact" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <main className="w-full bg-[#f8f9fb] min-h-screen">
        <Client />
      </main>
    </>
  );
}
