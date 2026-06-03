"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

const IMG_BASE = "/images/accessories/星座系列電動刮鬍刀禮盒/文宣";

// 星座系列電動刮鬍刀禮盒 — 文宣圖與對應文案
const TIMELINE_DATA = [
  {
    year: "01",
    title: "星座系列 四象登場",
    desc: "火象、土象、風象、水象四款主題一次呈現，繽紛配色搭配星座元素，讓理容也能展現個人風格。",
    img: `${IMG_BASE}/01.jpg`,
  },
  {
    year: "02",
    title: "持續進化 經典延續",
    desc: "從設計到體驗不斷精進，昔馬星座系列累積多年口碑，為日常刮鬍與送禮需求提供穩定可靠的選擇。",
    img: `${IMG_BASE}/02.jpg`,
  },
  {
    year: "03",
    title: "多角度細看 質感可見",
    desc: "機身線條、刀頭結構與配件配置一目了然，無論自用或選購禮盒，都能快速掌握產品全貌。",
    img: `${IMG_BASE}/03.jpg`,
  },
  {
    year: "04",
    title: "精密刀網 乾淨刮剃",
    desc: "刀頭結構與刮剃表現清楚展示，貼面設計能捕捉細短鬚根，讓每次整理都更順暢俐落。",
    img: `${IMG_BASE}/04.jpg`,
  },
  {
    year: "05",
    title: "專屬星座 個性印記",
    desc: "以十二星座為靈感打造主題設計，每一款都帶有獨特星座符號與專屬雷雕序號，紀念意義滿分。",
    img: `${IMG_BASE}/05.jpg`,
  },
  {
    year: "06",
    title: "規格對照 選款更安心",
    desc: "各象限款式與核心參數條列整理，選購前即可比較功能與配置，找到最適合的星座禮盒組合。",
    img: `${IMG_BASE}/06.png`,
  },
  {
    year: "07",
    title: "四象配色 風格各異",
    desc: "火、土、風、水四象各自對應不同色系與個性，依星座或喜好挑選，都能展現獨特品味。",
    img: `${IMG_BASE}/07.jpg`,
  },
  {
    year: "08",
    title: "精緻禮盒 開箱即驚喜",
    desc: "星座主題外包裝搭配完整內盒配置，拆開瞬間就能感受送禮級的儀式感與質感細節。",
    img: `${IMG_BASE}/08.jpg`,
  },
  {
    year: "09",
    title: "星雲塗裝 質感獨具",
    desc: "機身星雲紋理與漸層光影，將宇宙意象融入日常理容，握在手裡就是一件精緻小物。",
    img: `${IMG_BASE}/09.jpg`,
  },
  {
    year: "10",
    title: "繽紛陣容 一次看齊",
    desc: "多款配色並列展示，從沉穩到亮眼各有特色，適合不同星座個性與送禮對象。",
    img: `${IMG_BASE}/10.jpg`,
  },
  {
    year: "11",
    title: "專屬皮套 隨身保護",
    desc: "附贈質感收納皮套，外出差旅時方便攜帶，也能避免刮傷與沾塵，守護你的理容裝備。",
    img: `${IMG_BASE}/11.jpg`,
  },
  {
    year: "12",
    title: "完整配置 禮享經典",
    desc: "開箱即可看見刮鬍刀與配件完整陳列，從日常使用到收藏展示，一次滿足。",
    img: `${IMG_BASE}/12.jpg`,
  },
  {
    year: "13",
    title: "心意之選 送禮體面",
    desc: "雙手交遞禮盒的瞬間，傳遞的不只是實用，更是用心。生日、節日、紀念日都適合。",
    img: `${IMG_BASE}/13.jpg`,
  },
  {
    year: "14",
    title: "共享時刻 質感生活",
    desc: "融入日常相處的場景，一份實用又好看的禮物，讓理容也成為生活裡的小確幸。",
    img: `${IMG_BASE}/14.jpg`,
  },
  {
    year: "15",
    title: "加贈好禮 誠意滿滿",
    desc: "禮盒加贈星座明信片、轉盤卡、手提袋等周邊，讓開箱驚喜再升級，送禮更有誠意。",
    img: `${IMG_BASE}/15(加贈贈品圖).jpg`,
  },
  {
    year: "16",
    title: "順手好用 日常必備",
    desc: "輕巧握感與順暢刮剃體驗，早晚整理都能快速完成，是男生日常離不開的理容夥伴。",
    img: `${IMG_BASE}/16.jpg`,
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
            昔馬星座系列電動刮鬍刀禮盒
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
