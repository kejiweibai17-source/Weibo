/**
 * 配件商品資料（列表 + 詳情共用）
 *
 * ── 如何換圖片 ─────────────────────────────────────────────
 * 1. 把圖片放到對應系列的資料夾（見 ACCESSORY_SERIES.imageDir）
 * 【自動抓圖】
 * - 列表頁：系列設 autoListFromFolder: true（例：完美紳士）→ 讀 imageDir 根目錄 .png/.jpg
 * - 青春版詳情輪播：{款式}/產品內容物 + 文宣（見 API carousel）
 *
 * 手動商品：在 ACCESSORY_CATALOG 填寫
 *
 * 例：青春版｜月光銀 (p11) — 詳情頁主輪播（自動抓圖，順序固定）
 *   1. 禮盒內容物/ 或 series.boxContents 檔名（系列根目錄）
 *   2. 月光銀/產品內容物/
 *   3. 文宣/（系列共用）
 *   放入圖片後重新整理頁面即可，無需改檔名陣列。支援 .png .jpg .jpeg .webp .gif
 *
 *   列表縮圖仍用 imageFiles: ["月光銀.png"]（系列根目錄）
 *   下方「使用情境」：detail.scenarioImageFiles → 情境圖/ 資料夾
 *
 *   右欄 embed：rightPanel.socialEmbeds[]（可放 2–3 則）
 *     YouTube 例：https://www.youtube.com/watch?v=影片ID
 *     Facebook 例：plugins/post.php 的 src，或貼文網址
 * ─────────────────────────────────────────────────────────
 */

export const PLACEHOLDER_IMG = "/images/placeholder/accessory.png";

