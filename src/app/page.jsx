// app/page.jsx
import Client from "./home";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildHomePageSchemas } from "@/lib/seo/schemas";

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
  const schemas = buildHomePageSchemas({
    siteUrl: SITE_URL,
    faqs: homeFAQs,
    itemListElements: [
      {
        "@type": "ListItem",
        position: 1,
        url: `${SITE_URL}/accessories`,
        name: "昔馬 SMASMALL 配件與禮盒專區",
      },
      {
        "@type": "ListItem",
        position: 2,
        url: `${SITE_URL}/brand`,
        name: "探索昔馬 SMASMALL 系列",
      },
      {
        "@type": "ListItem",
        position: 3,
        url: `${SITE_URL}/product01`,
        name: "捍衛者+ 全合金電動刮鬍刀",
      },
    ],
  });

  return (
    <>
      <JsonLd data={schemas} />
      <Client faqs={homeFAQs} />
    </>
  );
}
