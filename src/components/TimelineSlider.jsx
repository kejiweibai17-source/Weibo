"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";
// ============================================================================
// 昔馬 SMASMALL 品牌歷史資料
// ============================================================================
const TIMELINE_DATA = [
  {
    year: "2019",
    title: "刀網全新升級",
    desc: "從經典跑車與航空機身中汲取靈感，確立了 SMASMALL 昔馬的設計語彙。我們決定拋棄傳統塑膠，挑戰全合金機身的極致工藝。",
    img: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
  },
  {
    year: "2020",
    title: "續航力提升",
    desc: "•約65分鐘快速充電，可持續運行近95餘分鐘",
    img: "/images/星座系列/刀往全新升級.jpg",
  },
  {
    year: "2021",
    title: "超長蓄電",
    desc: "研發出業界首創的「磁吸式刀頭」結構。透過精密的磁力計算，讓刀頭拆卸清洗只需一秒鐘，大幅提升了使用者的便利性與產品壽命。",
    img: "/images/星座系列/超長蓄電.jpg",
  },
  {
    year: "2022",
    title: "充足馬力",
    desc: "進入量產前的最終調校。針對馬達轉速、抗震結構與 IPX7 防水性能進行極限測試，確保每一把刮鬍刀都能達到精品級的耐用標準。",
    img: "/images/星座系列/充足馬力.jpg",
  },
  {
    year: "2023",
    title: "機身防水",
    desc: "SMASMALL 經典系列正式問世，並透過威柏科技引入台灣市場。以獨特的復古未來主義風格，重新定義了男士理容工具的品味。",
    img: "/images/星座系列/機身防水.jpg",
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
            The Journey
          </span>
        </Copy>
        <Copy>
          {" "}
          <h2 className="text-3xl md:text-4xl font-light text-black tracking-wide">
            A Legacy of <span className="font-bold">Craftsmanship</span>
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
