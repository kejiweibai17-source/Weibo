"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Ship,
  Store,
  Building2,
  Globe2,
  Sparkles,
} from "lucide-react";
import Copy from "@/components/Copy";

// ============================================================================
// 威柏科技 WEIBO 企業介紹頁 — 資料設定
// ============================================================================

const TIMELINE = [
  {
    year: "2015",
    icon: "logo",
    text: "威柏科技貿易有限公司正式成立",
  },
  {
    year: "2016",
    icon: Store,
    text: "成為國內各大連鎖 3C 賣場通路供應商",
  },
  {
    year: "2017",
    icon: Users,
    text: "線上客服與售後服務部門成立",
  },
  {
    year: "2018",
    icon: Building2,
    text: "專案業務部成立",
  },
  {
    year: "2019",
    icon: Sparkles,
    text: "WEIZ 通路品牌成立",
  },
  {
    year: "2022",
    icon: Ship,
    text: "打造全渠 OMO 整合系統，深度服務全通路顧客",
  },
  {
    year: "2024",
    icon: Globe2,
    text: "打造線上新零售，提供代理品牌全台消費者線上、線下體驗及售後服務",
  },
  {
    year: "2025",
    icon: Store,
    text: "WEIZ 佈局三家中南部旗艦體驗店：高雄、台南、台中",
  },
];

const BRAND_LOGOS = [
  {
    name: "WEILIFE",
    tag: "生活家電",
    image: "/images/weibo/brand-weilife.jpg",
  },
  {
    name: "smasmall 昔馬",
    tag: "個人理容",
    image: "/images/accessories/星座系列電動刮鬍刀禮盒/01.jpg",
  },
  {
    name: "FRAMULA 芬樂",
    tag: "香氛生活",
    image: "/images/weibo/brand-framula.jpg",
  },
  {
    name: "WiWU",
    tag: "3C 配件",
    image: "/images/weibo/brand-wiwu.jpg",
  },
  {
    name: "ACEFAST",
    tag: "潮流耳機",
    image: "/images/weibo/brand-acefast.jpg",
  },
];

