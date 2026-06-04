/** 後台無資料或 API 失敗時，首頁 GSAP 滾動 Slider 預設 */
export const HERO_SLIDER_FALLBACK_SLIDES = [
  {
    title: "獨創全合金壓鑄機身",
    description:
      "拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落，完美展現復古未來主義的獨特品味。",
    image: "/images/index/banner-01.png",
  },
  {
    title: "業界首創磁吸快拆刀頭",
    description:
      "搭載高精密磁吸結構，一秒即可無縫貼合與拆卸。不僅大幅縮短日常清理時間，更徹底解決傳統機械卡榫易斷裂、易磨損的問題。",
    image: "/images/index/banner-02.png",
  },
  {
    title: "荷蘭進口精鋼刀片",
    description:
      "嚴選頂規荷蘭進口精鋼，搭配雙環超薄刀網與自銳研磨技術。刀片越用越鋒利，精準捕捉各種方向的鬍鬚，享受極致滑順的剃鬚體驗。",
    image: "/images/index/banner-03.png",
  },
  {
    title: "IPX7 頂級全機防水",
    description:
      "支援全機身水洗與乾濕兩用。無論是搭配刮鬍泡的深層淨容，或是淋浴時的快速剃鬚，都能輕鬆應對，用水一沖即淨，衛生無死角。",
    image: "/images/index/banner-04.png",
  },
] as const;

export type HeroSliderSlide = {
  title: string;
  description: string;
  image: string;
};
