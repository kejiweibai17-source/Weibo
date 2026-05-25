"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// ============================================================================
// 🛒 昔馬 S3 互動探索資料設定
// ============================================================================
const EXPLORER_DATA = [
  {
    id: 1,
    image: "/images/focus/carousel-01.png",
    bgScale: 2.2,
    hotspot: { top: "35%", left: "50%" },
    info: {
      target: "S3 旗艦版刮鬍刀",
      material: "鋅合金壓鑄",
      battery: "60天超長續航",
      waterproof: "IPX7 全機防水",
      blade: "雙環超薄刀網",
    },
    detail: {
      title: "磁吸式快拆刀頭",
      desc: "打破傳統卡榫限制，採用高強度磁吸結構，一秒拆卸、無縫貼合。清潔保養毫不費力，展現極致俐落的機械工藝。",
      frame: { top: "25%", left: "42%", width: "16%", height: "20%" },
      lineStart: { x: "58%", y: "45%" },
    },
  },
  {
    id: 2,
    // 🌟 已經幫你替換成第二張圖的正確路徑
    image: "/images/index/banner-04.png",
    bgScale: 1.4,
    hotspot: { top: "52%", left: "50%" },
    info: {
      target: "精密內部結構",
      motor: "高速抗震馬達",
      speed: "8000 RPM",
      noise: "極低噪運行",
      tech: "自研磨技術",
    },
    detail: {
      title: "毫秒級動力核心",
      desc: "內建升級版毫秒級高速抗震低噪馬達，提供澎湃動力的同時，維持絕佳的穩定性與低噪音，帶來最純粹的理容享受。",
      frame: { top: "40%", left: "35%", width: "30%", height: "25%" },
      lineStart: { x: "65%", y: "65%" },
    },
  },
];

export default function InteractiveExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("full"); // "full" | "detail"
  const currentData = EXPLORER_DATA[currentIndex];

  const nextSlide = () => {
    setViewMode("full");
    setCurrentIndex((prev) => (prev + 1) % EXPLORER_DATA.length);
  };

  const prevSlide = () => {
    setViewMode("full");
    setCurrentIndex(
      (prev) => (prev - 1 + EXPLORER_DATA.length) % EXPLORER_DATA.length,
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0c] overflow-hidden font-sans select-none flex items-center justify-center">
      {/* =========================================================
          1. 背景圖片層 (🌟 已拔除 16:9 限制，現在是真正的全螢幕滿版)
          ========================================================= */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        animate={{
          scale: viewMode === "detail" ? currentData.bgScale : 1,
          opacity: viewMode === "detail" ? 0.7 : 1,
          filter: viewMode === "detail" ? "brightness(0.6)" : "brightness(1)",
          transformOrigin: `${currentData.hotspot.left} ${currentData.hotspot.top}`,
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* 🌟 確保使用 object-cover，這樣圖片才會完美撐滿整個畫面 */}
            <Image
              src={currentData.image}
              alt="Smasmall Product"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* =========================================================
          2. 全視角模式 - 閃爍點 (Hotspot)
          ========================================================= */}
      <AnimatePresence>
        {viewMode === "full" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <button
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group cursor-pointer"
              style={{
                top: currentData.hotspot.top,
                left: currentData.hotspot.left,
              }}
              onClick={() => setViewMode("detail")}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full relative z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="absolute w-8 h-8 bg-white/30 rounded-full animate-ping" />
              <div className="absolute w-10 h-10 border border-white/40 rounded-full group-hover:scale-125 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          3. 細節模式 (對焦框 + 虛線)
          ========================================================= */}
      <AnimatePresence>
        {viewMode === "detail" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            <div
              className="absolute border border-white/40 rounded-xl bg-white/5 backdrop-blur-[2px] transition-all duration-700"
              style={{
                top: currentData.detail.frame.top,
                left: currentData.detail.frame.left,
                width: currentData.detail.frame.width,
                height: currentData.detail.frame.height,
              }}
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1={currentData.detail.lineStart.x}
                y1={currentData.detail.lineStart.y}
                x2="75%"
                y2="70%"
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          4. UI 介面層
          ========================================================= */}
      <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
        <div className="w-full flex justify-end">
          <button
            className="pointer-events-auto px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full transition-colors border border-white/10"
            onClick={() => setViewMode(viewMode === "full" ? "detail" : "full")}
          >
            {viewMode === "full" ? "Dive into Details" : "Back to Full View"}
          </button>
        </div>

        <div className="w-full flex justify-between items-end">
          <motion.div
            animate={{
              opacity: viewMode === "full" ? 1 : 0,
              y: viewMode === "full" ? 0 : 20,
              pointerEvents: viewMode === "full" ? "auto" : "none",
            }}
            transition={{ duration: 0.5 }}
            className="w-[340px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-white text-sm font-bold tracking-widest uppercase">
                Informations
              </h3>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Target
                </p>
                <p className="text-white text-lg">{currentData.info.target}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {Object.entries(currentData.info)
                  .slice(1)
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                        {key}
                      </p>
                      <p className="text-gray-200 text-sm font-medium">
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex border-t border-white/10 bg-black/20">
              <button
                onClick={prevSlide}
                className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
              >
                <ChevronLeft size={16} />{" "}
                <span className="text-sm font-medium">Previous</span>
              </button>
              <button
                onClick={nextSlide}
                className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium">Next</span>{" "}
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {viewMode === "detail" && (
              <motion.div
                initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                }}
                className="pointer-events-auto w-[320px] absolute right-12 bottom-12"
              >
                <div className="relative">
                  <button
                    onClick={() => setViewMode("full")}
                    className="absolute -top-1 -right-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-white text-2xl font-bold mb-2 tracking-wide">
                    {currentData.detail.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {currentData.detail.desc}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
