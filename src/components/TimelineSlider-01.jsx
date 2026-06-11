"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

// ============================================================================
// 昔馬 SMASMALL 品牌歷史資料 (已完整更新 14 筆圖片文案)
// ============================================================================
const TIMELINE_DATA = [
  {
    year: "01",
    title: "禮盒內容 全面武裝",
    desc: "14項豪華配件一次擁有：包含專屬禮品袋、精美包裝盒、S1電動刮鬍刀、M1手動鼻毛器、D1昔馬蛋收納艙、手動刮鬍刀及各項精美周邊，送禮自用兩相宜。",
    img: "/images/accessories/捍衛者/文宣/14.jpg",
  },
  {
    year: "02",
    title: "硬派外觀 荒漠配色",
    desc: "專為潮流男仕打造的精品禮盒，大膽採用荒漠橘配色，不僅是實用的理容工具，更能展現使用者的獨特態度與絕佳品味。",
    img: "/images/accessories/捍衛者/文宣/13.jpg",
  },
  {
    year: "03",
    title: "廢土美學 硬派質感",
    desc: "獨特的硬核破損設計，大膽採用荒漠橘色的廢土美學，完美詮釋了機械戰損的未來美感，讓每一把刮鬍刀都獨具個性。",
    img: "/images/accessories/捍衛者/文宣/9.jpg",
  },
  {
    year: "04",
    title: "為捍衛者而生",
    desc: "一套征服全臉的修容武裝！完美整合 S1 電動刮鬍刀、M1 鼻毛修剪器與 D1 昔馬蛋收納艙，提供最高規格的全方位理容體驗。",
    img: "/images/accessories/捍衛者/文宣/3.jpg",
  },
  {
    year: "05",
    title: "精緻強悍 高能之選",
    desc: "高達9100轉的強勁動力，穩定高轉速讓刮鬍順暢不拉扯。搭載高能量密度鋰電池，1小時快充即可續航60分鐘（約20天免充電），並支援3分鐘閃充。",
    img: "/images/accessories/捍衛者/文宣/11.jpg",
  },
  {
    year: "06",
    title: "靈魂之蓋 磁吸保護",
    desc: "專屬磁吸保護蓋細節到位，全方位保護刀頭潔淨衛生，防塵防污染。搭配推動式開關設計，能有效防止外出攜帶時的誤觸。",
    img: "/images/accessories/捍衛者/文宣/5.jpg",
  },
  {
    year: "07",
    title: "經典延續 手動情懷",
    desc: "手動刮鬍刀採用合金壓鑄，帶來絕佳手感。握感充實、操作順手，感受手動刮鬍的真實掌控力，且刀頭可靈活更換，便利衛生。",
    img: "/images/accessories/捍衛者/文宣/8.jpg",
  },
  {
    year: "08",
    title: "精緻手感 解壓潮玩",
    desc: "M1鼻毛修剪器採合金壓鑄與手工打磨。純手動機械按壓，360°舒適修剪不傷鼻腔，並附有專屬保護蓋。小巧精緻，是您的隨身潮流配件。",
    img: "/images/accessories/捍衛者/文宣/6.jpg",
  },
  {
    year: "09",
    title: "核心產品規格",
    desc: "S1電動刮鬍刀具備IPX7防水等級，支援乾濕雙剃；M1手動鼻毛修剪器則支援全機水洗。兩者皆享有12個月機身保固，品質有保障。",
    img: "/images/accessories/捍衛者/文宣/15.jpg",
  },
  {
    year: "10",
    title: "配件與手動刀規格",
    desc: "D1BOX昔馬蛋收納艙精準尺寸易於收納；搭配專屬手動刮鬍刀（支援水洗與濕剃），重量適中，隨時隨地維持俐落外表。",
    img: "/images/accessories/捍衛者/文宣/16.jpg",
  },
  {
    year: "11",
    title: "獨特印記 捍衛者",
    desc: "合金壓鑄機身經由手工精心打磨，每處劃痕都獨一無二。獨特的外殼設計巧妙融鑄了未來的印記與時間的痕跡，展現專屬魅力。",
    img: "/images/accessories/捍衛者/文宣/1.jpg",
  },
  {
    year: "12",
    title: "淬鍊金屬 匠心獨具",
    desc: "經歷多道工序嚴格打造，手工打磨的每一道戰損痕跡都是力量的印記；荒漠橘配色，極致展現硬核機械的本色與態度。",
    img: "/images/accessories/捍衛者/文宣/4.jpg",
  },
  {
    year: "13",
    title: "榮獲多項國際設計大獎",
    desc: "集結修剪全配、精緻便攜、性能強勁等六大優勢，並榮獲日本 G-MARK、亞洲 DFA、當代好設計及 CDA 中華設計獎等多重肯定。",
    img: "/images/accessories/捍衛者/文宣/2.jpg",
  },
  {
    year: "14",
    title: "極致修容 終極套裝",
    desc: "集結頂級工藝與創新設計，這不僅是一套理容工具，更是陪伴您征服日常挑戰、展現個人獨特品味的完美武裝。",
    img: "/images/accessories/捍衛者/文宣/3.jpg",
  },
];

