"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

const CIMG = "/images/accessories/完美紳士/情境圖";

const TIMELINE_DATA = [
  {
    year: "01",
    title: "MATEBOX 3in1，工業之美",
    desc: "鑲嵌式立體工業插畫禮盒，致敬那些為更好生活而奮鬥的人。鐵系列質感，一盒三機，開箱即是儀式感。",
    img: `${CIMG}/玩美-1.jpg`,
  },
  {
    year: "02",
    title: "立式展示，品味陳列",
    desc: "可直立擺放的精品展示內盒，電動刮鬍刀、鼻毛刀、鑰匙圈刀三機並陣，梳妝台上的質感宣言。",
    img: `${CIMG}/玩美-2.jpg`,
  },
  {
    year: "03",
    title: "全套配件，一次到齊",
    desc: "MATEBOX 正面插畫展示完整鐵系列設計哲學——精密齒輪、蒸汽龐克工業美學，每個配件都有分量。",
    img: `${CIMG}/玩美-3.jpg`,
  },
  {
    year: "04",
    title: "細節雕琢，紋路鑄造",
    desc: "波紋合金機身搭配橙色矽膠保護套，細節即品格——送禮拿出來就贏了，自用每天都是享受。",
    img: `${CIMG}/玩美-4.jpg`,
  },
  {
    year: "05",
    title: "一手掌握，隨行理容",
    desc: "鑰匙圈款迷你修剪刀出行必備，隨時隨地保持精緻儀態。完美紳士的細節，從不妥協。",
    img: `${CIMG}/玩美-5.jpg`,
  },
];

export default function TimelineSlider() {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });

  return (
    <section className="w-full bg-[#f4f4f4] py-24 relative overflow-hidden font-sans">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mb-16">
        <Copy>
          <span className="text-[11px] font-bold tracking-widest text-[#EA580C] uppercase mb-4">
            Features
          </span>
        </Copy>
        <Copy>
          <h2 className="text-3xl md:text-4xl font-light text-black tracking-wide">
            昔馬完美紳士
            <span className="font-bold">MATEBOX 3in1 特色</span>
          </h2>
        </Copy>
      </div>

      <div className="embla w-full cursor-grab active:cursor-grabbing overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex relative">
          <div className="absolute bottom-[30px] left-0 w-full h-[30px] z-0 pointer-events-none">
            <div className="absolute top-0 w-full h-[1px] bg-[#d2d2d2]"></div>
            <div
              className="absolute bottom-0 w-full h-[10px] opacity-[0.35]"
              style={{ backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 1.5px, transparent 1.5px, transparent 24px)" }}
            ></div>
          </div>

          {TIMELINE_DATA.map((item, index) => (
            <div key={index} className="embla__slide relative flex-[0_0_85vw] md:flex-[0_0_420px] lg:flex-[0_0_480px] min-w-0 pb-[100px]">
              <div className="absolute left-[30px] top-[14px] bottom-[60px] w-[1px] bg-gray-300 z-0"></div>
              <div className="absolute left-[26.5px] top-[10px] w-[8px] h-[8px] bg-[#EA580C] z-10"></div>
              <div className="absolute left-[26.5px] bottom-[56.5px] w-[8px] h-[8px] bg-black z-10"></div>

              <div className="pl-[60px] pr-[40px] pt-[6px] h-full flex flex-col">
                <p className="text-xs font-bold text-gray-500 mb-3 tracking-widest">{item.year}</p>
                <h4 className="text-[19px] font-bold text-black mb-4 leading-snug">{item.title}</h4>
                <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">{item.desc}</p>
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
