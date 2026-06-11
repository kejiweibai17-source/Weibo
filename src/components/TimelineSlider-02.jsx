"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

// ============================================================================
// 昔馬 SMASMALL 品牌歷史資料 (黑夜騎士系列)
// ============================================================================
const TIMELINE_DATA = [
  {
    year: "01",
    title: "化身黑夜騎士",
    desc: "每個人都是自己的黑夜騎士。披上披風、抬起胸膛，穿梭在每個城市的角落。你的存在，讓城市的黑暗變得溫暖。",
    img: "/images/accessories/黑夜騎士/文宣/1.jpg",
  },
  {
    year: "02",
    title: "秒懂男人的禮物",
    desc: "GIFT BOX 精美動心的禮盒，送禮送到心坎裡；更是日常理容、外出使用的絕佳好幫手，低調奢華有內涵。",
    img: "/images/accessories/黑夜騎士/文宣/9.jpg",
  },
  {
    year: "03",
    title: "黑夜騎士 3合1禮盒",
    desc: "精緻三合一禮盒搭配，採用抽拉式包裝設計，燙金紅字體炙熱奪目。沉穩考究的傳奇灰，展現低調奢華的極致品味。",
    img: "/images/accessories/黑夜騎士/文宣/3.jpg",
  },
  {
    year: "04",
    title: "禮盒專屬內容物",
    desc: "一次擁有齊全裝備：昔馬鼻毛修剪器、電動刮鬍刀、定製收納皮套、Type-C充電線、清潔毛刷、配件盒、精緻禮盒與說明書。",
    img: "/images/accessories/黑夜騎士/文宣/10_無紙袋版本.jpg",
  },
  {
    year: "05",
    title: "MINI SHAVER 電動刮鬍刀",
    desc: "傳奇灰機身點綴波光粼粼的日內瓦紋。小巧便攜且具備極高顏值，讓你自由來去不設限，隨時保持俐落清爽。",
    img: "/images/accessories/黑夜騎士/文宣/4.jpg",
  },
  {
    year: "06",
    title: "雙環外開放式圓刀頭",
    desc: "精緻工藝打造，浮動貼面能精準捕捉鬍鬚，升級版圓刀頭讓刮鬍效率比傳統提升 50%，達成極致高效刮鬍。",
    img: "/images/accessories/黑夜騎士/文宣/5.jpg",
  },
  {
    year: "07",
    title: "抗菌刀頭與強勁動力",
    desc: "刀頭表面經抗菌處理，安全無憂；強勁動力與穩定高轉速，順暢不拉扯，無懼粗硬鬍鬚，且擁有持久續航力。",
    img: "/images/accessories/黑夜騎士/文宣/6.jpg",
  },
  {
    year: "08",
    title: "潮流鼻毛修剪器",
    desc: "獨特個性酒壺造型，是修剪器也是潮流配飾。採手動按壓設計，圓刀頭安全不傷膚，並支援全身水洗徹底清潔。",
    img: "/images/accessories/黑夜騎士/文宣/7.jpg",
  },
  {
    year: "09",
    title: "專屬訂製收納皮套",
    desc: "專為黑夜騎士打造的方型盒收納皮套，方便隨身攜帶，沉穩考究的質感看得見，完美保護您的頂級理容工具。",
    img: "/images/accessories/黑夜騎士/文宣/8.jpg",
  },
  {
    year: "10",
    title: "八大核心 強悍性能",
    desc: "集結性能強勁、浮動刀網、掌心尺寸、IPX7防水、推動式操作、高能鋰電池、合金壓鑄及高顏值，並榮獲多項國際設計大獎。",
    img: "/images/accessories/黑夜騎士/文宣/2.jpg",
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
            昔馬電動刮鬍刀-黑夜騎士<span className="font-bold">產品特色</span>
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
