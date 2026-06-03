"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

const IMG_BASE = "/images/accessories/青春版電動刮鬍刀禮盒-三色/文宣";

// 青春版電動刮鬍刀禮盒 — 文宣圖與對應文案
const TIMELINE_DATA = [
  {
    year: "01",
    title: "隨時隨地，俐落出門",
    desc: "輕鬆握在掌心，一鍵啟動即可整理門面。昔馬青春版電動刮鬍刀，讓日常理容變得簡單又自信。",
    img: `${IMG_BASE}/1.jpg`,
  },
  {
    year: "02",
    title: "八大核心 一次到位",
    desc: "集結強勁動力、浮動刀網、掌心尺寸、IPX7 防水、Type-C 快充、合金機身與高顏值設計，滿足日常與差旅需求。",
    img: `${IMG_BASE}/2.jpg`,
  },
  {
    year: "03",
    title: "掌心尺寸 輕巧便攜",
    desc: "單手即可掌握，放進口袋或洗漱包都不佔空間。出差、健身、旅行，隨身帶著走也不負擔。",
    img: `${IMG_BASE}/3.jpg`,
  },
  {
    year: "04",
    title: "雙環刀頭 精密結構",
    desc: "外開放式圓刀頭搭配浮動貼面設計，貼合臉部輪廓，精準捕捉鬍鬚，刮剃更乾淨、更有效率。",
    img: `${IMG_BASE}/4.jpg`,
  },
  {
    year: "05",
    title: "硬核設計 質感滿分",
    desc: "簡約線條與細緻做工，展現俐落工業美學。放在檯面上，就是一件值得細品的理容單品。",
    img: `${IMG_BASE}/5.jpg`,
  },
  {
    year: "06",
    title: "合金鍛造 沉穩觸感",
    desc: "金屬機身帶來扎實握感與耐用表現，細緻表面處理讓每一次握持都舒適順手。",
    img: `${IMG_BASE}/6.jpg`,
  },
  {
    year: "07",
    title: "IPX7 全機防水",
    desc: "可直接清水沖洗，清潔刀頭更省心。浴室潮濕環境也能安心使用，衛生又好打理。",
    img: `${IMG_BASE}/7.jpg`,
  },
  {
    year: "08",
    title: "持久續航 從容應對",
    desc: "快充搭配長效續航，日常刮鬍、臨時出門都能從容應付，不必為電量反覆操心。",
    img: `${IMG_BASE}/8.jpg`,
  },
  {
    year: "09",
    title: "浮動旋轉 貼合輪廓",
    desc: "刀頭可隨臉部線條微幅調整，下巴、嘴角等難剃區域也能順暢處理，減少拉扯感。",
    img: `${IMG_BASE}/9.jpg`,
  },
  {
    year: "10",
    title: "自在刮鬍 順暢體驗",
    desc: "貼面刀網配合穩定動力，刮剃過程順滑不卡頓，早晚整理都能快速完成。",
    img: `${IMG_BASE}/10.jpg`,
  },
  {
    year: "11",
    title: "放鬆理容 日常儀式",
    desc: "在家也能享受輕鬆的整理時光，簡單幾分鐘，讓精神狀態與外在形象同步升級。",
    img: `${IMG_BASE}/11.jpg`,
  },
  {
    year: "12",
    title: "精美禮盒 送禮首選",
    desc: "開箱即可看見完整配件配置，刮鬍刀與周邊一應俱全，送男友、送父親、送同事都體面周到。",
    img: `${IMG_BASE}/12.jpg`,
  },
  {
    year: "13",
    title: "三色可選 風格百搭",
    desc: "提供多款配色選擇，依個人喜好與使用場景挑選，低調質感或經典色系都能輕鬆駕馭。",
    img: `${IMG_BASE}/13.jpg`,
  },
  {
    year: "14",
    title: "產品規格 一目了然",
    desc: "尺寸、續航、防水等關鍵參數清楚標示，選購前即可快速掌握，買得明白、用得安心。",
    img: `${IMG_BASE}/14.jpg`,
  },
  {
    year: "15",
    title: "好評不斷 口碑見證",
    desc: "真實使用者回饋與推薦分享，從刮剃體驗到禮盒質感，多面向肯定昔馬青春版的實力表現。",
    img: `${IMG_BASE}/好評不斷L.jpg`,
  },
  {
    year: "16",
    title: "推薦理由 五大亮點",
    desc: "從便攜、刀頭、防水、續航到禮盒完整性，條列式整理核心賣點，幫你快速做出選擇。",
    img: `${IMG_BASE}/刮鬍刀推薦理由L.jpg`,
  },
  {
    year: "17",
    title: "選購指南 聰明比較",
    desc: "對照功能與使用情境的選購建議，無論自用或送禮，都能找到最適合的刮鬍刀方案。",
    img: `${IMG_BASE}/刮鬍刀選購指南L.jpg`,
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
            昔馬青春版電動刮鬍刀禮盒
            <span className="font-bold">產品特色</span>
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