/** 各產品系列：篩選名稱 + 圖片資料夾（對應 public/ 下的路徑） */
export const ACCESSORY_SERIES = {
  Defender: {
    label: "捍衛者 Defender",
    imageDir: "/images/accessories/捍衛者",
    autoListFromFolder: true,
    listPrice: 2480,
    listCategory: "Misc",
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
  Constellation: {
    label: "星座系列電動刮鬍刀禮盒",
    imageDir: "/images/accessories/星座系列電動刮鬍刀禮盒",
    autoListFromFolder: true,
    listPrice: 1980,
    listCategory: "Misc",
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
  NoseHair: {
    label: "電動鼻毛修剪器",
    imageDir: "/images/accessories/電動鼻毛修剪器",
    autoListFromFolder: true,
    listPrice: 980,
    listCategory: "Misc",
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
  LittleKingKong: {
    label: "小金剛旗艦三刀頭電動刮鬍刀",
    imageDir: "/images/accessories/小金剛旗艦三刀頭電動刮鬍刀",
    autoListFromFolder: true,
    listPrice: 2680,
    listCategory: "Misc",
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
  Youth: {
    label: "青春版電動刮鬍刀禮盒-三色",
    imageDir: "/images/accessories/青春版電動刮鬍刀禮盒-三色",
    /** 詳情頁「禮盒內容物」區塊（四項共用） */
    boxContents: [
      "月光銀.png",
      "幻影黑.png",
      "元素灰.png",
      "青春版紙袋.png",
    ],
    /** 詳情頁輪播：自動讀取 {mediaFolder}/產品內容物 + 情境圖 */
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    /** 下方「使用情境」區塊：改抓文宣 */
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
    /**
     * 詳情頁右欄：服務特色格 + YouTube / Facebook 嵌入 + 評價卡
     * socialEmbeds 可增減項目，url 填影片或貼文網址（勿貼整段 iframe HTML）
     */
    rightPanel: {
      storeTitle: "昔馬 SMASMALL 官方購物體驗",
      featureCards: [
        { title: "台灣本島快速出貨", icon: "truck" },
        { title: "原廠保固服務", icon: "shield" },
        { title: "滿 NT$1,500 免運", icon: "package" },
        { title: "安全付款機制", icon: "creditCard" },
      ],
      socialSectionTitle: " ",
      youtubeSectionTitle: " ",
      facebookSectionTitle: "",
      socialEmbeds: [
        {
          id: "youth-yt-1",
          platform: "youtube",
          label: "昔馬電動刮鬍刀",
          url: "https://www.youtube.com/embed/PRrttiBeIUQ?si=1deTLBPpssrizKob",
          height: 400,
        } ,
        {
          id: "youth-fb-1",
          platform: "facebook",
          label: "Facebook-昔馬電動刮鬍刀",
          url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F249wzrtv%2Fposts%2Fpfbid048qx6r5wo1Ys4FobHLbBwsKyTQLXvBa5kXJLn8SeK7U6J4mJLg94JYhnjnyEkjjql&show_text=true&width=500",
          height: 640,
        },
        {
          id: "youth-fb-2",
          platform: "facebook",
          label: "昔馬 SMASMALL 星座系列電動刮鬍刀禮盒",
          url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F249wzrtv%2Fposts%2Fpfbid02F1yBJ5STFKKDvVEizeCD1GcDMjkbDND5sNLHHGMjUNhFKQZ8iV2faFHfgHtY3gLml&show_text=true&width=500",
          height: 720,
        },
      ],
      reviewsSectionTitle: "顧客評價",
      customerReviews: [
        {
          id: "demo-1",
          author: "範例用戶 A",
          verified: true,
          date: "2026/03/15",
          rating: 5,
          title: "青春版禮盒開箱心得",
          body: "禮盒質感很好，三色主機都很好看。可於 accessories.js 的 customerReviews 替換為真實評價。",
          photos: [],
        },
      ],
    },
  },
  Gentleman: {
    label: "玩美紳士 Gentleman",
    imageDir: "/images/accessories/完美紳士",
    /** 列表頁：自動讀取 imageDir 根目錄內所有圖片為商品 */
    autoListFromFolder: true,
    listPrice: 2180,
    listCategory: "Misc",
    // 內頁輪播：固定前段抓 產品內容物，再接 文宣
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    // 內頁「使用情境」區塊
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
  DarkKnight: {
    label: "黑夜騎士 Dark Knight",
    imageDir: "/images/accessories/黑夜騎士",
    autoListFromFolder: true,
    listPrice: 2280,
    listCategory: "Misc",
    carouselFromFolders: true,
    carouselPromoPaths: ["情境圖"],
    scenarioPaths: ["文宣"],
    manualPaths: ["說明書"],
  },
};

export const COMPATIBILITY_OPTIONS = [
  { label: "All", value: "All" },
  ...Object.entries(ACCESSORY_SERIES).map(([value, { label }]) => ({
    label,
    value,
  })),
  { label: "S1 經典版", value: "S1" },
  { label: "S3 旗艦版", value: "S3" },
];

export const CATEGORY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "替換刀頭 (Blades)", value: "Blade" },
  { label: "收納包殼 (Cases)", value: "Case" },
  { label: "理容配件 (Grooming)", value: "Grooming" },
  { label: "其他周邊 (Misc)", value: "Misc" },
];

/** 依系列資料夾 + 檔名組出完整圖片 URL */
export function resolveSeriesImages(seriesKey, imageFiles) {
  const dir = ACCESSORY_SERIES[seriesKey]?.imageDir;
  if (!dir || !imageFiles?.length) return [PLACEHOLDER_IMG];
  return imageFiles.map((file) => `${dir}/${file}`);
}

const DEFAULT_SHIPPING =
  "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。";

const youthDetail = (colorLabel, imageFile, mediaFolder, extraScenario = []) => ({
  rating: 4.6,
  reviews: 72,
  mediaFolder,
  carouselFromFolders: true,
  shortDesc: `昔馬 SMASMALL 青春版電動刮鬍刀禮盒 — ${colorLabel}。輕巧好握，完整禮盒配件一次到位。`,
  features: [
    { title: "輕量機身", content: "小巧易攜，適合差旅與日常快速理容。" },
    {
      title: "完整禮盒內容",
      content: "內含主機、充電配件與專屬包裝，詳見下方「禮盒內容物」。",
    },
  ],
  details: `系列：青春版電動刮鬍刀禮盒-三色\n款式：${colorLabel}`,
  imageFiles: [imageFile],
  // 留空時會改由 seriesConfig.scenarioPaths 自動讀取資料夾
  scenarioImageFiles: extraScenario,
});

/**
 * 商品目錄
 * - series: 對應 ACCESSORY_SERIES 的 key
 * - imageFiles: 僅填檔名，會自動加上該系列 imageDir
 * - detail: 詳情頁專用欄位（選填）
 */
export const ACCESSORY_CATALOG = [
  // ── 捍衛者 ──
  {
    id: "p1",
    title: "捍衛者全合金戰損刮鬍刀 (旗艦主機)",
    price: 2480,
    series: "Defender",
    compatibility: ["Defender"],
    category: "Misc",
    imageFiles: ["捍衛者-01.png"],
    detail: {
      rating: 4.8,
      reviews: 128,
      shortDesc:
        "全合金壓鑄機身，搭配獨家戰損塗裝。每一台都擁有獨一無二的紋理，是展現極致硬派風格的最佳理容藝術品。",
      features: [
        {
          title: "全合金壓鑄工藝",
          content:
            "拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落。",
        },
        {
          title: "荷蘭進口精鋼刀片",
          content:
            "嚴選頂規荷蘭進口精鋼，搭配雙環超薄刀網與自銳研磨技術。刀片越用越鋒利，精準捕捉各種方向的鬍鬚。",
        },
        {
          title: "IPX7 頂級全機防水",
          content:
            "支援全機身水洗與乾濕兩用。無論是搭配刮鬍泡的深層淨容，或是淋浴時的快速剃鬚，都能輕鬆應對。",
        },
      ],
      details:
        "尺寸：6.5 x 5.2 x 2.8 cm\n重量：185g\n電池容量：600mAh\n充電時間：約 1 小時\n續航時間：約 60 天 (每日使用 1 分鐘)",
      imageFiles: ["捍衛者-01.png", "捍衛者-02.png", "捍衛者-03.png"],
    },
  },
  {
    id: "p2",
    title: "雙環開放式浮動圓刀頭 (二入組)",
    price: 480,
    series: "Defender",
    compatibility: ["Defender", "S1"],
    category: "Blade",
    imageFiles: ["捍衛者-02.png", "捍衛者-03.png"],
    detail: {
      rating: 4.9,
      reviews: 85,
      shortDesc:
        "專為亞洲男士臉型設計的彈性浮動系統。能精確貼合下顎與頸部輪廓，帶來無死角的滑順剃鬚體驗。",
      features: [
        {
          title: "開放式設計",
          content:
            "特殊的開放式結構讓鬍渣更容易排出，用水一沖即淨，大幅減少細菌滋生的機率。",
        },
        {
          title: "自銳研磨技術",
          content: "刀片在運作時會自動研磨，確保長時間使用依然鋒利如初。",
        },
      ],
      details:
        "材質：荷蘭進口精鋼\n適用型號：捍衛者 Defender、S1 經典版\n建議更換週期：每 6-12 個月更換一次以確保最佳效能。",
      imageFiles: ["捍衛者-02.png", "捍衛者-03.png", "捍衛者-06.png"],
    },
  },
  {
    id: "p3",
    title: "磁吸式戰術鬢角修剪器",
    price: 350,
    series: "Defender",
    compatibility: ["Defender"],
    category: "Grooming",
    imageFiles: ["捍衛者-03.png", "捍衛者-01.png"],
  },
  {
    id: "p4",
    title: "軍規高抗震型全合金機身底座",
    price: 550,
    series: "Defender",
    compatibility: ["Defender"],
    category: "Misc",
    imageFiles: ["捍衛者-04.png"],
  },
  {
    id: "p5",
    title: "無痛立體鼻毛修剪刀頭",
    price: 350,
    series: "Defender",
    compatibility: ["Defender", "S1"],
    category: "Grooming",
    imageFiles: ["捍衛者-05.png"],
  },
  {
    id: "p6",
    title: "精鋼自研磨深層淨容刀頭",
    price: 480,
    series: "Defender",
    compatibility: ["Defender", "S3"],
    category: "Blade",
    imageFiles: ["捍衛者-06.png"],
  },
  {
    id: "p7",
    title: "專屬戰術防撞旅行盒 (鋼鐵灰)",
    price: 580,
    series: "Defender",
    compatibility: ["Defender", "S3"],
    category: "Case",
    imageFiles: ["捍衛者-07.png"],
    detail: {
      rating: 5.0,
      reviews: 42,
      shortDesc:
        "採用高強度防撞材質，內部為高密度植絨。完美保護您的昔馬刮鬍刀與配件，是差旅出行的必備單品。",
      features: [
        {
          title: "高強度防撞外殼",
          content: "能有效抵禦掉落與擠壓，保護內部精密機械結構。",
        },
        {
          title: "專屬開模內襯",
          content: "根據機身尺寸 1:1 開模，確保主機與配件在移動中不會晃動碰撞。",
        },
      ],
      details:
        "材質：EVA 防撞硬殼 + 高級植絨內襯\n適用型號：捍衛者 Defender、S3 旗艦版\n尺寸：12 x 10 x 5 cm",
      imageFiles: ["捍衛者-07.png", "捍衛者-04.png"],
    },
  },
  // ── 星座系列：列表由 autoListFromFolder 自動產生（見 accessories.server.js）──
  // ── 青春版禮盒內容物（各一筆商品 → 獨立詳情頁，版型相同）──
  {
    id: "p11",
    title: "青春版電動刮鬍刀禮盒｜月光銀",
    price: 1680,
    series: "Youth",
    compatibility: ["Youth"],
    category: "Misc",
    imageFiles: ["月光銀.png"],
    detail: youthDetail("月光銀", "月光銀.png", "月光銀"),
  },
  {
    id: "p12",
    title: "青春版電動刮鬍刀禮盒｜幻影黑",
    price: 1680,
    series: "Youth",
    compatibility: ["Youth"],
    category: "Misc",
    imageFiles: ["幻影黑.png"],
    detail: youthDetail("幻影黑", "幻影黑.png", "幻影黑"),
  },
  {
    id: "p13",
    title: "青春版電動刮鬍刀禮盒｜元素灰",
    price: 1680,
    series: "Youth",
    compatibility: ["Youth"],
    category: "Misc",
    imageFiles: ["元素灰.png"],
    detail: youthDetail("元素灰", "元素灰.png", "元素灰"),
  },
  {
    id: "p14",
    title: "青春版禮盒｜專屬紙袋",
    price: 1680,
    series: "Youth",
    compatibility: ["Youth"],
    category: "Misc",
    imageFiles: ["青春版紙袋.png"],
    detail: youthDetail("專屬紙袋", "青春版紙袋.png", "青春版紙袋"),
  },
  // ── 玩美紳士：列表由 autoListFromFolder 自動產生（見 accessories.server.js）──
  // ── 黑夜騎士 ──
  {
    id: "p18",
    title: "黑夜騎士電動刮鬍刀禮盒 (傳奇灰)",
    price: 2280,
    series: "DarkKnight",
    compatibility: ["DarkKnight"],
    category: "Misc",
    imageFiles: ["禮盒-傳奇灰-01.png"],
    detail: {
      rating: 4.9,
      reviews: 63,
      shortDesc:
        "昔馬 SMASMALL 黑夜騎士電動刮鬍刀禮盒，傳奇灰配色展現低調硬派風格。",
      features: [
        { title: "傳奇灰配色", content: "沉穩灰調機身，兼具質感與耐用性。" },
        {
          title: "硬派理容體驗",
          content: "針對追求風格與效能並重的使用者設計。",
        },
      ],
      details: "系列：黑夜騎士\n顏色：傳奇灰",
    },
  },
  {
    id: "p19",
    title: "黑夜騎士雙環浮動刀頭 (二入組)",
    price: 480,
    series: "DarkKnight",
    compatibility: ["DarkKnight"],
    category: "Blade",
    imageFiles: ["刀頭-01.png"],
  },
  {
    id: "p20",
    title: "黑夜騎士戰術防撞旅行盒",
    price: 550,
    series: "DarkKnight",
    compatibility: ["DarkKnight"],
    category: "Case",
    imageFiles: ["收納-01.png"],
  },
];

export function toListItem(item) {
  const { id, title, price, compatibility, category, series, imageFiles } =
    item;
  return {
    id,
    title,
    price,
    compatibility,
    category,
    series,
    images: resolveSeriesImages(series, imageFiles),
  };
}

export function defaultAccessoryDetail(item) {
  const seriesLabel = ACCESSORY_SERIES[item.series]?.label ?? item.series;
  const imageFiles = item.detail?.imageFiles ?? item.imageFiles;
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    rating: 4.7,
    reviews: 24,
    shortDesc: `${item.title}，適用於 ${seriesLabel}。`,
    features: [
      {
        title: "原廠相容設計",
        content: `專為 ${seriesLabel} 開發，確保安裝與使用體驗。`,
      },
    ],
    details: `適用系列：${seriesLabel}`,
    shipping: DEFAULT_SHIPPING,
    images: resolveSeriesImages(item.series, imageFiles),
  };
}

/** 列表頁請用 accessories.server.js 的 buildAccessoryProducts() */
