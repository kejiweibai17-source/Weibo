export type HomeProductIntroSpec = {
  label: string;
  value: string;
};

/** 熱點特色：點擊後右下角卡片（小圖 + 標題 + 說明） */
export type HomeProductIntroFeature = {
  id: string;
  title: string;
  description: string;
  image: string;
  /** 熱點位置（%） */
  top: string;
  left: string;
  /** 點擊後背景放大倍率 */
  bgScale: number;
};

export type HomeProductIntroSection = {
  backgroundImage: string;
  subtitle: string;
  title: string;
  description: string;
  specs: HomeProductIntroSpec[];
  features: HomeProductIntroFeature[];
};

export const HOME_PRODUCT_INTRO_FEATURES_FALLBACK: HomeProductIntroFeature[] = [
  {
    id: "lid",
    title: "磁吸防塵保護蓋",
    description: "磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。",
    image: "/images/主頁p11/爆炸圖1.webp",
    top: "34%",
    left: "52%",
    bgScale: 2.4,
  },
  {
    id: "battery",
    title: "450mAh 高能鋰電池",
    description: "大容量鋰電池，60 分鐘即可快速充滿，長效續航一次到位。",
    image: "/images/主頁p11/鋰電池.webp",
    top: "62%",
    left: "48%",
    bgScale: 2.2,
  },
  {
    id: "switch",
    title: "專利防水推式開關",
    description: "獨家防水推動設計，有效防止誤觸，操作更安心。",
    image: "/images/主頁p11/星座按鍵展示.webp",
    top: "48%",
    left: "50%",
    bgScale: 2.6,
  },
  {
    id: "motor",
    title: "9200 rpm 強勁靜音電機",
    description: "每分鐘 9200 轉高速運轉，動力強勁、噪音低沉，刮鬍俐落不擾人。",
    image: "/images/主頁p11/強勁電機1.webp",
    top: "42%",
    left: "51%",
    bgScale: 2.3,
  },
  {
    id: "blade",
    title: "開放式雙環刀網",
    description: "開放式雙環結構精準導入鬍鬚，捕鬚更全面、刮除更高效。",
    image: "/images/主頁p11/爆炸圖_cryptomatte 1_2.webp",
    top: "28%",
    left: "53%",
    bgScale: 2.5,
  },
];

/** 後台無資料或 API 失敗時的預設內容 */
export const HOME_PRODUCT_INTRO_FALLBACK: HomeProductIntroSection = {
  backgroundImage: "/images/s3-detail-bg.png",
  subtitle: "上蓋特寫",
  title: "磁吸防塵保護蓋",
  description: "磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。",
  specs: [
    { label: "適用機型", value: "S3 旗艦版刮鬍刀" },
    { label: "核心功能", value: "磁吸防塵保護蓋" },
    { label: "磁吸結構", value: "一貼即合" },
    { label: "機身材質", value: "鋅合金壓鑄" },
  ],
  features: HOME_PRODUCT_INTRO_FEATURES_FALLBACK,
};
