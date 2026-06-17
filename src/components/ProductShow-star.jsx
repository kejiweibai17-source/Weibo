"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
const IMG_BASE = "/images/accessories/星座系列電動刮鬍刀禮盒/產品內容物";
const IMG_ROOT = "/images/accessories/星座系列電動刮鬍刀禮盒";

function ProductImage({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] text-[11px] text-gray-500 ${className}`}
        aria-label={alt}
      >
        圖片待補
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}

// ============================================================================
// 昔馬 星座系列 (CQ) 產品線資料
// ============================================================================
const PRODUCTS = [
  {
    id: 1,
    badge: "系列",
    name: "四象全系列",
    tags: ["火象", "土象", "風象", "水象", "CQ1"],
    thumbUrl: `${IMG_BASE}/星座系列電動刮鬍刀禮盒.png`,
    mainUrl: `${IMG_BASE}/星座系列電動刮鬍刀禮盒.png`,
    features: [
      {
        title: "十二星座 四象主題",
        bullets: [
          "火、土、風、水四款配色與星座元素",
          "依星座個性挑選，送禮自用皆宜",
        ],
        boxPos: "md:absolute md:top-[15%] md:left-[5%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 2,
    badge: "配件",
    name: "皮革包裝袋",
    tags: ["皮革收納", "質感配件", "便攜"],
    thumbUrl: `${IMG_ROOT}/11.jpg`,
    mainUrl: `${IMG_ROOT}/11.jpg`,
    features: [
      {
        title: "皮革包裝袋 質感收納",
        bullets: [
          "專屬皮革袋保護主機，外出收納更體面",
          "輕巧便攜，差旅與日常隨行皆宜",
        ],
        boxPos: "md:absolute md:top-[18%] md:left-[8%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[140px] h-[1px] origin-left rotate-[10deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 3,
    badge: "配件",
    name: "毛刷",
    tags: ["清潔毛刷", "刀頭保養", "配件"],
    thumbUrl: null,
    mainUrl: null,
    features: [
      {
        title: "專用清潔毛刷",
        bullets: [
          "輕鬆清理刀頭與網罩殘屑，維持刮鬍順暢",
          "日常保養必備，延長刀頭使用壽命",
        ],
        boxPos: "md:absolute md:bottom-[18%] md:left-[8%]",
        lineClass:
          "hidden md:block top-[20%] left-full w-[120px] h-[1px] origin-left rotate-[-15deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 4,
    badge: "配件",
    name: "外包裝紙袋",
    tags: ["紙袋", "送禮包裝", "品牌識別"],
    thumbUrl: `${IMG_ROOT}/13.jpg`,
    mainUrl: `${IMG_ROOT}/13.jpg`,
    features: [
      {
        title: "外包裝紙袋 送禮加分",
        bullets: [
          "品牌紙袋完整包裝，送禮體面有質感",
          "搭配禮盒一同呈現，開箱儀式感更完整",
        ],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
];

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentProduct = PRODUCTS[activeIndex] || PRODUCTS[0];

  // 處理手機版滑動切換邏輯
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % PRODUCTS.length);
    } else if (info.offset.x > swipeThreshold) {
      setActiveIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
    }
  };

  return (
    <section className="w-full bg-[#050507] font-sans pt-16 pb-[150px] h-auto flex flex-col relative overflow-hidden">
      {/* 科技感背景光暈 (Glow Effect) */}
      <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none pt-[13vh]">
        <div className="absolute w-[80%] max-w-[1200px] h-[400px] bg-[#ea580c] opacity-[0.15] blur-[120px] rounded-[100%]"></div>
        <div className="absolute w-[50%] max-w-[600px] h-[200px] bg-white opacity-[0.08] blur-[80px] rounded-[100%] mt-[50px]"></div>
      </div>

      {/* ==================================================
          上方：動態大圖與產品賣點展示區塊
          ================================================== */}
      <div className="relative w-full max-w-[1400px] mx-auto min-h-[400px] md:h-[650px] mb-8 md:mb-12 z-10 px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="relative md:absolute inset-0 w-full h-full flex flex-col items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
          >
            {/* 🌟 核心大圖：已經完全置中 */}
            <div className="relative w-full md:w-[60%] h-[280px] md:h-[90%] flex items-center justify-center z-10 pointer-events-none mb-4 md:mb-0 shrink-0">
              <ProductImage
                src={currentProduct.mainUrl}
                alt={currentProduct.name}
                className={
                  currentProduct.mainUrl
                    ? "max-h-full w-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    : "h-[180px] md:h-[280px] w-full max-w-[420px] object-contain"
                }
              />
            </div>

            {/* 手機版專屬：滑動圓點指示器 */}
            <div className="flex md:hidden items-center justify-center gap-2 mb-6 pointer-events-none">
              {PRODUCTS.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === dotIdx
                      ? "w-4 bg-[#ea580c]"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* 🌟 浮動賣點文字方塊：在電腦版時改為絕對定位 (absolute inset-0) 確保不推擠主圖 */}
            <div className="w-full flex flex-col gap-4 md:absolute md:inset-0 z-20 pointer-events-none md:pointer-events-auto">
              {currentProduct.features?.map((feature, idx) => (
                <div
                  key={idx}
                  className={`
                    ${feature.boxPos} 
                    relative md:absolute
                    w-full md:w-[280px] bg-[#18181b]/60 md:bg-[#18181b]/80 backdrop-blur-md 
                    p-4 md:p-5 rounded-xl border border-white/5 md:border-white/10 shadow-lg md:shadow-2xl
                  `}
                >
                  <h3 className="text-white text-[14px] md:text-[15px] font-bold leading-tight mb-2 md:mb-3">
                    {feature.title}
                  </h3>

                  <ul className="text-[#a1a1aa] text-[12px] md:text-[13px] leading-relaxed space-y-1.5 pl-3">
                    {feature.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="relative">
                        <span className="absolute left-[-12px] top-[7px] w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {feature.lineClass && (
                    <div
                      className={`absolute bg-white/30 pointer-events-none ${feature.lineClass}`}
                    >
                      <div
                        className={`absolute w-[5px] h-[5px] bg-[#ea580c] rounded-full shadow-[0_0_8px_rgba(234,88,12,0.8)] ${feature.dotClass}`}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ==================================================
          下方：產品 Hover 卡片列 (加入 Tags 標籤系統)
          ================================================== */}
      <div className="w-full max-w-[1600px] mx-auto px-6 overflow-x-auto pb-8 custom-scrollbar z-10 mt-4 md:mt-0">
        <div className="flex md:justify-center gap-4 min-w-max mx-auto">
          {PRODUCTS.map((product, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`
                  relative w-[180px] md:w-[220px] flex-shrink-0 rounded-xl p-3 md:p-4 cursor-pointer 
                  transition-all duration-300 ease-out group flex flex-col
                  ${isActive ? "bg-[#1f1f22]" : "bg-[#131315] hover:bg-[#1a1a1d]"}
                `}
                style={{
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.03)",
                }}
              >
                {/* 頂部高光線 */}
                <div
                  className={`absolute top-0 left-0 w-full h-[3px] rounded-t-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#ea580c] shadow-[0_0_12px_rgba(234,88,12,0.8)]"
                      : "bg-transparent"
                  }`}
                ></div>

                {/* 配件 Badge */}
                <div className="bg-[#27272a] text-[#ea580c] border border-[#ea580c]/20 text-[10px] font-bold px-2 py-1 rounded w-fit mb-3">
                  {product.badge}
                </div>

                {/* 縮圖 */}
                <div className="w-full h-[100px] md:h-[120px] mb-3 flex items-center justify-center p-2">
                  <ProductImage
                    src={product.thumbUrl}
                    alt={product.name}
                    className={
                      product.thumbUrl
                        ? "max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        : "h-full w-full"
                    }
                  />
                </div>

                {/* 產品名稱 */}
                <h4 className="text-white text-[12px] md:text-[14px] font-medium leading-snug line-clamp-2 mb-3">
                  {product.name}
                </h4>

                {/* 🌟 新增：文字標記系統 (Tags)，取代原本的空洞感 */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {product.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded-sm text-[10px] text-gray-400 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 max-w-[1420px] w-[95%] sm:w-[80%] xl:w-[70%] mx-auto">
        <div className="p-3">
          <Image
            src="/images/accessories/星座系列電動刮鬍刀禮盒/說明書/星座系列電動刮鬍刀＿繁體版說明書.png"
            alt="昔馬星座系列電動刮鬍刀禮盒說明書 威柏科技-昔馬電動刮鬍刀總代理"
            width={1000}
            height={1000}
            placeholder="empty"
            loading="lazy"
            className="w-full"
          ></Image>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  );
}
