// app/page.jsx
import Client from "./home";

// 🌟 1. 動態獲取網址，解決本地端與正式機網址判定問題
const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return "http://localhost:3000";
};

const SITE_URL = getSiteUrl();

// 🌟 首頁動態 FAQ 資料 (融入昔馬刮鬍刀核心關鍵字與代理商保障)
const homeFAQs = [
  {
    question: "SMASMALL 昔馬刮鬍刀與市售產品有何不同？",
    answer:
      "昔馬 SMASMALL 拋棄傳統塑膠，採用獨家全合金機身，質感扎實且耐用。並搭載業界首創的「磁吸式刀頭」設計，一秒拆卸清洗，搭配荷蘭進口精鋼刀片與 IPX7 全機防水，提供極致流暢的刮鬍體驗與頂級精品握感。",
  },
  {
    question: "請問是在哪裡製造的？享有保固嗎？",
    answer:
      "SMASMALL 昔馬系列產品由專業大廠精密製造，並由台灣總代理「威柏科技」原廠授權引進。凡透過本官方商城購買，皆享有台灣代理商提供的一年原廠保固與完善售後服務，讓您買得安心。",
  },
  {
    question: "訂購後大約幾天可以收到商品？有退換貨服務嗎？",
    answer:
      "現貨商品一般於訂單確認後 1-3 個工作天內出貨。全館享有滿額免運優惠。若收到商品有瑕疵，請於 7 日內聯繫威柏科技客服進行退換貨。惟因刮鬍刀屬於個人衛生用品，拆封後除商品本身瑕疵外，恕不接受退換貨，退回商品必須為全新狀態且包裝完整。",
  },
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SMASMALL 昔馬｜全合金電動刮鬍刀｜威柏科技台灣總代理",
  description:
    "SMASMALL 昔馬電動刮鬍刀，結合重機具與航空空氣動力學的復古未來主義。獨創全合金機身、一秒磁吸刀頭、荷蘭精鋼刀片與 IPX7 全機防水。由威柏科技台灣總代理，提供完善一年保固。",
  keywords: [
    "SMASMALL",
    "昔馬",
    "電動刮鬍刀",
    "合金刮鬍刀",
    "磁吸刀頭",
    "IPX7防水",
    "精品刮鬍刀",
    "送禮推薦",
    "男士理容",
    "威柏科技",
    "Weibo",
  ],
  icons: { icon: "/images/logo-white.png" }, // 建議替換為你的 favicon
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "SMASMALL 昔馬 台灣官方商城",
    title: "SMASMALL 昔馬｜頂級全合金電動刮鬍刀",
    description:
      "顛覆傳統的理容革命！SMASMALL 昔馬全合金電動刮鬍刀，搭載創新磁吸刀頭與精鋼刀網，威柏科技原廠代理保固，為品味男士打造專屬的極致刮鬍體驗。",
    images: [
      {
        url: "/images/og-image.png", // 建議替換為昔馬的高清質感宣傳圖
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬全合金電動刮鬍刀",
      },
    ],
  },
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default function Page() {
  // ===================== 👑 結構化資料 1：網站基礎資訊 (WebSite) =====================
  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "SMASMALL 昔馬 台灣官方商城",
    alternateName: "昔馬電動刮鬍刀",
    description: "頂級全合金電動刮鬍刀，由威柏科技台灣總代理。",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "zh-TW",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ===================== 👑 結構化資料 2：公司/代理商實體 (Organization) =====================
  // 🌟 將 Organization 設定為代理商「威柏科技」
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "威柏科技有限公司",
    alternateName: "Weibo Technology",
    url: "https://www.weiboltd.com/", // 官方主網站
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo/weibo-logo.png`, // 建議放威柏的 Logo
    },
    description:
      "威柏科技有限公司為 SMASMALL 昔馬品牌台灣總代理，致力於引進高品質的科技與質感生活產品，提供消費者優質的購物體驗與完善保固。",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "TW",
      availableLanguage: ["Traditional Chinese"],
      // 可補上威柏科技的客服電話或信箱
    },
    sameAs: [
      "https://www.weiboltd.com/", // 關聯母公司網站
      // 如果威柏有 FB/IG 可以放這裡
    ],
  };

  // ===================== 👑 結構化資料 3：品牌實體 (Brand) =====================
  // 🌟 特別宣告「昔馬」是一個獨立的品牌
  const schemaBrand = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${SITE_URL}/#brand`,
    name: "SMASMALL 昔馬",
    logo: `${SITE_URL}/images/logo/smasmall-logo.png`, // 昔馬的 Logo
    description:
      "復古未來主義理容品牌，專注於全合金工藝與創新科技的電動刮鬍刀。",
  };

  // ===================== 👑 結構化資料 4：網頁資訊 (WebPage) =====================
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "SMASMALL 昔馬電動刮鬍刀｜威柏科技獨家代理",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` }, // 此網頁主要是關於昔馬品牌
    publisher: { "@id": `${SITE_URL}/#organization` }, // 發布者是威柏科技
    description:
      "探索 SMASMALL 昔馬電動刮鬍刀。採用全合金機身、一秒磁吸刀頭、荷蘭精鋼刀片，兼具潮流與實用，送禮自用首選。",
  };

  // ===================== 👑 結構化資料 5：首頁常見問題 (FAQPage) =====================
  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: homeFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // ===================== 👑 結構化資料 6：焦點商品列表 (ItemList) =====================
  const schemaItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#collection`,
    name: "SMASMALL 昔馬 熱銷系列",
    description: "探索昔馬的經典全合金電動刮鬍刀與精選禮盒套裝。",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: `${SITE_URL}/category/premium-alloy`,
        name: "青春版電動刮鬍刀 (S1系列)",
      },
      {
        "@type": "ListItem",
        position: 2,
        url: `${SITE_URL}/category/classic`,
        name: "黑夜騎士電動刮鬍刀 (S1-DK)",
      },
      {
        "@type": "ListItem",
        position: 3,
        url: `${SITE_URL}/category/s3`, // 自行替換網址
        name: "小金剛旗艦三刀頭 (S3系列)",
      },
    ],
  };

  return (
    <>
      {/* 獨立拆分，逐一注入 JSON-LD */}
      <script
        type="application/ld+json"
        id="schema-website"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }}
      />
      <script
        type="application/ld+json"
        id="schema-organization"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type="application/ld+json"
        id="schema-brand"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBrand) }}
      />
      <script
        type="application/ld+json"
        id="schema-webpage"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
      />
      <script
        type="application/ld+json"
        id="schema-faq"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />
      <script
        type="application/ld+json"
        id="schema-itemlist"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }}
      />

      <Client faqs={homeFAQs} />
    </>
  );
}
