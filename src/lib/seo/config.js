/** 精簡版設定（維護合約另提供進階整合） */
export const SITE_URL = "https://www.smasmall.com.tw";

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return SITE_URL;
}

export const SEO_CONFIG = {
  siteName: "昔馬電動刮鬍刀",
  siteAlternateName: ["昔馬", "SMASMALL 昔馬", "smasmall.com.tw"],
  defaultLocale: "zh-TW",
  inLanguage: "zh-TW",
  areaServed: "TW",
  brand: {
    name: "SMASMALL 昔馬",
    alternateName: "昔馬電動刮鬍刀",
    description: "昔馬 SMASMALL 電動刮鬍刀官方網站。",
    logoPath: "/images/logo/smasmall-logo.png",
  },
  organization: {
    name: "威柏科技有限公司",
    alternateName: ["Weibo Technology", "威柏科技"],
    url: process.env.NEXT_PUBLIC_ORG_URL || "https://www.weiboltd.com/",
    description: "威柏科技為 SMASMALL 昔馬台灣總代理。",
    logoPath: "/images/logo/weibo-logo.png",
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "service@weiboltd.com",
    telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+886-5-3209919",
    fax: process.env.NEXT_PUBLIC_BUSINESS_FAX || "+886-5-3209919",
    lineId: "@weibo",
  },
  geo: {
    streetAddress: "健康路187號",
    addressLocality: "太保市",
    addressRegion: "嘉義縣",
    postalCode: "612",
    addressCountry: "TW",
    latitude: 23.4582,
    longitude: 120.3289,
  },
  openingHours: [
    { dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
  ],
  sameAs: [],
  defaultOgImage: "/images/003-01.png",
  favicon: "/favicon.ico",
  appleTouchIcon: "/apple-touch-icon.png",
  verification: { google: "", bing: "" },
};

export const OG_IMAGE_VERSION = process.env.NEXT_PUBLIC_OG_IMAGE_VERSION || "20260612";

export function ogImageUrl(path) {
  if (!path) return path;
  if (path.startsWith("http")) {
    const [base, query] = path.split("?");
    const params = new URLSearchParams(query || "");
    params.set("v", OG_IMAGE_VERSION);
    return `${base}?${params.toString()}`;
  }
  const base = path.split("?")[0];
  return `${base}?v=${OG_IMAGE_VERSION}`;
}

export function absoluteUrl(siteUrl, path = "") {
  if (!path) return siteUrl;
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function entityIds(siteUrl) {
  return {
    website: `${siteUrl}/#website`,
    organization: `${siteUrl}/#organization`,
    localBusiness: `${siteUrl}/#localbusiness`,
    brand: `${siteUrl}/#brand`,
    siteNavigation: `${siteUrl}/#site-navigation`,
  };
}

export const SITE_SITELINKS_NAV = [
  { name: "系列商品", path: "/series", description: "系列商品" },
  { name: "產品列表", path: "/accessories", description: "產品列表" },
  { name: "品牌介紹", path: "/brand", description: "品牌介紹" },
  { name: "精選文章", path: "/blog", description: "精選文章" },
  { name: "全台門市", path: "/stores", description: "全台門市" },
  { name: "客戶支援", path: "/support", description: "客戶支援" },
  { name: "聯絡我們", path: "/contact", description: "聯絡我們" },
  { name: "常見問題", path: "/support/faq", description: "常見問題" },
];

export const SITE_PRIMARY_NAV = [...SITE_SITELINKS_NAV];
export const SITELINK_SITEMAP_PRIORITY = { "/": 1.0 };
export const IMAGE_ALT_SUFFIX = "昔馬電動刮鬍刀";
export function imageAlt(description) {
  return `${description} ${IMAGE_ALT_SUFFIX}`;
}
