"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";

// ============================================================================
// 昔馬 SMASMALL 品牌故事資料設定
// ============================================================================
const CORE_STATS = [
  { value: "100%", label: "全合金壓鑄鑄造工藝" },
  { value: "1-Sec", label: "首創磁吸刀頭快拆技術" },
  { value: "IPX7", label: "全機頂級防水乾濕兩用" },
  { value: "0.05mm", label: "荷蘭進口超薄自銳精鋼刀網" },
  { value: "Top 1", label: "復古未來主義理容潮流指標" },
];

const VALUE_PANELS = [
  {
    id: "value-1",
    title: "第一原則",
    subtitle: "First Principle",
    bgImage: "/images/about/489c8a38-7570-4ca8-a821-38cae1fdbe49.png", // 👈 新增背景圖片欄位
    bgGradient: "from-amber-900/80 to-slate-900/95", // 稍微調高透明度讓背景圖透出來
    bullets: [
      "打破傳統塑膠理容工具的廉價感",
      "堅持高溫壓鑄工藝的硬派美學",
      "追求極致扎實、沉穩的冰冷握感",
    ],
  },
  {
    id: "value-2",
    title: "追求極致",
    subtitle: "Seek Ultimate",
    bgImage: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png", // 👈 新增背景圖片欄位
    bgGradient: "from-blue-950/80 to-slate-900/95",
    bullets: [
      "毫秒級的高速抗震低噪馬達",
      "精確貼合面部輪廓的彈性浮動",
      "挑戰刀片越用越鋒利的自研磨技術",
    ],
  },
  {
    id: "value-3",
    title: "共創卓越",
    subtitle: "Grow Together",
    bgImage: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png", // 👈 新增背景圖片欄位
    bgGradient: "from-stone-800/80 to-slate-900/95",
    bullets: [
      "威柏科技全權總代理品質承諾",
      "深耕台灣高端男士精緻理容市場",
      "建立最完善的一年原廠安心保固",
    ],
  },
];
export default function SmasmallStory() {
  const [hoveredPanel, setHoveredPanel] = useState(null);

  return (
    <div className="w-full bg-[#f5f5f7] text-slate-900 font-sans selection:bg-orange-200 antialiased overflow-hidden">
      {/* ====================================================================
          SECTION 1: Hero Section (參照 截圖 2.57.40)
          ==================================================================== */}
      <section className="relative w-full h-[85vh] min-h-[600px] bg-black overflow-hidden flex items-center">
        {/* 背景大圖：昔馬刮鬍刀極具機械感的暗黑背景高清圖 */}
        <div
          className="absolute inset-0 bg-[url('/images/index/banner-01.png')] bg-cover bg-center bg-no-repeat opacity-70"
          style={{ backgroundPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* 右上方語言選擇鈕 */}
        <div className="absolute top-6 right-6 md:right-12 z-20">
          <button className="flex items-center gap-2 px-4 py-1.5 border border-white/40 rounded-full text-white text-xs font-medium hover:bg-white/10 transition-colors">
            <Globe size={14} />
            <span>English</span>
          </button>
        </div>

        {/* 左側標題文案 */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 lg:px-16 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide text-gray-300 max-w-xl leading-relaxed"
          >
            Ignite Possibilities Through Ultimate Innovation. <br />
            以極致硬派工藝，重新定義品味男士的日常剃鬚革命。
          </motion.p>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: Brand Overview & Stats (參照 截圖 2.57.35)
          ==================================================================== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto bg-[#f5f5f7]">
        {/* 頂部橫向大標題 */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            A Global Premium Shaver Brand <br />
            Driven by Ultimate Craftsmanship
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed tracking-wide">
            To build a playground where makers inspire makers,
            <br />
            To create brands that the world desires.
          </p>
        </div>

        {/* 下方左右內容：左側形象大圖，右側數據與敘述 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左側大圖 (光束延伸入空的情境) */}
          <div className="lg:col-span-7 relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[url('/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png')] bg-cover bg-center" />
          </div>

          {/* 右側文字與數據面板 */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-12">
              SMASMALL
              昔馬由台灣總代理「威柏科技」原廠授權引進。我們堅信理容工具不只是消耗品，更是彰顯個人品味的桌面藝術。拋棄廉價的塑膠，將重機與航空線條融入壓鑄合金，為亞洲男士帶來極致有感的科技理容美學。
            </p>

            {/* 核心數據網格佈局 */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-8">
              {CORE_STATS.map((stat, idx) => (
                <div key={idx} className={idx === 4 ? "col-span-2" : ""}>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: Brand Banner & Headquarters (參照 截圖 2.57.47 & 2.57.54)
          ==================================================================== */}
      <section className="w-full bg-white py-24 border-t border-b border-gray-200/60">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-16">
          {/* Part A: 昔馬品牌旗艦視覺牆 */}
          <div className="mb-20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              SMASMALL 昔馬
            </h3>
            <p className="text-gray-600 text-sm max-w-4xl leading-relaxed mb-8">
              專注於全合金工藝與高端磁吸機構的研發，結合頂級自銳技術刀片，讓每一次剃鬚都成為一種享受。威柏科技與昔馬品牌深度戰略合作，於台灣設立專屬售後體系，引領潮流男士的生活新風尚。
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:underline"
            >
              <span>Click here to learn more.</span>
              <ArrowRight size={14} />
            </a>

            {/* 完美還原：對稱分裂冷藍色光芒品牌巨幅卡片 */}
            <div className="w-full h-[220px] md:h-[320px] bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 rounded-lg mt-8 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
              <div className="text-center z-10 text-white">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em] uppercase">
                  SMASMALL
                </h2>
                <p className="text-[11px] tracking-[0.4em] opacity-60 mt-3 uppercase">
                  Weibo Technology
                </p>
              </div>
            </div>
          </div>

          {/* Part B: 總代理威柏科技營運與現代化大樓 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-gray-100">
            <div className="lg:col-span-5">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                威柏科技有限公司
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                台灣唯一官方授權總代理——威柏科技有限公司（Weibo
                Technology），運營核心與現代化倉儲配送基地布署於台灣核心樞紐，配備超過多個專業售後服務據點與線上即時客服團隊，全面保障每位昔馬用戶的頂級售後尊榮權益。
              </p>
            </div>
            {/* 右側：宏偉的代理商現代化總部/工藝基地大樓 */}
            <div className="lg:col-span-7 h-[300px] md:h-[420px] relative rounded-lg overflow-hidden shadow-sm bg-gray-100">
              <div className="absolute inset-0 bg-[url('/images/002.png')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: Mission & Vision (參照 截圖 2.57.58)
          ==================================================================== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">
          Our Mission and Vision
        </h2>

        {/* 雙欄等寬卡片排版 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左卡片：Mission */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Mission</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                Ignite possibilities through ultimate innovation. <br />
                以復古未來主義理容科技，重塑現代男士的精緻生活品味。
              </p>
            </div>
          </div>

          {/* 右卡片：Vision */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Vision</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                To build a playground where makers inspire makers, to create
                brands that the world desires. <br />
                成為全球最具藝術收藏價值與極致剃鬚體驗的奢華理容精品品牌。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: Our Values & Innovations (參照 影片 2.58.03)
          ==================================================================== */}
      <section className="w-full py-24 bg-white border-t border-gray-200">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">
            Our Values
          </h2>

          {/* 🌟 核心組件：完全重現影片中滑鼠 Hover 寬度流暢拉伸與變更的 Flex 橫切卡片 */}
          <div className="flex flex-col lg:flex-row w-full gap-4 h-auto lg:h-[420px] overflow-hidden mb-20">
            {VALUE_PANELS.map((panel, idx) => {
              // 如果目前有卡片被 hover，被 hover 的卡片變寬 (flex-[2.5])，其餘卡片縮小
              const isHovered = hoveredPanel === idx;
              const isAnyHovered = hoveredPanel !== null;

              // 初始狀態大家都是 flex-1，若有卡片被 hover 則動態調整權重
              let flexValue = "flex-1";
              if (isAnyHovered) {
                flexValue = isHovered ? "flex-[2.5]" : "flex-[0.7]";
              }

              return (
                <div
                  key={panel.id}
                  onMouseEnter={() => setHoveredPanel(idx)}
                  onMouseLeave={() => setHoveredPanel(null)}
                  // 🌟 1. 注意這裡拿掉了 bg-gradient-to-br，並加入了 group 類別來觸發圖片動畫
                  className={`
          relative  overflow-hidden p-8 md:p-10 flex flex-col justify-end min-h-[300px] lg:min-h-full
          text-white transition-all duration-500 ease-in-out cursor-pointer shadow-sm group ${flexValue}
        `}
                >
                  {/* 🌟 2. 這是新加入的底層：背景圖片 (帶有緩慢放大特效) */}
                  {panel.bgImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${panel.bgImage})` }}
                    />
                  )}

                  {/* 🌟 3. 這是新加入的中層：漸層顏色遮罩 (覆蓋在圖片上，確保文字清楚) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${panel.bgGradient} opacity-90 transition-opacity duration-500 group-hover:opacity-80`}
                  />

                  {/* 背景裝飾微光線條 (維持原樣) */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

                  <div className="relative z-10 w-full">
                    {/* 大標題 */}
                    <h3 className="text-2xl md:text-3xl font-bold tracking-wide mb-1">
                      {panel.title}
                    </h3>
                    <p className="text-xs text-white/40 tracking-widest font-mono uppercase mb-8 border-b border-white/10 pb-4">
                      {panel.subtitle}
                    </p>

                    {/* 條列式規則 */}
                    <ul className="space-y-3 text-[13px] md:text-[14px] text-white/80 font-light pl-4 list-disc">
                      {panel.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部：技術創新介紹與標籤列 */}
          <div className="max-w-4xl border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Innovations
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              我們的設計研發團隊始終站在精密製造與美學前沿。結合重機具的機械美學與高效率的電子結構，我們專注於打造超越常規、讓全球消費者感到驚艷的精緻硬件工具。
            </p>

            {/* 精緻科技標籤 (Tags) */}
            <div className="flex flex-wrap gap-3">
              {[
                "Retro-Futurism Design",
                "Magnetic Mechanics",
                "Groundbreaking Efficiency",
              ].map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="bg-[#f5f5f7] border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full font-mono shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
