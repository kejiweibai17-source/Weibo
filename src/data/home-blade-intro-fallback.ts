export type HomeBladeIntroItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  /** 刀頭細節輪播圖（public 路徑） */
  images?: string[];
};

export type HomeBladeIntroSection = {
  intro: {
    label: string;
    title: string;
    description: string;
    backgroundImage: string;
  };
  accordion: {
    eyebrow: string;
    title: string;
    items: HomeBladeIntroItem[];
  };
};

const BLADE_2_IMAGES = [
  "/images/2.0刀頭/45度.webp",
  "/images/2.0刀頭/刀头角度.webp",
  "/images/2.0刀頭/刀网.webp",
  "/images/2.0刀頭/刀网_i1.webp",
  "/images/2.0刀頭/刀网特写.webp",
  "/images/2.0刀頭/去背.webp",
];

const BLADE_3_IMAGES = [
  "/images/3.0刀頭/1.webp",
  "/images/3.0刀頭/2.webp",
  "/images/3.0刀頭/3.webp",
  "/images/3.0刀頭/3 (2).webp",
  "/images/3.0刀頭/5.webp",
  "/images/3.0刀頭/6.webp",
];

export const HOME_BLADE_INTRO_FALLBACK: HomeBladeIntroSection = {
  intro: {
    label: "Original Craftsmanship",
    title: "獨創全合金壓鑄機身",
    description:
      "拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落，完美展現復古未來主義的獨特品味。",
    backgroundImage: "/images/003-01.png",
  },
  accordion: {
    eyebrow: "Blade System",
    title: "刀頭介紹",
    items: [
      {
        id: "blade-2",
        label: "Constellation Series",
        title: "刀頭 2.0（星座系列）",
        description:
          "標配雙環開放式 2.0 圓刀頭，採德國進口鋼材與日本精密加工，近 40 道成型工藝打造。外環開放式圓刀搭配獨立浮動刀網，貼合臉部輪廓、順滑捕捉各方向鬍鬚。磁吸式快拆設計，一秒拆卸可直接水洗，建議每 6–12 個月更換，維持最佳鋒利度。適用星座系列 CQ1 等磁吸式機身。",
        images: BLADE_2_IMAGES,
      },
      {
        id: "blade-3",
        label: "Dark Knight Series",
        title: "刀頭 3.0（黑夜系列）",
        description:
          "雙環外開放式 3.0 版圓刀頭，外環採開放式結構，進鬚量再升級，刮剃效率更俐落。德國進口頂級鋼材，經 SGS 檢驗對金黃色葡萄球菌、大腸桿菌抗菌率高達 96%。同樣支援磁吸快拆與全機水洗，建議每 6–12 個月更換。為黑夜騎士等進階機型與升級替換首選。",
        images: BLADE_3_IMAGES,
      },
    ],
  },
};

/** CMS 缺圖時依 id 補上本機刀頭圖庫 */
export function resolveBladeItemImages(
  item: HomeBladeIntroItem,
): string[] {
  if (item.images?.length) return item.images;
  if (item.id === "blade-2" || /2\.0|星座/.test(item.title)) return BLADE_2_IMAGES;
  if (item.id === "blade-3" || /3\.0|黑夜/.test(item.title)) return BLADE_3_IMAGES;
  return [];
}
