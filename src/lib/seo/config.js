/**
 * 全站 SEO / 在地 Geo 設定（可透過環境變數覆寫）
 * @see https://schema.org/LocalBusiness
 */

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://weibo-alpha.vercel.app";
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
  defaultOgImage: "/images/og-image.png",
};

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
  };
}
