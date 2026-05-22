"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ============================================================
// FadeUpItem：包住任意子元素，進入視窗時自動 fade + slide up
// 用法：<FadeUpItem delay={0.1}>...</FadeUpItem>
// ============================================================
export function FadeUpItem({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// TextParallaxSection：背景 sticky + 內容往上捲入
//
// Props:
//   imgUrl      — 背景圖路徑
//   subheading  — 小標題（在背景圖上顯示）
//   heading     — 大標題（在背景圖上顯示）
//   children    — 往上滾動覆蓋背景的內容區塊
//   overlayColor— 內容區塊背景色，預設 'bg-black' 讓內容完整蓋過底圖
// ============================================================
export default function TextParallaxSection({
  imgUrl,
  subheading,
  heading,
  children,
  overlayColor = "bg-black",
}) {
  const containerRef = useRef(null);

  /**
   * ✅ useScroll 與 containerRef 定義在同一元件
   *    子元件只接收計算後的 MotionValue，不再有 ref 未 hydrate 的問題
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 背景圖：微縮放 + 微上移（視差感）
  const rawScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const rawBgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scale = useSpring(rawScale, { damping: 30, stiffness: 120 });
  const bgY = useSpring(rawBgY, { damping: 30, stiffness: 120 });

  // 標題文字：從下往上浮現，中段最亮，快滾完淡出
  const rawTextY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rawTextOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.35, 0.65, 0.88],
    [0, 1, 1, 0],
  );
  const textY = useSpring(rawTextY, { damping: 30, stiffness: 120 });
  const textOpacity = useSpring(rawTextOpacity, { damping: 30, stiffness: 120 });

  return (
    <div ref={containerRef} className="relative">
      {/* ── Sticky 背景層 ── */}
      <div className="sticky top-0 h-screen z-0 overflow-hidden">
        {/* 背景圖視差 */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgUrl})`, scale, y: bgY }}
        />
        {/* 暗色遮罩，讓文字更易讀 */}
        <div className="absolute inset-0 bg-black/40" />

        {/* 標題 Overlay */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 pointer-events-none"
        >
          <p className="mb-3 text-center text-lg md:text-2xl font-light tracking-widest uppercase opacity-80 drop-shadow-md">
            {subheading}
          </p>
          <p className="text-center text-4xl md:text-6xl font-bold drop-shadow-lg leading-tight">
            {heading}
          </p>
        </motion.div>
      </div>

      {/* ── 往上滾動的內容層 ──
            -mt-[55vh]：讓內容從畫面底部約 45% 處開始，往上滾動覆蓋 sticky
            z-10：確保內容在 sticky 圖層上方
      */}
      <div className={`relative z-10 -mt-[55vh] ${overlayColor}`}>
        {children}
      </div>
    </div>
  );
}