export default function TimelineSlider() {
  // 🌟 開啟 dragFree 模式，模擬真實物理阻尼滑動感
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <section className="w-full bg-[#f4f4f4] py-24 relative overflow-hidden font-sans">
      {/* 標題區塊 */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mb-16">
        <Copy>
          {" "}
          <span className="text-[11px] font-bold tracking-widest text-[#EA580C] uppercase mb-4">
            Features
          </span>
        </Copy>
        <Copy>
          {" "}
          <h2 className="text-3xl md:text-4xl font-light text-black tracking-wide">
            昔馬電動刮鬍刀-捍衛者<span className="font-bold">產品特色</span>
          </h2>
        </Copy>
      </div>

      {/* 拖曳輪播區塊 */}
      <div
        className="embla w-full cursor-grab active:cursor-grabbing overflow-hidden"
        ref={emblaRef}
      >
        {/* Container 必須為 relative，讓滿版的 Ruler 能跟隨內部一起滑動 */}
        <div className="embla__container flex relative">
          {/* ==================================================
              🌟 滿版無縫時間軸 (Timeline Ruler) 
              這層獨立的 Absolute 區塊會跟著 Slides 一起滑動，
              使用 CSS Gradient 繪製出無限延伸、絕對不會斷層的刻度。
              ================================================== */}
          <div className="absolute bottom-[30px] left-0 w-full h-[30px] z-0 pointer-events-none">
            {/* 上方：連續的灰色水平實線 */}
            <div className="absolute top-0 w-full h-[1px] bg-[#d2d2d2]"></div>

            {/* 下方：精準間距的虛線刻度 (Ticks) */}
            <div
              className="absolute bottom-0 w-full h-[10px] opacity-[0.35]"
              style={{
                // 每 24px 重複繪製一條 1.5px 寬的黑線，形成完美的刻度尺
                backgroundImage:
                  "repeating-linear-gradient(to right, #000 0, #000 1.5px, transparent 1.5px, transparent 24px)",
              }}
            ></div>
          </div>

          {/* 渲染各年份卡片 */}
          {TIMELINE_DATA.map((item, index) => (
            <div
              key={index}
              className="embla__slide relative flex-[0_0_85vw] md:flex-[0_0_420px] lg:flex-[0_0_480px] min-w-0 pb-[100px]"
            >
              {/* 1. 垂直參考線 (從頂部連接到底部的主線) */}
              <div className="absolute left-[30px] top-[14px] bottom-[60px] w-[1px] bg-gray-300 z-0"></div>

              {/* 2. 頂部橘色標記方塊 */}
              <div className="absolute left-[26.5px] top-[10px] w-[8px] h-[8px] bg-[#EA580C] z-10"></div>

              {/* 3. 底部黑色連接方塊 (剛好壓在水平線上) */}
              <div className="absolute left-[26.5px] bottom-[56.5px] w-[8px] h-[8px] bg-black z-10"></div>

              {/* 內容區塊 (預留 Padding 閃過垂直線) */}
              <div className="pl-[60px] pr-[40px] pt-[6px] h-full flex flex-col">
                <p className="text-xs font-bold text-gray-500 mb-3 tracking-widest">
                  {item.year}
                </p>
                <h4 className="text-[19px] font-bold text-black mb-4 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
                  {item.desc}
                </p>
                {item.img && (
                  <div className="mt-auto w-full max-w-[95%] overflow-hidden rounded bg-gray-200">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 尾部留白區塊：讓時間軸能無限往右拉伸一點點，確保視覺不會突然切斷 */}
          <div className="embla__slide relative flex-[0_0_20vw] md:flex-[0_0_200px] min-w-0"></div>
        </div>
      </div>

      {/* ==================================================
          🌟 懸浮橘色拖曳提示 (固定於畫面左下角，重疊於刻度上) 
          ================================================== */}
      <div className="absolute bottom-[35px] left-[8vw] md:left-[12vw] z-20 pointer-events-none flex items-center justify-center gap-[2px] bg-[#EA580C] px-3 py-1.5 rounded-full shadow-md translate-y-1/2">
        <MoveLeft size={16} strokeWidth={2.5} color="black" />
        <MoveRight size={16} strokeWidth={2.5} color="black" />
      </div>
    </section>
  );
}
