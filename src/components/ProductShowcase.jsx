"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// 模擬產品資料 (升級了指示線系統，確保圓點絕對不跑位)
// ============================================================================
const PRODUCTS = [
  {
    id: 1,
    badge: "15% OFF",
    name: "電動刮鬍刀配件-雙環開放式圓刀",
    currentPrice: "$480",
    originalPrice: "$480",
    thumbUrl: "/images/截圖-2026-05-17-晚上7.35.34.png",
    mainUrl: "/images/1731575318_6ddbd86976c9b624412a.png",
    features: [
      {
        title: "Deliver Wired-Level Speed",
        bullets: [
          "Qi2 15W Module and TEC Active Cooling",
          "Charge iPhone to 50% in 22 Minutes",
        ],
        // 拉高到 top-5% 避免與下方重疊
        boxPos: "top-[5%] left-[5%]",
        // 🌟 線條從右側邊緣(left-full)往外長 150px，並帶有 15 度角
        lineClass:
          "top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
        // 🌟 圓點黏在線條的最右端
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "Cooler Charging, Healthier Battery",
        bullets: [
          "Keeps Phone Temperature Below 93°F",
          "Industry-Leading TEC Cooling",
        ],
        // 壓低到 bottom-10% 避免與上方重疊
        boxPos: "bottom-[10%] left-[8%]",
        // 🌟 線條往上斜 20 度
        lineClass:
          "top-[30%] left-full w-[120px] h-[1px] origin-left rotate-[-20deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "Real-Time Smart Display",
        bullets: ["View Power, Temperature, and More", '1.65" HD Smart Screen'],
        // 右側方塊
        boxPos: "top-[35%] right-[5%]",
        // 🌟 右側方塊的線條要從左側邊緣(right-full)往左長，所以 origin 是 right
        lineClass:
          "top-[50%] right-full w-[160px] h-[1px] origin-right rotate-[-10deg]",
        // 🌟 圓點黏在線條的最左端
        dotClass: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 2,
    badge: "$20 OFF",
    name: "電動刮鬍刀配件-雙環開放式圓刀",
    currentPrice: "$480",
    originalPrice: "$480",
    thumbUrl: "/images/截圖-2026-05-17-晚上7.35.34.png",
    mainUrl: "/images/截圖-2026-05-17-晚上7.35.34.png",
    features: [
      {
        title: "雙環開放式刀頭 2.0版",
        bullets: ["德國進口材料，日本加工技術", "開放式圓刀+獨立浮動刀網"],
        boxPos: "top-[15%] left-[10%]",
        lineClass:
          "top-[50%] left-full w-[180px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
];

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentProduct = PRODUCTS[activeIndex] || PRODUCTS[0];

  return (
    <section className="w-full bg-[#050507] font-sans pt-16 pb-24 overflow-hidden min-h-screen flex flex-col relative">
      {/* ==================================================
          科技感背景光暈 (Glow Effect)
          ================================================== */}
      <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none mt-[10vh] overflow-hidden">
        <div className="absolute w-[80%] max-w-[1200px] h-[400px] bg-[#1a4b8c] opacity-[0.35] blur-[120px] rounded-[100%]"></div>
        <div className="absolute w-[50%] max-w-[600px] h-[200px] bg-white opacity-[0.12] blur-[80px] rounded-[100%] mt-[50px]"></div>
      </div>

      {/* ==================================================
          上方：動態大圖與產品賣點展示區塊
          ================================================== */}
      <div className="relative w-full max-w-[1400px] mx-auto h-[450px] md:h-[550px] mb-12 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* 核心大圖 */}
            <div className="relative w-[50%] h-[90%] flex items-center justify-center z-10 pointer-events-none">
              <img
                src={currentProduct.mainUrl}
                alt={currentProduct.name}
                className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* 浮動賣點文字方塊與指示線 */}
            {currentProduct.features?.map((feature, idx) => (
              <div
                key={idx}
                className={`absolute ${feature.boxPos} z-20 w-[280px] bg-[#18181b]/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl`}
              >
                <h3 className="text-white text-[15px] font-bold leading-tight mb-3">
                  {feature.title}
                </h3>

                <ul className="text-[#a1a1aa] text-[13px] leading-relaxed space-y-1.5 pl-3">
                  {feature.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="relative">
                      <span className="absolute left-[-12px] top-[7px] w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* 🌟 核心特效：將「圓點」直接寫在「線條」的內部！這樣旋轉就不會跑掉 */}
                {feature.lineClass && (
                  <div
                    className={`absolute bg-white/30 pointer-events-none ${feature.lineClass}`}
                  >
                    {/* 發光圓點 */}
                    <div
                      className={`absolute w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] ${feature.dotClass}`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ==================================================
          下方：產品 Hover 卡片列
          ================================================== */}
      <div className="w-full max-w-[1600px] mx-auto px-6 overflow-x-auto pb-8 custom-scrollbar z-10">
        <div className="flex justify-center gap-4 min-w-max mx-auto">
          {PRODUCTS.map((product, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={`
                  relative w-[210px] flex-shrink-0 rounded-xl p-4 cursor-pointer 
                  transition-all duration-300 ease-out group
                  ${isActive ? "bg-[#1f1f22]" : "bg-[#131315] hover:bg-[#1a1a1d]"}
                `}
                style={{
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-[3px] rounded-t-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#00A3FF] shadow-[0_0_12px_rgba(0,163,255,0.8)]"
                      : "bg-transparent"
                  }`}
                ></div>

                <div className="bg-[#27272a] text-[#00A3FF] border border-[#00A3FF]/20 text-[10px] font-bold px-2 py-1 rounded w-fit mb-4">
                  {product.badge}
                </div>

                <div className="w-full h-[120px] mb-4 flex items-center justify-center p-2">
                  <img
                    src={product.thumbUrl}
                    alt={product.name}
                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-white text-[13px] font-medium leading-snug h-[40px] line-clamp-2 mb-4">
                  {product.name}
                </h4>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-[18px] font-bold tracking-tight">
                    {product.currentPrice}
                  </span>
                  <span className="text-[#71717a] text-[12px] font-medium line-through">
                    {product.originalPrice}
                  </span>
                </div>

                <button
                  className={`w-full py-2 rounded-lg text-[13px] font-bold transition-colors duration-300 ${
                    isActive
                      ? "bg-[#00A3FF] text-white hover:bg-[#008ce6]"
                      : "bg-transparent text-[#00A3FF] border border-[#00A3FF] hover:bg-[#00A3FF]/10"
                  }`}
                >
                  Buy Now
                </button>
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
