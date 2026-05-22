"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";

// ============================================================================
// 🛒 模擬商品資料庫
// ============================================================================
const PRODUCTS_DB = {
  p1: {
    id: "p1",
    title: "捍衛者全合金戰損刮鬍刀 (旗艦主機)",
    price: 2480,
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
    shipping:
      "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。",
    images: [
      "/images/捍衛者/捍衛者-01.png",
      "/images/捍衛者/捍衛者-02.png",
      "/images/捍衛者/捍衛者-03.png",
    ],
  },
  p2: {
    id: "p2",
    title: "雙環開放式浮動圓刀頭 (二入組)",
    price: 480,
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
    shipping:
      "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。",
    images: [
      "/images/捍衛者/捍衛者-02.png",
      "/images/捍衛者/捍衛者-03.png",
      "/images/捍衛者/捍衛者-06.png",
    ],
  },
  p7: {
    id: "p7",
    title: "專屬戰術防撞旅行盒 (鋼鐵灰)",
    price: 580,
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
    shipping:
      "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。",
    images: ["/images/捍衛者/捍衛者-07.png", "/images/捍衛者/捍衛者-04.png"],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const targetProduct = PRODUCTS_DB[params.id] || PRODUCTS_DB["p1"];
    if (targetProduct) {
      setProduct(targetProduct);
    } else {
      router.push("/accessories");
    }
  }, [params.id, router]);

  if (!product) return <div className="min-h-screen bg-white"></div>;

  const toggleAccordion = (title) => {
    setActiveAccordion(activeAccordion === title ? null : title);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= Math.round(rating) ? "text-[#00B4D8]" : "text-gray-200"}`}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-[60px] lg:pt-[72px]">
      {/* 🌟 頂部麵包屑導覽 */}
      <div className="w-full border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 py-3.5 flex items-center gap-2 text-[13px] text-gray-500 font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-black transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/accessories")}
            className="hover:text-black transition-colors"
          >
            Accessories
          </button>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-0 lg:px-12 flex flex-col lg:flex-row">
        {/* ========================================================
            左側：圖片展示區 (拔除黑色背景，改為透明/白底)
            ======================================================== */}
        <div className="w-full lg:w-[55%] relative lg:h-[calc(100vh-72px)] lg:sticky top-[72px] bg-white lg:bg-transparent overflow-hidden">
          {/* 主圖展示區 (手機版高度縮減為 45vh，留出更多空間給內文) */}
          <div className="relative w-full h-[45vh] lg:h-[80%] flex items-center justify-center p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImgIdx}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* 移除了 mix-blend-screen，讓透明 PNG 正常顯示 */}
                <Image
                  src={product.images[mainImgIdx]}
                  alt={product.title}
                  width={800}
                  height={800}
                  className="max-w-[85%] max-h-[85%] object-contain drop-shadow-xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* 左右切換箭頭 (配合白底改為灰色系) */}
            {product.images.length > 1 && (
              <div className="absolute inset-x-4 flex justify-between z-10 pointer-events-none">
                <button
                  onClick={() =>
                    setMainImgIdx(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length,
                    )
                  }
                  className="pointer-events-auto w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-700 backdrop-blur-sm transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() =>
                    setMainImgIdx((prev) => (prev + 1) % product.images.length)
                  }
                  className="pointer-events-auto w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-700 backdrop-blur-sm transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* 縮圖點點選擇器 (配合白底改為灰色系) */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full z-20">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    mainImgIdx === idx
                      ? "w-6 h-1.5 bg-[#00B4D8]" // 啟動狀態保持藍色
                      : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400" // 未啟動狀態改為淺灰
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            右側：商品資訊與手風琴說明區
            ======================================================== */}
        <div className="w-full lg:w-[45%] px-5 py-8 lg:py-24 lg:pl-16">
          {/* 標題與評價 */}
          <h1 className="text-2xl md:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3 tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex tracking-widest">
              {renderStars(product.rating)}
            </div>
            <span className="text-[13px] text-gray-500 font-medium pt-0.5">
              {product.reviews} reviews
            </span>
          </div>

          {/* 簡短描述 */}
          <p className="text-[15px] text-gray-600 leading-relaxed font-medium mb-10">
            {product.shortDesc}
          </p>

          {/* 🌟 核心：手風琴 (Accordion) 產品特色與細節 */}
          <div className="w-full border-t border-gray-200">
            {product.features.map((feature, idx) => {
              const isOpen = activeAccordion === feature.title;
              return (
                <div key={idx} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleAccordion(feature.title)}
                    className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
                  >
                    <span
                      className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${isOpen ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                    >
                      {feature.title}
                    </span>
                    <span className="text-gray-400 group-hover:text-black transition-colors">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6">
                          {feature.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* 靜態區塊：Product Details */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
              >
                <span
                  className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${activeAccordion === "details" ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                >
                  產品規格與細節
                </span>
                <span className="text-gray-400 group-hover:text-black transition-colors">
                  {activeAccordion === "details" ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {activeAccordion === "details" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6 whitespace-pre-line">
                      {product.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 靜態區塊：Shipping */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
              >
                <span
                  className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${activeAccordion === "shipping" ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                >
                  配送與售後服務
                </span>
                <span className="text-gray-400 group-hover:text-black transition-colors">
                  {activeAccordion === "shipping" ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {activeAccordion === "shipping" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6">
                      {product.shipping}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================================
              底部：價格與購買按鈕
              ======================================================== */}
          {/* 在手機版時固定在最底部，並加上 pb-safe 避免被 iPhone Home 條擋住 */}
          <div className="fixed bottom-0 left-0 w-full lg:relative lg:mt-12 bg-white border-t lg:border-none border-gray-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:p-0 flex items-center justify-between z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              NT$ {product.price}
            </span>
            <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white px-8 md:px-12 py-3 rounded-full font-bold text-[15px] transition-colors shadow-lg shadow-cyan-500/30">
              前往購買
            </button>
          </div>
          {/* 增加底部空間，避免手機版按鈕擋住內文最後一行 */}
          <div className="h-24 lg:h-0"></div>
        </div>
      </div>
    </div>
  );
}
