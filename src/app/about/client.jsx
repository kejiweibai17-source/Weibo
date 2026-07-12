"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import Copy from "@/components/Copy";
// ============================================================================
// 昔馬 SMASMALL 品牌故事資料設定
// ============================================================================
const CORE_STATS = [
  { value: "100%", label: "全合金壓鑄機身" },
  { value: "1 秒", label: "磁吸刀頭快拆" },
  { value: "IPX7", label: "全機防水乾濕兩用" },
  { value: "0.05mm", label: "德國進口精鋼刀網" },
  { value: "12 個月", label: "台灣總代理原廠保固" },
];

const VALUE_PANELS = [
  {
    id: "value-1",
    title: "第一原則",
    subtitle: "工藝根本",
    bgImage: "/images/about/489c8a38-7570-4ca8-a821-38cae1fdbe49.png",
    bgGradient: "from-amber-900/80 to-slate-900/95",
    bullets: [
      "打破傳統塑膠刮鬍刀的廉價感",
      "堅持高溫壓鑄全合金機身",
      "追求沉穩、扎實的握持質感",
    ],
  },
  {
    id: "value-2",
    title: "追求極致",
    subtitle: "刮鬍體驗",
    bgImage: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png",
    bgGradient: "from-blue-950/80 to-slate-900/95",
    bullets: [
      "高速低噪馬達，刮鬍順暢不拉扯",
      "浮動刀網貼合臉部輪廓",
      "自研磨刀網，越用越鋒利",
    ],
  },
  {
    id: "value-3",
    title: "在地服務",
    subtitle: "總代理承諾",
    bgImage: "/images/61e0b64e-1f2c-465c-91e6-34dde2596b4e.png",
    bgGradient: "from-stone-800/80 to-slate-900/95",
    bullets: [
      "威柏科技台灣唯一官方授權總代理",
      "原廠正品與完整售後保固",
      "專屬客服協助選購與維修諮詢",
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
          <span className="flex items-center gap-2 px-4 py-1.5 border border-white/40 rounded-full text-white text-xs font-medium">
            <Globe size={14} />
            <span>繁體中文</span>
          </span>
        </div>

        {/* 左側標題文案 */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 lg:px-16 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            品牌故事
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide text-gray-300 max-w-xl leading-relaxed"
          >
            以全合金工藝與磁吸刀頭，重新定義男士日常理容體驗。
          </motion.p>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: Brand Overview & Stats (參照 截圖 2.57.35)
          ==================================================================== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto bg-[#f5f5f7]">
        {/* 頂部橫向大標題 */}
        <div className="max-w-4xl mb-16">
          <Copy>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              專注全合金電動刮鬍刀的
              <br />
              精品理容品牌
            </h2>
          </Copy>
          <Copy>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed tracking-wide">
              昔馬 SMASMALL 以全合金機身、磁吸刀頭與 IPX7 防水，
              <br />
              為注重質感與效率的男士，打造值得日常使用的理容器材。
            </p>
          </Copy>
        </div>

        {/* 下方左右內容：左側形象大圖，右側數據與敘述 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左側大圖 (光束延伸入空的情境) */}
          <div className="lg:col-span-7 relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[url('/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png')] bg-cover bg-center" />
          </div>

          {/* 右側文字與數據面板 */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <Copy>
              {" "}
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-12">
                昔馬 SMASMALL
                由台灣總代理威柏科技原廠授權引進。我們相信電動刮鬍刀不只是消耗品，更是展現個人品味的日常配件——拋棄廉價塑膠機身，以重機與航空工業啟發的壓鑄合金，帶來更沉穩、更耐用的刮鬍體驗。
              </p>
            </Copy>

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
            <Copy>
              {" "}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                昔馬 SMASMALL
              </h3>
            </Copy>
            <Copy>
              {" "}
              <p className="text-stone-900 text-[16px] max-w-4xl leading-relaxed mb-8">
                專注於全合金機身與磁吸快拆刀頭，結合德國進口精鋼刀網與 Type-C
                快充，讓居家、差旅與商務場合都能輕鬆完成刮鬍。威柏科技於台灣提供原廠授權銷售與售後服務，讓每位用戶買得安心、用得長久。
              </p>
            </Copy>

            <a
              href="/brand"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:underline"
            >
              <span>昔馬全系列產品</span>
              <ArrowRight size={14} />
            </a>
            {/* 品牌巨幅卡片 */}
            <div className="w-full h-[220px] md:h-[320px] bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 rounded-lg mt-8 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
              <div className="text-center z-10 text-white">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em]">
                  昔馬 SMASMALL
                </h2>
                <p className="text-[11px] tracking-[0.4em] opacity-60 mt-3">
                  威柏科技台灣總代理
                </p>
              </div>
            </div>
          </div>

          {/* Part B: 總代理威柏科技營運與現代化大樓 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-gray-100">
            <div className="lg:col-span-5">
              <Copy>
                {" "}
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                  威柏科技有限公司
                </h4>
              </Copy>
              <Copy>
                {" "}
                <p className="text-stone-900 text-[16px] leading-relaxed">
                  威柏科技有限公司為昔馬 SMASMALL
                  台灣唯一官方授權總代理，負責原廠正品引進、通路管理與售後保固。透過線上商城與授權通路，提供產品諮詢、保固登錄與維修協助，讓用戶享有完整的購買與使用支援。
                </p>
              </Copy>
            </div>
            {/* 右側：宏偉的代理商現代化總部/工藝基地大樓 */}
            <div className="lg:col-span-7 h-[300px] md:h-[420px] relative rounded-lg overflow-hidden shadow-sm bg-gray-100">
              <div className="absolute inset-0 bg-[url('/images/2863f91d-4ff8-45c9-9c4c-f9a80a210e2d.png')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: Mission & Vision (參照 截圖 2.57.58)
          ==================================================================== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <Copy>
          {" "}
          <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">
            使命與願景
          </h2>
        </Copy>

        {/* 雙欄等寬卡片排版 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左卡片：Mission */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">使命</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                以全合金工藝與精密刀頭技術，讓每位男士都能享有順暢、舒適且值得信賴的刮鬍體驗。
              </p>
            </div>
          </div>

          {/* 右卡片：Vision */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">願景</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                成為亞洲男士首選的全合金電動刮鬍刀品牌，讓高質感理容走進日常，也走進每一次出門前的自信時刻。
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
          <Copy>
            {" "}
            <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">
              核心價值
            </h2>
          </Copy>

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
                    <p className="text-xs text-white/50 tracking-widest mb-8 border-b border-white/10 pb-4">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">技術創新</h3>
            <p className="text-stone-900 text-[16px] md:text-base leading-relaxed mb-8">
              昔馬電動刮鬍刀結合全合金壓鑄機身、磁吸快拆刀頭、浮動刀網與 IPX7
              防水，並支援 Type-C
              快充。從刀頭材質到機身結構，每項設計都為更順手的刮鬍、清潔與攜帶而優化。
            </p>

            <div className="flex flex-wrap gap-3">
              {["全合金機身", "磁吸刀頭", "IPX7 防水", "Type-C 快充"].map(
                (tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-[#f5f5f7] border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
