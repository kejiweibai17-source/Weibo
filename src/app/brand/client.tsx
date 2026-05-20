"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// ============================================================================
// 昔馬 SMASMALL 真實產品系列資料設定 (全繁體中文在地化)
// ============================================================================
const PRODUCT_CATEGORIES = [
  {
    categoryTitle: "Premium Alloy Series",
    categorySubtitle: "經典合金系列",
    products: [
      {
        name: "昔馬 S1 經典青春版",
        slogan: "重塑經典，品味隨行。",
        description:
          "採用獨創高溫壓鑄全合金機身，手感沉穩冰冷。搭載荷蘭進口精鋼刀片與雙環超薄刀網，配合自研磨技術，越用越鋒利。支援 IPX7 全機防水，乾濕兩用，讓您隨時保持俐落清爽的面貌。",
        imgUrl: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png", // 替換為 S1 產品圖
        reverse: false, // 圖片在左
      },
      {
        name: "昔馬 S3 小金剛旗艦版",
        slogan: "極致動力，無懈可擊。",
        description:
          "專為追求極致效能的男士打造。內建升級版毫秒級高速抗震低噪馬達，動力澎湃。搭配業界首創「磁吸式快拆刀頭」，一秒拆卸無縫貼合，徹底解決傳統卡榫易斷裂問題，清潔保養毫不費力。",
        imgUrl: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png", // 替換為 S3 產品圖
        reverse: true, // 圖片在右
      },
      {
        name: "昔馬 S1-DK 黑夜騎士",
        slogan: "深邃暗黑，硬派美學。",
        description:
          "延續 S1 經典架構，披上極致深邃的消光黑夜塗裝。專為低調且注重質感的都會男士設計，每一處細節都散發著復古未來主義的獨特魅力，是展現個人風格的最佳桌面理容藝術品。",
        imgUrl: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png", // 替換為黑夜騎士版產品圖
        reverse: false, // 圖片在左
      },
    ],
  },
  {
    categoryTitle: "Exclusive Gift Sets",
    categorySubtitle: "尊榮限定禮盒",
    products: [
      {
        name: "昔馬 x 威柏 尊榮理容套裝",
        slogan: "送禮首選，極致尊榮。",
        description:
          "專為高階商務人士與節日送禮打造的頂級套裝。內含昔馬合金電動刮鬍刀、專屬訂製皮革防撞收納包，以及高質感清潔配件。威柏科技總代理品質承諾，提供最完善的一年原廠保固。",
        imgUrl: "/images/002.png", // 替換為禮盒組產品圖
        reverse: false,
      },
    ],
  },
];

export default function SmasmallCollections() {
  return (
    <div className="w-full bg-[#f8f9fb] text-slate-900 font-sans selection:bg-blue-200 antialiased">
      {/* ====================================================================
          SECTION 1: Hero Section (科技感發光光束背景)
          ==================================================================== */}
      <section className="relative w-full h-[70vh] min-h-[500px] bg-[#020617] overflow-hidden flex items-center">
        {/* 純 CSS 繪製的頂級發光梯形光束 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full pointer-events-none flex justify-center">
          <div
            className="w-full h-full bg-gradient-to-b from-[#3b82f6] via-[#1d4ed8] to-transparent opacity-40 blur-3xl"
            style={{ clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0% 100%)" }}
          />
          <div className="absolute top-[-20px] w-[300px] h-[100px] bg-white opacity-80 blur-[40px]" />
        </div>

        {/* 內容區塊 */}
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-16 text-white text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            探索昔馬系列
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg font-bormal tracking-wide text-blue-100/70 max-w-lg leading-relaxed mx-auto md:mx-0"
          >
            為追求極致的品味男士，打造專屬的理容藝術品。
            <br className="hidden md:block" />
            台灣總代理威柏科技，原廠授權品質承諾。
          </motion.p>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2 & 3: 產品類別與交替排版區塊
          ==================================================================== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        {PRODUCT_CATEGORIES.map((category, catIdx) => (
          <div key={catIdx} className="mb-24 last:mb-0">
            {/* 類別標題 */}
            <div className="mb-12 border-b border-gray-200 pb-4">
              <p className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2">
                {category.categoryTitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {category.categorySubtitle}
              </h2>
            </div>

            {/* 該類別下的產品卡片列表 */}
            <div className="flex flex-col gap-12 md:gap-16">
              {category.products.map((product, prodIdx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  key={prodIdx}
                  className={`flex flex-col ${product.reverse ? "md:flex-row-reverse" : "md:flex-row"} w-full bg-white border-gray-200 transition-shadow duration-500  overflow-hidden border border-gray-100 group`}
                >
                  {/* 產品圖片區塊 (佔 55%) */}
                  <div className="w-full md:w-[55%] relative h-[300px] md:h-[450px] bg-[#f0f0f2] overflow-hidden">
                    <Image
                      src={product.imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>

                  {/* 產品文案區塊 (佔 45%) */}
                  <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                      {product.name}
                    </h3>

                    <div className="mb-10">
                      <p className="font-bold text-blue-600 text-sm md:text-base mb-4 tracking-wide">
                        {product.slogan}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* 了解更多按鈕 */}
                    <div>
                      <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-full">
                        進一步了解
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
