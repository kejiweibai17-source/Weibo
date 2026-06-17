"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

const IMG_BASE = "/images/accessories/小金剛旗艦三刀頭電動刮鬍刀/情境圖";

// 小金剛旗艦三刀頭電動刮鬍刀 — 情境圖與對應文案
const TIMELINE_DATA = [
  {
    year: "01",
    title: "旗艦登場，質感禮盒",
    desc: "鏡面全金屬機身矗立於岩石之上，搭配專屬紙袋與精緻包裝盒，開箱即享旗艦級儀式感，送禮自用兩相宜。",
    img: `${IMG_BASE}/1.jpg`,
  },
  {
    year: "02",
    title: "完整配件，一次到位",
    desc: "Type-C 充電線、清潔毛刷、收納袋與禮盒全數在列，出差旅行或日常理容，所需盡在其中。",
    img: `${IMG_BASE}/2.jpg`,
  },
  {
    year: "03",
    title: "開箱即見，誠意滿滿",
    desc: "抽拉式禮盒內盒陳列主機與配件，絨布收納袋、Type-C 線與毛刷依序呈現，細節處處用心。",
    img: `${IMG_BASE}/3.jpg`,
  },
  {
    year: "04",
    title: "IPX7 全機防水，一沖即淨",
    desc: "整機浸入水中沖洗無虞，刀頭與機身一沖即淨，浴室使用、日常清潔都更省心。",
    img: `${IMG_BASE}/4.jpg`,
  },
  {
    year: "05",
    title: "三刀頭旗艦工藝",
    desc: "三組獨立浮動刀頭，鏡面全金屬機身工業美學，握在手中沉穩有力，展現旗艦級理容質感。",
    img: `${IMG_BASE}/5.jpg`,
  },
];

export default function TimelineSlider() {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <section className="w-full bg-[#f4f4f4] py-24 relative overflow-hidden font-sans">
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
            昔馬小金剛旗艦三刀頭電動刮鬍刀
            <span className="font-bold">產品特色</span>
          </h2>
        </Copy>
      </div>

      <div
        className="embla w-full cursor-grab active:cursor-grabbing overflow-hidden"
        ref={emblaRef}
      >
        <div className="embla__container flex relative">
          <div className="absolute bottom-[30px] left-0 w-full h-[30px] z-0 pointer-events-none">
            <div className="absolute top-0 w-full h-[1px] bg-[#d2d2d2]"></div>
            <div
              className="absolute bottom-0 w-full h-[10px] opacity-[0.35]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #000 0, #000 1.5px, transparent 1.5px, transparent 24px)",
              }}
            ></div>
          </div>

          {TIMELINE_DATA.map((item, index) => (
            <div
              key={index}
              className="embla__slide relative flex-[0_0_85vw] md:flex-[0_0_420px] lg:flex-[0_0_480px] min-w-0 pb-[100px]"
            >
              <div className="absolute left-[30px] top-[14px] bottom-[60px] w-[1px] bg-gray-300 z-0"></div>
              <div className="absolute left-[26.5px] top-[10px] w-[8px] h-[8px] bg-[#EA580C] z-10"></div>
              <div className="absolute left-[26.5px] bottom-[56.5px] w-[8px] h-[8px] bg-black z-10"></div>

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

          <div className="embla__slide relative flex-[0_0_20vw] md:flex-[0_0_200px] min-w-0"></div>
        </div>
      </div>

      <div className="absolute bottom-[35px] left-[8vw] md:left-[12vw] z-20 pointer-events-none flex items-center justify-center gap-[2px] bg-[#EA580C] px-3 py-1.5 rounded-full shadow-md translate-y-1/2">
        <MoveLeft size={16} strokeWidth={2.5} color="black" />
        <MoveRight size={16} strokeWidth={2.5} color="black" />
      </div>
    </section>
  );
}
