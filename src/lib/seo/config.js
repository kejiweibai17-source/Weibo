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
  /**
   * Google 搜尋結果「網站名稱」（favicon 旁那一行）
   * @see https://developers.google.com/search/docs/appearance/site-names
   * 必須與 og:site_name、首頁可見品牌文案一致
   */
  siteName: "昔馬電動刮鬍刀",
  /** 備援名稱：簡稱 → 英文品牌 → 小寫網域（官方建議最後備援） */
  siteAlternateName: ["昔馬", "SMASMALL 昔馬", "smasmall.com.tw"],
  defaultLocale: "zh-TW",
  inLanguage: "zh-TW",
  areaServed: "TW",
  brand: {
    name: "SMASMALL 昔馬",
    alternateName: "昔馬電動刮鬍刀",
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
    "https://www.youtube.com/@weiboltd",
  ],
  /** 首頁與未指定 OG 頁面的預設社群預覽圖 */
  defaultOgImage: "/images/003-01.png",
  /** 瀏覽器分頁 / 書籤圖示（昔馬 smasmall；勿用威柏橫幅當 favicon） */
  favicon: "/favicon.ico",
  appleTouchIcon: "/apple-touch-icon.png",
  /** Google Search Console／Bing 驗證（環境變數，不寫死） */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
  },
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

/**
 * Google Sitelinks 優先候選（短文案、與 Navbar／Footer 一致）
 * 順序越前權重越高；通常顯示 2–6 個
 */
export const SITE_SITELINKS_NAV = [
  { name: "系列商品", path: "/series", description: "瀏覽昔馬星座系列與明星產品線" },
  { name: "產品列表", path: "/accessories", description: "全系列電動刮鬍刀禮盒與配件一覽" },
  { name: "品牌介紹", path: "/brand", description: "SMASMALL 昔馬品牌故事與產品理念" },
  { name: "精選文章", path: "/blog", description: "理容知識、選購指南與最新消息" },
  { name: "全台門市", path: "/stores", description: "查找台灣授權門市與據點" },
  { name: "客戶支援", path: "/support", description: "保固、說明書、FAQ 與售後服務" },
  { name: "聯絡我們", path: "/contact", description: "客服信箱、電話與合作諮詢" },
  { name: "常見問題", path: "/support/faq", description: "購買、保固與使用常見問答" },
];

/**
 * 主要導覽（對應 Navbar / Footer 可見連結 + 支援子頁）
 * Google Sitelinks 優先採用首頁下方高權重、命名清楚的站內連結
 */
export const SITE_PRIMARY_NAV = [
  ...SITE_SITELINKS_NAV,
  { name: "產品保固與註冊", path: "/support/warranty", description: "保固條款與產品註冊" },
  { name: "使用與保養指南", path: "/support/manuals", description: "產品說明書與保養方式" },
  { name: "服務條款與政策", path: "/support/policies", description: "購物、隱私與退換貨政策" },
  { name: "關於威柏科技", path: "/about", description: "台灣總代理威柏科技介紹" },
  { name: "威柏科技", path: "/weibo", description: "威柏科技企業與代理品牌" },
];

/** Sitemap 中 sitelink 候選頁的建議 priority */
export const SITELINK_SITEMAP_PRIORITY = /** @type {Record<string, number>} */ ({
  "/": 1.0,
  "/series": 0.98,
  "/accessories": 0.97,
  "/brand": 0.9,
  "/blog": 0.88,
  "/stores": 0.86,
  "/support": 0.86,
  "/contact": 0.85,
  "/support/faq": 0.82,
  "/weibo": 0.75,
  "/about": 0.75,
});

/** 圖片 alt 統一品牌後綴（SEO） */
export const IMAGE_ALT_SUFFIX = "威柏科技-昔馬電動刮鬍刀總代理";

/** 組合圖片 alt：描述 + 統一後綴 */
export function imageAlt(description) {
  return `${description} ${IMAGE_ALT_SUFFIX}`;
}
