/**
 * 各產品頁 Hero Slider 圖片資料
 * ─────────────────────────────────────────────────────────
 * 這裡是唯一真實來源 (Single Source of Truth)：
 *   - src/components/Slider01~04.jsx  → 讀取圖片路徑
 *   - src/app/product01~04/page.tsx   → 讀取 ogImage 作為社群預覽圖
 *
 * 換正式網域時只需修改 .env.local 的 NEXT_PUBLIC_SITE_URL，
 * 圖片路徑本身是相對路徑，無需變動。
 */

export type ProductSlide = {
  image: string;
};

export type ProductSlideSet = {
  /** 社群 OG 預覽圖（取第一張，確保為真實產品照而非 logo） */
  ogImage: string;
  slides: ProductSlide[];
};

/** 捍衛者+ 全合金電動刮鬍刀 */
export const PRODUCT01_SLIDES: ProductSlideSet = {
  ogImage: "/images/捍衛者/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
  slides: [
    { image: "/images/捍衛者/3d922fff-8ec9-4ec6-97b1-35b15933b297.png" },
    { image: "/images/61e0b64e-1f2c-465c-91e6-34dde2596b4e.png" },
  ],
};

/** 黑夜騎士 電動刮鬍刀 */
export const PRODUCT02_SLIDES: ProductSlideSet = {
  ogImage: "/images/index/banner-03.png",
  slides: [
    { image: "/images/index/banner-03.png" },
    { image: "/images/index/banner-05.png" },
  ],
};

/** 青春版 電動刮鬍刀禮盒 */
export const PRODUCT03_SLIDES: ProductSlideSet = {
  ogImage: "/images/003-01.png",
  slides: [
    { image: "/images/003-01.png" },
    { image: "/images/c76f76c2-bf85-4d91-8a9e-6369c72ff73a.png" },
  ],
};

/** 星座系列 CQ 電動刮鬍刀 */
export const PRODUCT04_SLIDES: ProductSlideSet = {
  ogImage: "/images/953b6625-1fbc-4927-8b1c-bc709d4299e4.png",
  slides: [
    { image: "/images/953b6625-1fbc-4927-8b1c-bc709d4299e4.png" },
    { image: "/images/d9872a6c-f0cb-4df0-9c83-28a682df1a6f.png" },
  ],
};
