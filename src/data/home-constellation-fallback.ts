export type HomeConstellationSection = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

/** 後台無資料或 API 失敗時的預設內容 */
export const HOME_CONSTELLATION_FALLBACK: HomeConstellationSection = {
  eyebrow: "昔馬 SMASMALL 星座系列",
  title: "你的星座，你的圖騰",
  description: "火、土、風、水四象主題專屬圖騰與主題禮盒。\n獻給懂品味的你。",
  ctaLabel: "星座系列禮盒",
  ctaHref: "/series/constellation",
  image: "/images/d1f3c865-6383-4b3c-b00d-4c9f028d6c3c.png",
  imageAlt:
    "昔馬 SMASMALL 星座系列電動刮鬍刀禮盒 四象配色展示 威柏科技-昔馬電動刮鬍刀總代理",
};