const CORE_BUSINESS = [
  {
    no: "01",
    title: "品牌代理",
    desc: "總代理各國原創品牌，原廠授權引進與通路管理。",
    Icon: Building2,
    image: "/images/weibo/core-agency.jpg",
  },
  {
    no: "02",
    title: "國際外銷",
    desc: "從台灣零售延伸至香港、新加坡等海外市場。",
    Icon: Ship,
    image: "/images/weibo/core-export.jpg",
  },
  {
    no: "03",
    title: "台灣全通路推廣",
    desc: "台灣通路、百貨櫃位、連鎖 3C 賣場與電商平台，完整佈局線上線下全通路整合。",
    Icon: Store,
    image: "/images/weibo/core-retail.jpg",
  },
  {
    no: "04",
    title: "企業採購",
    desc: "提供企業專案與大宗採購的選品與客製服務。",
    Icon: Globe2,
    image: "/images/weibo/core-enterprise.jpg",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function WeiboClient() {
  return (
    <div className="w-full bg-white text-slate-900 font-sans antialiased overflow-hidden">
      <HeroSection />
      <IntroSection />
      <ImportExportSection />
      <TimelineSection />
      <CoreBusinessSection />
    </div>
  );
}

/* ============================================================================
   SECTION 1 — Hero：網羅全球創意與設計的品牌，提供有質感的生活
   ============================================================================ */
function HeroSection() {
  return (
    <section className="relative w-full h-[78vh] min-h-[520px] bg-[#05070d] overflow-hidden flex items-end">
      {/* 科技辦公桌情境背景照片 */}
      <div className="absolute inset-0">
        <Image
          src="/images/weibo/hero-desk.jpg"
          alt="網羅全球創意與設計的品牌"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#05070d]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(56,132,255,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/55 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 lg:px-16 pb-16 md:pb-20">
        <Reveal>
          <span className="inline-block text-[11px] md:text-xs tracking-[0.35em] text-blue-300/80 font-medium mb-6">
            WEIBO TECHNOLOGY
          </span>
        </Reveal>
        <Copy>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white">
            網羅全球創意
            <br />
            與設計的品牌
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              提供有質感的生活
            </span>
          </h1>
        </Copy>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 2 — NEW BEGINNINGS：品牌介紹 + 全球網絡視覺
   ============================================================================ */
function IntroSection() {
  return (
    <section className="relative w-full bg-[#f5f6f8] py-24 md:py-32 overflow-hidden">
      {/* 裝飾大字：背景層 */}
      <span className="pointer-events-none select-none absolute -top-2 right-4 md:right-10 text-[13vw] md:text-[7vw] font-extrabold text-slate-300/50 tracking-tight whitespace-nowrap">
        NEW BEGINNINGS
      </span>
      <span className="pointer-events-none select-none absolute bottom-2 left-4 md:left-10 text-[11vw] md:text-[6vw] font-extrabold text-slate-300/50 tracking-tight whitespace-nowrap">
        HEARTFELT CONNECTIONS
      </span>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* 左：Logo + 說明文字 */}
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/images/logo/weibo-logo.png"
                alt="WEIBO 威柏科技"
                width={64}
                height={64}
                className="w-14 h-14 md:w-16 md:h-16 object-contain"
              />
              <div>
                <p className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  WEIBO
                </p>
                <p className="text-sm md:text-base text-slate-500 font-medium tracking-wide">
                  威柏科技
                </p>
              </div>
            </div>
            <p className="text-[15px] md:text-base text-slate-600 leading-relaxed max-w-xl">
              威柏科技貿易有限公司成立於 2015
              年，立足全球視野、深耕台灣市場，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者，我們堅信科技產品經過我們的淬煉，能精準有感的帶給消費者更好的生活體驗。
            </p>
          </Reveal>

          {/* 右：全球網絡視覺卡片 */}
          <Reveal delay={0.12}>
            <div className="relative rounded-2xl bg-[#0a1330] p-3 md:p-4 shadow-xl">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0a1330]">
                <GlobalNetworkArt />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 抽象全球連線網絡視覺（取代實拍世界地圖照片） */
function GlobalNetworkArt() {
  const nodes = [
    { x: 22, y: 38 },
    { x: 48, y: 22 },
    { x: 72, y: 34 },
    { x: 60, y: 60 },
    { x: 34, y: 66 },
    { x: 84, y: 58 },
  ];
  return (
    <svg
      viewBox="0 0 100 62"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="62" fill="url(#glow)" opacity="0.5" />
      {/* 經緯線構成的簡化地球 */}
      <g stroke="#2f6fb8" strokeWidth="0.25" fill="none" opacity="0.6">
        <ellipse cx="50" cy="31" rx="42" ry="20" />
        <ellipse cx="50" cy="31" rx="42" ry="10" />
        <ellipse cx="50" cy="31" rx="24" ry="20" />
        <line x1="8" y1="31" x2="92" y2="31" />
        <line x1="50" y1="11" x2="50" y2="51" />
      </g>
      {/* 連線 */}
      <g stroke="#38bdf8" strokeWidth="0.35" opacity="0.7">
        {nodes.map((n, i) =>
          nodes.slice(i + 1).map((m, j) => (
            <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} />
          ))
        )}
      </g>
      {/* 節點光點 */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="2.6" fill="#38bdf8" opacity="0.18" />
          <circle cx={n.x} cy={n.y} r="1" fill="#7dd3fc" />
        </g>
      ))}
    </svg>
  );
}

/* ============================================================================
   SECTION 3 — 從進出口到總代理 + PHILOSOPHY + 品牌矩陣
   ============================================================================ */
function ImportExportSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* 上半：藍色情境區塊 */}
      <div className="relative bg-gradient-to-br from-[#1c4fd8] via-[#1740b8] to-[#122f8c] pt-20 md:pt-28 pb-28 md:pb-36">
        {/* 側邊直排裝飾字 */}
        <span className="hidden md:block absolute top-1/3 left-3 [writing-mode:vertical-rl] text-white/25 text-xs tracking-[0.5em] font-bold">
          IMPORT
        </span>
        <span className="hidden md:block absolute top-1/3 right-3 [writing-mode:vertical-rl] text-white/25 text-xs tracking-[0.5em] font-bold">
          EXPORT
        </span>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* 左：情境圖 */}
            <Reveal>
              <div className="relative w-full h-[220px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/weibo/team-collab.jpg"
                  alt="威柏科技團隊協作"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </Reveal>

            {/* 右：標題與說明 */}
            <Reveal delay={0.1}>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-6">
                從進出口到總代理
              </h2>
              <p className="text-white/85 text-[14px] md:text-[15px] leading-relaxed mb-4">
                從主要經營進口業務，一路發展到台灣代理各國品牌，至今旗下囊括眾多來自美國、日本、中國等地的原創品牌。產品囊括生活家電、消費電子、手機周邊、筆電配件、車用百貨等等——
              </p>
              <p className="text-white/85 text-[14px] md:text-[15px] leading-relaxed">
                銷售市場從台灣零售店、百貨櫃位，延伸至新加坡、香港等海外市場，打造完整通路服務，讓好產品被更多消費者看見。
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 下半：白色區塊，PHILOSOPHY 卡片疊在接縫上 */}
      <div className="relative bg-white pb-20 md:pb-28">
        <Reveal delay={0.15}>
          <div className="relative max-w-3xl mx-auto px-6 -mt-20 md:-mt-28">
            {/* 虛線裝飾框（偏移於卡片左上方） */}
            <div className="hidden sm:block absolute -top-3 -left-3 right-3 bottom-[-12px] border-2 border-dashed border-indigo-400/70 rounded-2xl" />
            <div className="absolute -top-4 -left-4 w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rotate-45 rounded-sm shadow-lg z-10" />
            <div className="relative bg-white rounded-2xl shadow-2xl px-8 md:px-14 py-10 md:py-12 text-center">
              <span className="text-[11px] tracking-[0.3em] text-slate-400 font-semibold">
                PHILOSOPHY
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3 mb-5">
                科技來自於人性
              </h3>
              <p className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed">
                威柏科技產品從無到有，經過研發、設計、溝通、推廣、銷售、體驗、服務，以最嚴格的標準要求每一款產品。消費者的每一個需求，都是我們開發新產品的動力；每一筆消費，都是對我們的信任。
              </p>
            </div>
          </div>
        </Reveal>

        {/* 品牌矩陣 */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-16 mt-14 md:mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {BRAND_LOGOS.map((brand, idx) => (
              <Reveal key={brand.name} delay={0.05 * idx}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="py-3 flex flex-col items-center justify-center text-center">
                    <span className="text-sm md:text-base font-extrabold tracking-tight text-slate-800">
                      {brand.name}
                    </span>
                    <span className="mt-0.5 text-[10px] text-slate-400 tracking-wide">
                      {brand.tag}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 4 — 歷史沿革 Timeline
   ============================================================================ */
function TimelineSection() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-16 md:mb-20">
            歷史沿革
          </h2>
        </Reveal>

        <div className="relative">
          {/* 中央時間軸線（桌機） */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-blue-200 -translate-x-1/2" />
          {/* 左側時間軸線（手機） */}
          <div className="md:hidden absolute left-[7px] top-2 bottom-2 w-px bg-blue-200" />

          <div className="space-y-10 md:space-y-4">
            {TIMELINE.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              const IconComp = item.icon === "logo" ? null : item.icon;
              return (
                <Reveal key={item.year} delay={0.04 * idx}>
                  <div className="relative md:grid md:grid-cols-2 md:gap-10 md:items-center">
                    {/* 手機時間軸節點 */}
                    <div className="md:hidden absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />

                    {/* 桌機中央節點 */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white z-10" />

                    {isLeft ? (
                      <>
                        <div className="pl-8 md:pl-0 md:text-right md:pr-14">
                          <div className="flex md:justify-end items-center gap-3 mb-2">
                            <div className="hidden md:flex w-9 h-9 rounded-full bg-blue-50 items-center justify-center order-2">
                              {IconComp ? (
                                <IconComp className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Image
                                  src="/images/logo/weibo-logo.png"
                                  alt="WEIBO"
                                  width={20}
                                  height={20}
                                  className="w-[18px] h-[18px] object-contain"
                                />
                              )}
                            </div>
                            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight order-1">
                              {item.year}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <div className="pl-8 md:pl-14">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="hidden md:flex w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
                              {IconComp ? (
                                <IconComp className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Image
                                  src="/images/logo/weibo-logo.png"
                                  alt="WEIBO"
                                  width={20}
                                  height={20}
                                  className="w-[18px] h-[18px] object-contain"
                                />
                              )}
                            </div>
                            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight">
                              {item.year}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 5 — 核心業務 + CTA
   ============================================================================ */
function CoreBusinessSection() {
  return (
    <section className="relative w-full bg-[#f5f6f8] py-24 md:py-32 overflow-hidden">
      {/* 左下角裝飾三角形 */}
      <div
        className="hidden md:block absolute left-6 bottom-10 w-0 h-0 border-t-[22px] border-b-[22px] border-l-[36px] border-t-transparent border-b-transparent border-l-blue-600/80"
        aria-hidden
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-14">
            核心業務
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {CORE_BUSINESS.map(({ no, title, desc, image }, idx) => (
            <Reveal key={no} delay={0.06 * idx}>
              <div className="rounded-xl overflow-hidden bg-white shadow-sm h-full flex flex-col">
                <div className="relative h-[150px]">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/45" />
                  <span className="absolute top-4 left-5 text-3xl font-extrabold text-blue-300 tracking-tight drop-shadow">
                    {no}
                  </span>
                  <h3 className="absolute bottom-4 left-5 right-5 text-lg font-bold text-white drop-shadow">
                    {title}
                  </h3>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-500 text-[13px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="flex justify-center lg:justify-end">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 transition-colors text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md"
            >
              立即聯繫
              <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
