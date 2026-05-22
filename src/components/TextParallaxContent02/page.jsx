"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Info, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 🛒 昔馬 SMASMALL 文案資料配置
// ============================================================================
const INTRO_DATA = {
  label: "Original Craftsmanship",
  title: "獨創全合金壓鑄機身",
  description:
    "拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落，完美展現復古未來主義的獨特品味。",
  image: "/images/index/banner-01.png",
};

const ACCORDION_DATA = [
  {
    id: "feature-1",
    label: "Magnetic design",
    title: "業界首創磁吸快拆刀頭",
    description:
      "搭載高精密磁吸結構，一秒即可無縫貼合與拆卸。不僅大幅縮短日常清理時間，更徹底解決傳統機械卡榫易斷裂、易磨損的問題。",
  },
  {
    id: "feature-2",
    label: "Premium materials",
    title: "荷蘭進口精鋼刀片",
    description:
      "嚴選頂規荷蘭進口精鋼，搭配雙環超薄刀網與自銳研磨技術。刀片越用越鋒利，精準捕捉各種方向的鬍鬚，享受極致滑順的剃鬚體驗。",
  },
  {
    id: "feature-3",
    label: "Waterproof capability",
    title: "IPX7 頂級全機防水",
    description:
      "支援全機身水洗與乾濕兩用。無論是搭配刮鬍泡的深層淨容，或是淋浴時的快速剃鬚，都能輕鬆應對，用水一沖即淨，衛生無死角。",
  },
];

export default function ElegantScrollSection() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState("feature-1");

  useGSAP(
    () => {
      // 1. 釘死背景
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: bgRef.current,
        pinSpacing: false,
      });

      // 2. 背景視差 (scrub: 2 創造極大的滾動延遲感)
      gsap.to(".slider-bg", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      // ==========================================
      // 🌟 動畫順序 1：開場文字 Fade-up 進場
      // ==========================================
      gsap.fromTo(
        ".intro-item",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          stagger: 0.2,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".intro-container",
            start: "top 75%", // 當區塊頂部到達畫面 75% 時進場
            toggleActions: "play none none reverse",
          },
        },
      );

      // ==========================================
      // 🌟 動畫順序 2：開場文字隨滾動「往上飄移淡出」
      // ==========================================
      gsap.to(".intro-content", {
        opacity: 0,
        y: -150, // 往上偏移
        scrollTrigger: {
          trigger: ".intro-container",
          start: "top 20%", // 當滾動到接近頂部時開始淡出
          end: "top -20%", // 滾出畫面一點點時完全消失
          scrub: 1, // 綁定滾輪，讓退場有順滑的跟隨感
        },
      });

      // ==========================================
      // 🌟 動畫順序 3：手風琴面板 Fade-up 接著出場
      // ==========================================
      gsap.fromTo(
        ".accordion-wrapper",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".accordion-container",
            start: "top 80%", // 等待上面的文字完全淡出後，這裡才剛好觸發進場
            toggleActions: "play none none reverse",
          },
        },
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#050507]">
      {/* =========================================
          🌟 1. 固定的背景層
          ========================================= */}
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-screen overflow-hidden z-0"
      >
        <img
          src={INTRO_DATA.image}
          alt="Background"
          className="slider-bg w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none" />
      </div>

      {/* =========================================
          🌟 2. 正常滾動的內容層
          ========================================= */}
      <div className="relative z-10 w-full text-white pt-[15vh] pb-[30vh]">
        {/* --- 區塊 A：開場標題與介紹 --- */}
        <div className="intro-container min-h-screen flex items-center px-[6%] md:px-[10%]">
          {/* 🌟 增加一層 intro-content 專門用來控制退場動畫 */}
          <div className="intro-content w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-24">
            <div className="intro-item w-full lg:w-1/2">
              <div className="flex items-center gap-3 text-gray-400 mb-6">
                <Info size={18} />
                <span className="text-sm font-medium tracking-wider uppercase">
                  {INTRO_DATA.label}
                </span>
              </div>
              <h1 className="text-2xl md:text-5xl   font-normal tracking-wide leading-tight drop-shadow-lg">
                {INTRO_DATA.title}
              </h1>
            </div>

            <div className="intro-item w-full lg:w-[40%]">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                {INTRO_DATA.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- 區塊 B：左側手風琴選單 (毛玻璃面板) --- */}
        {/* 🌟 修改 trigger 用的 class 名稱以完美銜接動畫 */}
        <div className="accordion-container min-h-screen flex items-start px-[6%] md:px-[10%] pt-[10vh]">
          <div className="accordion-wrapper w-full md:w-[60%] lg:w-[35%] flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            {ACCORDION_DATA.map((item, index) => {
              const isOpen = openAccordion === item.id;

              return (
                <div
                  key={item.id}
                  className="border-b border-white/10 last:border-none"
                >
                  <button
                    onClick={() => setOpenAccordion(isOpen ? "" : item.id)}
                    className="w-full py-8 flex flex-col gap-4 text-left group"
                  >
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                        {item.label}
                      </span>
                      <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors duration-300">
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-500 ease-in-out ${
                            isOpen
                              ? "rotate-180 text-white"
                              : "group-hover:text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-lg md:text-xl font-medium tracking-wide transition-colors duration-300 ${
                        isOpen
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-8"
                        : "grid-rows-[0fr] opacity-0 pb-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-300 leading-8 text-[14px] md:text-[15px] font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
