// app/page.jsx
import Client from "./home";
import JsonLd from "@/components/seo/JsonLd";
import HomeSiteLinksNav from "@/components/seo/HomeSiteLinksNav";
import { getSiteUrl, ogImageUrl } from "@/lib/seo/config";
import { buildHomePageSchemas } from "@/lib/seo/schemas";
import { getHomeBladeIntroSection } from "@/lib/homeBladeIntro.server";
import { getHomeCarouselSlides } from "@/lib/homeCarousel.server";
import { getHomeConstellationSection } from "@/lib/homeConstellation.server";
import { getHomeProductIntroSection } from "@/lib/homeProductIntro.server";
import { getHeroSliderSlides } from "@/lib/heroSlider.server";
import { fetchSeriesNavItems } from "@/lib/seriesProducts.server";

const SITE_URL = getSiteUrl();

// 🌟 首頁動態 FAQ 資料 (融入昔馬刮鬍刀核心關鍵字與代理商保障)
const homeFAQs = [
  {
    question: "SMASMALL 昔馬刮鬍刀與市售產品有何不同？",
    answer:
      "昔馬 SMASMALL 拋棄傳統塑膠，採用獨家全合金機身，質感扎實且耐用。並搭載業界首創的「磁吸式刀頭」設計，一秒拆卸清洗，搭配德國進口精鋼刀片與 IPX7 全機防水，提供極致流暢的刮鬍體驗與頂級精品握感。",
  },
  {
    question: "請問是在哪裡製造的？享有保固嗎？",
    answer:
      "SMASMALL 昔馬系列產品由專業大廠精密製造，並由台灣總代理「威柏科技」原廠授權引進。凡透過本官方商城購買，皆享有台灣代理商提供的一年原廠保固與完善售後服務，讓您買得安心。營運據點位於嘉義縣太保市。",
  },
  {
    question: "訂購後大約幾天可以收到商品？有退換貨服務嗎？",
    answer:
      "現貨商品一般於訂單確認後 1-3 個工作天內出貨。全館享有滿額免運優惠。若收到商品有瑕疵，請於 7 日內聯繫威柏科技客服進行退換貨。惟因刮鬍刀屬於個人衛生用品，拆封後除商品本身瑕疵外，恕不接受退換貨，退回商品必須為全新狀態且包裝完整。",
  },
  {
    question: "如何查看系列商品與產品列表？",
    answer:
      "可至「系列商品」瀏覽星座系列、捍衛者、黑夜騎士等產品線介紹，或至「產品列表」一次比較全系列電動刮鬍刀禮盒與配件。",
  },
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: "昔馬 SMASMALL 電動刮鬍刀禮盒｜送禮首選・原廠保固 - 威柏 WEIBO",
  },
  description:
    "讓每天的儀容成為一種講究。昔馬 SMASMALL 全機鋅合金電動刮鬍刀，森田愛用、2024 網路熱門刮鬍刀領導品牌，多款禮盒附質感包裝，送禮自用皆宜，享原廠 12 個月保固。台灣總代理威柏科技，嘉義縣太保市。",
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
    "嘉義",
    "系列商品",
    "產品列表",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "昔馬電動刮鬍刀",
    title: "昔馬 SMASMALL 電動刮鬍刀禮盒｜送禮首選・原廠保固 - 威柏 WEIBO",
    description:
      "讓每天的儀容成為一種講究。昔馬 SMASMALL 全機鋅合金電動刮鬍刀，森田愛用、2024 網路熱門刮鬍刀領導品牌，多款禮盒附質感包裝，送禮自用皆宜，享原廠 12 個月保固。",
    images: [
      {
        url: ogImageUrl("/images/og-1.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬全合金電動刮鬍刀",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "昔馬 SMASMALL 電動刮鬍刀禮盒｜送禮首選・原廠保固 - 威柏 WEIBO",
    description:
      "讓每天的儀容成為一種講究。昔馬 SMASMALL 全機鋅合金電動刮鬍刀，森田愛用、2024 網路熱門刮鬍刀領導品牌，多款禮盒附質感包裝，送禮自用皆宜，享原廠 12 個月保固。",
    images: [ogImageUrl("/images/og-1.jpg")],
  },
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function Page() {
  const [
    carouselSlides,
    heroSlides,
    constellationSection,
    bladeIntroSection,
    productIntroSection,
    seriesNavItems,
  ] = await Promise.all([
    getHomeCarouselSlides(),
    getHeroSliderSlides(),
    getHomeConstellationSection(),
    getHomeBladeIntroSection(),
    getHomeProductIntroSection(),
    fetchSeriesNavItems(),
  ]);
  const schemas = buildHomePageSchemas({
    siteUrl: SITE_URL,
    faqs: homeFAQs,
  });

  return (
    <>
      <JsonLd data={schemas} />
      <HomeSiteLinksNav seriesItems={seriesNavItems} />
      <Client
        faqs={homeFAQs}
        carouselSlides={carouselSlides}
        heroSlides={heroSlides}
        constellationSection={constellationSection}
        bladeIntroSection={bladeIntroSection}
        productIntroSection={productIntroSection}
      />
    </>
  );
}
