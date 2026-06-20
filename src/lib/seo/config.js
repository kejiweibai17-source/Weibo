/**
 * 全站 SEO / 在地 Geo 設定（可透過環境變數覆寫）
 * @see https://schema.org/LocalBusiness
 */

/** 正式網域（canonical、JSON-LD、sitemap、OG 預設） */
export const SITE_URL = "https://www.smasmall.com.tw";

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return SITE_URL;
}

export const SEO_CONFIG = {
  siteName: "SMASMALL 昔馬 台灣官方商城",
  siteAlternateName: "昔馬電動刮鬍刀",
  defaultLocale: "zh-TW",
  inLanguage: "zh-TW",
  areaServed: "TW",
  brand: {
    name: "SMASMALL 昔馬",
    alternateName: "昔馬",
    description:
      "復古未來主義理容品牌，專注於全合金工藝、磁吸刀頭與 IPX7 防水的電動刮鬍刀與男士理容產品。",
    logoPath: "/images/logo/smasmall-logo.png",
  },
  organization: {
    name: "威柏科技有限公司",
    alternateName: ["Weibo Technology", "威柏科技"],
    url: process.env.NEXT_PUBLIC_ORG_URL || "https://www.weiboltd.com/",
    description:
      "威柏科技有限公司為 SMASMALL 昔馬品牌台灣總代理，提供原廠授權產品、一年保固與完善售後服務。",
    logoPath: "/images/logo/weibo-logo.png",
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "service@weiboltd.com",
    telephone:
      process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+886-5-3209919",
    fax: process.env.NEXT_PUBLIC_BUSINESS_FAX || "+886-5-3209919",
    lineId: "@weibo",
  },
  /** 嘉義縣太保市營運據點（官網聯絡我們） */
  geo: {
    streetAddress:
      process.env.NEXT_PUBLIC_BUSINESS_STREET || "健康路187號",
    addressLocality:
      process.env.NEXT_PUBLIC_BUSINESS_CITY || "太保市",
    addressRegion:
      process.env.NEXT_PUBLIC_BUSINESS_REGION || "嘉義縣",
    postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL || "612",
    addressCountry: "TW",
    latitude: Number(
      process.env.NEXT_PUBLIC_BUSINESS_LAT ?? "23.4582",
    ),
    longitude: Number(
      process.env.NEXT_PUBLIC_BUSINESS_LNG ?? "120.3289",
    ),
  },
  openingHours: [
    {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.weiboltd.com/",
    "https://www.facebook.com/249wzrtv/",
    "https://www.instagram.com/weiz.3c/?hl=zh-tw",
    "https://page.line.me/157yqtwl",
  ],
  /** 首頁與未指定 OG 頁面的預設社群預覽圖 */
  defaultOgImage: "/images/003-01.png",
  /** 瀏覽器分頁 / 書籤圖示（昔馬 smasmall；勿用威柏橫幅當 favicon） */
  favicon: "/favicon.ico",
  appleTouchIcon: "/apple-touch-icon.png",
};

/** 社群預覽圖快取版本（換圖後遞增，強制 FB/LINE 等重新抓取） */
export const OG_IMAGE_VERSION =
  process.env.NEXT_PUBLIC_OG_IMAGE_VERSION || "20260612";

/** 為 OG 圖片路徑加上 ?v= 後綴，避免社群平台沿用舊快取 */
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

/** 主要導覽（對應 Navbar / Footer，供 JSON-LD Sitelinks 訊號） */
export const SITE_PRIMARY_NAV = [
  { name: "昔馬全系列產品", path: "/accessories" },
  { name: "關於我們", path: "/about" },
  { name: "昔馬 SMASMALL 品牌", path: "/brand" },
  { name: "精選文章", path: "/blog" },
  { name: "產品保固與註冊", path: "/support/warranty" },
  { name: "常見問題 FAQ", path: "/support/faq" },
  { name: "聯絡我們", path: "/contact" },
  { name: "使用與保養指南", path: "/support/manuals" },
  { name: "使用條款與政策", path: "/support/policies" },
];

/** 圖片 alt 統一品牌後綴（SEO） */
export const IMAGE_ALT_SUFFIX = "威柏科技-昔馬電動刮鬍刀總代理";

/** 組合圖片 alt：描述 + 統一後綴 */
export function imageAlt(description) {
  return `${description} ${IMAGE_ALT_SUFFIX}`;
}
