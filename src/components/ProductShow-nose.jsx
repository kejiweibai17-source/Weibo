"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const IMG_BASE = "/images/accessories/電動鼻毛修剪器/產品內容物";

const PRODUCTS = [
  {
    id: 1,
    badge: "禮盒",
    name: "Icebreaker 禮盒",
    tags: ["插畫禮盒", "送禮首選", "Icebreaker"],
    thumbUrl: `${IMG_BASE}/05.png`,
    mainUrl: `${IMG_BASE}/05.png`,
    features: [
      {
        title: "Icebreaker 插畫禮盒",
        bullets: [
          "繽紛限定插畫外盒，視覺吸睛，開箱即享儀式感",
          "生日、節慶、紀念日，送禮誠意一眼可見",
        ],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass: "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 2,
    badge: "產品",
    name: "刀頭細節展示",
    tags: ["旋轉刀頭", "無痛修剪", "精準理容"],
    thumbUrl: `${IMG_BASE}/02.png`,
    mainUrl: `${IMG_BASE}/02.png`,
    features: [
      {
        title: "旋轉刀頭，無痛精準",
        bullets: [
          "高速旋轉刀片精準修剪鼻毛，不拉扯不疼痛",
          "密閉刀頭設計，修剪碎屑不外漏，保持清潔",
        ],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass: "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 3,
    badge: "產品",
    name: "機身全角度",
    tags: ["緊湊機身", "一鍵啟動", "長效續航"],
    thumbUrl: `${IMG_BASE}/03.png`,
    mainUrl: `${IMG_BASE}/03.png`,
    features: [
      {
        title: "一鍵啟動，省時省力",
        bullets: [
          "頂部單鍵操作，即開即用，30 秒快速整理完成",
          "長效續航，充電一次可使用數週",
        ],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass: "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 4,
    badge: "配件",
    name: "機身 + 充電配件",
    tags: ["磁吸USB", "輕便收納", "完整配件"],
    thumbUrl: `${IMG_BASE}/04.png`,
    mainUrl: `${IMG_BASE}/04.png`,
    features: [
      {
        title: "配件齊全，開箱即用",
        bullets: [
          "附磁吸 USB 充電線，隨時補電不斷電",
          "尺寸小巧，直接放入化妝包或旅行袋",
        ],
        boxPos: "md:absolute md:top-[20%] md:left-[10%]",
        lineClass: "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: 5,
    badge: "主機",
    name: "電動鼻毛修剪器（白色款）",
    tags: ["白色皮革機身", "鏡面鉻銀刀頭", "磁吸充電"],
    thumbUrl: `${IMG_BASE}/01.png`,
    mainUrl: `${IMG_BASE}/01.png`,
    features: [
      {
        title: "冰晶白，精緻質感",
        bullets: [
          "白色荔枝紋皮革機身，鏡面鉻銀刀頭，低調奢華",
          "方形緊湊輪廓，單手握持舒適，隨身攜帶無負擔",
        ],
        boxPos: "md:absolute md:top-[15%] md:left-[5%]",
        lineClass: "hidden md:block top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
      {
        title: "磁吸充電，快速便利",
        bullets: [
          "磁吸式 USB 充電設計，一吸即充，無需插孔",
          "IPX5 防水，沖水清洗不費力，保持衛生整潔",
        ],
        boxPos: "md:absolute md:bottom-[15%] md:left-[8%]",
        lineClass: "hidden md:block top-[20%] left-full w-[120px] h-[1px] origin-left rotate-[-20deg]",
        dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
];

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentProduct = PRODUCTS[activeIndex] || PRODUCTS[0];

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) setActiveIndex((prev) => (prev + 1) % PRODUCTS.length);
    else if (info.offset.x > swipeThreshold) setActiveIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  return (
    <section className="w-full bg-[#050507] font-sans pt-16 pb-[150px] h-auto flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none pt-[13vh]">
        <div className="absolute w-[80%] max-w-[1200px] h-[400px] bg-[#ea580c] opacity-[0.15] blur-[120px] rounded-[100%]"></div>
        <div className="absolute w-[50%] max-w-[600px] h-[200px] bg-white opacity-[0.08] blur-[80px] rounded-[100%] mt-[50px]"></div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto min-h-[400px] md:h-[650px] mb-8 md:mb-12 z-10 px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="relative md:absolute inset-0 w-full h-full flex flex-col items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
          >
            <div className="relative w-full md:w-[60%] h-[280px] md:h-[90%] flex items-center justify-center z-10 pointer-events-none mb-4 md:mb-0 shrink-0">
              <img src={currentProduct.mainUrl} alt={currentProduct.name} className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
            </div>

            <div className="flex md:hidden items-center justify-center gap-2 mb-6 pointer-events-none">
              {PRODUCTS.map((_, dotIdx) => (
                <div key={dotIdx} className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === dotIdx ? "w-4 bg-[#ea580c]" : "w-1.5 bg-white/20"}`} />
              ))}
            </div>

            <div className="w-full flex flex-col gap-4 md:absolute md:inset-0 z-20 pointer-events-none md:pointer-events-auto">
              {currentProduct.features?.map((feature, idx) => (
                <div key={idx} className={`${feature.boxPos} relative md:absolute w-full md:w-[280px] bg-[#18181b]/60 md:bg-[#18181b]/80 backdrop-blur-md p-4 md:p-5 rounded-xl border border-white/5 md:border-white/10 shadow-lg md:shadow-2xl`}>
                  <h3 className="text-white text-[14px] md:text-[15px] font-bold leading-tight mb-2 md:mb-3">{feature.title}</h3>
                  <ul className="text-[#a1a1aa] text-[12px] md:text-[13px] leading-relaxed space-y-1.5 pl-3">
                    {feature.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="relative">
                        <span className="absolute left-[-12px] top-[7px] w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {feature.lineClass && (
                    <div className={`absolute bg-white/30 pointer-events-none ${feature.lineClass}`}>
                      <div className={`absolute w-[5px] h-[5px] bg-[#ea580c] rounded-full shadow-[0_0_8px_rgba(234,88,12,0.8)] ${feature.dotClass}`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 overflow-x-auto pb-8 custom-scrollbar z-10 mt-4 md:mt-0">
        <div className="flex md:justify-center gap-4 min-w-max mx-auto">
          {PRODUCTS.map((product, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`relative w-[180px] md:w-[220px] flex-shrink-0 rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-300 ease-out group flex flex-col ${isActive ? "bg-[#1f1f22]" : "bg-[#131315] hover:bg-[#1a1a1d]"}`}
                style={{ boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "inset 0 0 0 1px rgba(255,255,255,0.03)" }}
              >
                <div className={`absolute top-0 left-0 w-full h-[3px] rounded-t-xl transition-all duration-300 ${isActive ? "bg-[#ea580c] shadow-[0_0_12px_rgba(234,88,12,0.8)]" : "bg-transparent"}`}></div>
                <div className="bg-[#27272a] text-[#ea580c] border border-[#ea580c]/20 text-[10px] font-bold px-2 py-1 rounded w-fit mb-3">{product.badge}</div>
                <div className="w-full h-[100px] md:h-[120px] mb-3 flex items-center justify-center p-2">
                  <img src={product.thumbUrl} alt={product.name} className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h4 className="text-white text-[12px] md:text-[14px] font-medium leading-snug line-clamp-2 mb-3">{product.name}</h4>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {product.tags?.map((tag, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded-sm text-[10px] text-gray-400 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 max-w-[1420px] w-[95%] sm:w-[80%] xl:w-[70%] mx-auto">
        <div className="p-3">
          <Image
            src="/images/accessories/電動鼻毛修剪器/說明書/昔馬_電動鼻毛修剪器說明書.png"
            alt="昔馬電動鼻毛修剪器說明書 威柏科技-昔馬電動刮鬍刀總代理"
            width={1000} height={1000} placeholder="empty" loading="lazy" className="w-full"
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar{display:none;}.custom-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}` }} />
    </section>
  );
}
