"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

// ============================================================================
// 手風琴選單資料
// ============================================================================
const ACCORDION_DATA = [
  {
    id: "item-1",
    category: "雙環開放式刀頭 2.0版",
    title: "德國進口材料，日本加工技術",
    desc: "SMASMALL 昔馬電動刮鬍刀，以高質感鋅合金機身打造，搭配極簡俐落外型，讓刮鬍不只是整理，而是一種生活品味。輕巧尺寸、精準貼面刀頭，從第一眼到第一刮，都展現成熟男性魅力",
    img: "/images/about/晶透源頭：LiposoMax微脂體穀胱甘肽.png",
  },
  {
    id: "item-2",
    category: "雙環開放式刀頭 2.0版",
    title: "德國進口材料，日本加工技術",
    desc: "SMASMALL 昔馬電動刮鬍刀，以高質感鋅合金機身打造，搭配極簡俐落外型，讓刮鬍不只是整理，而是一種生活品味。輕巧尺寸、精準貼面刀頭，從第一眼到第一刮，都展現成熟男性魅力",
  },
  // 你可以隨時在這裡新增第三、第四個特色，佈局會自動適應！
];

// 小巧精緻的箭頭 Icon
const ChevronIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const TextParallaxContentExample = () => {
  // ... (保留你原本的 scrollYProgress 等邏輯)
  const sectionRef = useRef(null);

  return (
    <>
      <div className="bg-white relative isolate">
        <TextParallaxContent
          subheading="雙環開放式刀頭 2.0版"
          heading="「合金工藝 × 極簡設計 × 高效刮淨」"
        >
          {/* 調整了 padding 與高度，讓畫面更有呼吸空間 */}
          <div className="min-h-[120vh] px-4 md:px-8 pt-[12vh] pb-32">
            <ExampleContent />
          </div>
        </TextParallaxContent>
      </div>
    </>
  );
};

/* ===== TextParallaxContent / StickyBackground / OverlayCopy 保留你原本的設定 ===== */
const TextParallaxContent = ({ subheading, heading, children }) => {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef} className="relative isolate">
      <div className="sticky top-0 h-screen z-0 overflow-hidden will-change-transform">
        <StickyBackground containerRef={containerRef} />
        <OverlayCopy
          heading={heading}
          subheading={subheading}
          containerRef={containerRef}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const StickyBackground = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const rawY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useSpring(rawScale, { damping: 30, stiffness: 120 });
  const y = useSpring(rawY, { damping: 30, stiffness: 120 });

  return (
    <motion.div
      className="absolute inset-0 bg-[url('/images/003-01.png')] bg-center bg-cover bg-no-repeat"
      style={{ scale, y, transform: "translateZ(0)", willChange: "transform" }}
    />
  );
};

const OverlayCopy = ({ subheading, heading, containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rawOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    [0, 1, 0],
  );
  const y = useSpring(rawY, { damping: 30, stiffness: 120 });
  const opacity = useSpring(rawOpacity, { damping: 30, stiffness: 120 });

  return (
    <motion.div
      style={{
        y,
        opacity,
        transform: "translateZ(0)",
        willChange: "transform",
      }}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-start justify-center text-white px-4"
    >
      <div className="flex items-center justify-center w-full">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl drop-shadow-md">
            {subheading}
          </p>
          <p className="text-center text-4xl font-bold   drop-shadow-lg">
            {heading}
          </p>
        </div>
        <div className="hidden md:block w-1/2"></div>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   🌟 全新改寫的 ExampleContent (Vaonis 風格手風琴佈局)
   ============================================================================ */
const ExampleContent = () => {
  const txtRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: txtRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );
  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useSpring(rawOpacity, { damping: 20, stiffness: 100 });
  const y = useSpring(rawY, { damping: 20, stiffness: 100 });

  return (
    <motion.div
      ref={txtRef}
      style={{ opacity, y }}
      className="w-full max-w-[1400px] mx-auto"
    >
      {/* 左右雙欄佈局：左側選單，右側圖片 */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* 左側：暗黑毛玻璃手風琴選單 */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end z-20">
          <div className="w-full max-w-[500px] bg-[#cdcdcd]/20 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {ACCORDION_DATA.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.id}
                  className="border-b border-white/10 last:border-none"
                >
                  {/* Header 點擊區塊 */}
                  <div
                    className="flex items-center justify-between py-5 cursor-pointer group"
                    onClick={() => setActiveIndex(index)}
                  >
                    <span
                      className={`text-[14px] font-medium tracking-wide transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {item.category}
                    </span>

                    {/* 右側箭頭 Icon */}
                    <div className="w-[26px] h-[26px] flex items-center justify-center bg-white/5 border border-white/10 rounded-[4px] group-hover:bg-white/10 transition-colors duration-300">
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <ChevronIcon className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* 展開的內容區塊 */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        {/* 內部 Padding 確保展開時的呼吸空間 */}
                        <div className="pb-6 pt-2">
                          <h3 className="text-[20px] md:text-[22px] text-white font-medium mb-3 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[14px] text-gray-400 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：根據選單動態切換的高清圖片 */}
        <div className="w-full lg:w-[50%] flex justify-center items-center h-[350px] md:h-[500px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={ACCORDION_DATA[activeIndex].img}
                placeholder="empty"
                width={800}
                height={800}
                className="w-full max-w-[450px] h-auto object-contain drop-shadow-2xl"
                alt={ACCORDION_DATA[activeIndex].title}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TextParallaxContentExample;
