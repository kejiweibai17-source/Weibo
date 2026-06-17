"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

const CIMG = "/images/accessories/電動鼻毛修剪器/情境圖";

const TIMELINE_DATA = [
  {
    year: "01",
    title: "冰晶質感，精緻亮相",
    desc: "白色荔枝紋皮革機身搭配鏡面鉻銀刀頭，如冰晶般純淨剔透，放在梳妝台上就是一件精緻小物。",
    img: `${CIMG}/01.png`,
  },
  {
    year: "02",
    title: "俐落輪廓，隨身攜帶",
    desc: "方形緊湊機身單手即可握持，口袋大小輕鬆塞入，出差旅行或健身房後的快速整理都沒問題。",
    img: `${CIMG}/02.png`,
  },
  {
    year: "03",
    title: "頑石之美，低調硬核",
    desc: "沉穩岩石場景映襯白色皮革機身，展現男士理容的硬派美學——細節精緻，質感不言而喻。",
    img: `${CIMG}/03.png`,
  },
  {
    year: "04",
    title: "Icebreaker 禮盒，開箱即驚喜",
    desc: "繽紛藍色 Icebreaker 主題外盒、橙色內盒承托主機，附充電線與磁吸 USB 接頭，送禮自用皆宜。",
    img: `${CIMG}/04.png`,
  },
  {
    year: "05",
    title: "限量禮盒，一拿即送",
    desc: "搶眼的 Smasmall Icebreaker 插畫禮盒，拿在手上就是最佳伴手禮，送禮的誠意一眼可見。",
    img: `${CIMG}/05.png`,
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
            昔馬電動鼻毛修剪器
            <span className="font-bold">產品特色</span>
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
