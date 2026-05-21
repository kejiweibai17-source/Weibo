"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// 昔馬 捍衛者 (Defender) 產品線資料
// ============================================================================
const PRODUCTS = [
  {
    id: 1,
    badge: "配件 1",
    name: "捍衛者-全合金戰損刮鬍刀",
    tags: ["全合金壓鑄", "戰損塗裝", "IPX7全機防水"],
    thumbUrl: "/images/捍衛者/捍衛者-01.png",
    mainUrl: "/images/捍衛者/捍衛者-01.png",
    features: [
      {
        title: "硬派美學，戰損塗裝",
        bullets: [
          "手工打磨戰損痕跡，每把皆獨一無二",
          "高溫壓鑄全合金機身，沉穩冰冷握感",
        ],
        boxPos: "md:absolute md:top-[15%] md:left-[5%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "澎湃動力，長效續航",
        bullets: ["毫秒級高速抗震低噪馬達", "1小時Type-C快充，60天超長待機"],
        boxPos: "md:absolute md:bottom-[15%] md:left-[8%]",
        lineClass:
          "hidden md:block top-[20%] left-full w-[120px] h-[1px] origin-left rotate-[-20deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 2,
    badge: "配件 2",
    name: "雙環開放式浮動圓刀頭",
    tags: ["荷蘭進口刀片", "自研磨技術", "磁吸快拆"],
    thumbUrl: "/images/捍衛者/捍衛者-02.png",
    mainUrl: "/images/捍衛者/捍衛者-02.png",
    features: [
      {
        title: "精準捕捉，毫秒切割",
        bullets: ["雙環超薄刀網，進刀量提升50%", "無縫貼合下巴與顎骨曲線"],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "黑科技自體研磨刀片",
        bullets: [
          "越用越鋒利，告別卡鬚與拉扯",
          "一秒磁吸快拆，水洗清潔毫不費力",
        ],
        boxPos: "md:absolute md:top-[35%] md:right-[5%]",
        lineClass:
          "hidden md:block top-[50%] right-full w-[140px] h-[1px] origin-right rotate-[-10deg]",
        dotClass: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 3,
    badge: "配件 3",
    name: "磁吸式戰術鬢角修剪器",
    tags: ["精準修容", "一秒替換", "俐落塑型"],
    thumbUrl: "/images/捍衛者/捍衛者-03.png",
    mainUrl: "/images/捍衛者/捍衛者-03.png",
    features: [
      {
        title: "多功能修容武裝",
        bullets: ["快速替換刀頭，一機多用", "專為亞洲男士輪廓設計的精準刀口"],
        boxPos: "md:absolute md:top-[25%] md:left-[8%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[180px] h-[1px] origin-left rotate-[10deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 4,
    badge: "配件 4",
    name: "無痛立體鼻毛修剪刀",
    tags: ["立體圓頂", "安全不傷膚", "高速運轉"],
    thumbUrl: "/images/捍衛者/捍衛者-05.png",
    mainUrl: "/images/捍衛者/捍衛者-05.png",
    features: [
      {
        title: "立體圓頂安全刀網",
        bullets: [
          "貼合鼻腔曲線，徹底杜絕刮傷",
          "內建微型高扭力馬達，俐落不拉扯",
        ],
        boxPos: "md:absolute md:bottom-[20%] md:right-[10%]",
        lineClass:
          "hidden md:block top-[50%] right-full w-[160px] h-[1px] origin-right rotate-[15deg]",
        dotClass: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 5,
    badge: "配件 5",
    name: "專屬戰術防撞旅行盒",
    tags: ["軍規防護", "量身訂製", "便攜收納"],
    thumbUrl: "/images/截圖-2026-05-17-晚上7.35.34.png",
    mainUrl: "/images/截圖-2026-05-17-晚上7.35.34.png",
    features: [
      {
        title: "軍規級防撞保護",
        bullets: ["高強度抗震材質，完美保護機身", "防刮內襯設計，抵抗劇烈晃動"],
        boxPos: "md:absolute md:top-[15%] md:left-[8%]",
        lineClass:
          "hidden md:block top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "一體化收納空間",
        bullets: [
          "精準孔位設計，機身與配件各自歸位",
          "商務旅行、戶外探索的最佳裝備",
        ],
        boxPos: "md:absolute md:top-[40%] md:right-[5%]",
        lineClass:
          "hidden md:block top-[50%] right-full w-[160px] h-[1px] origin-right rotate-[-10deg]",
        dotClass: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
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
              <img
                src={currentProduct.mainUrl}
                alt={currentProduct.name}
                className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
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
                  <img
                    src={product.thumbUrl}
                    alt={product.name}
                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
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
