"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "@/components/Copy";

const HomeScrollSequence01 = dynamic(
  () => import("@/components/home/HomeScrollSequence01"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[340px] w-full items-center justify-center text-sm text-neutral-500 md:h-[min(72vh,680px)]">
        載入 3D 展示…
      </div>
    ),
  },
);

const ParallaxPage = () => {
  // 針對第三區塊（灰色機芯區）建立滾動參考點
  const calibreRef = useRef(null);

  // 追蹤第三區塊的滾動進度：從元素頂部碰到視窗底部開始，到元素中心碰到視窗中心結束
  const { scrollYProgress: calibreScrollY } = useScroll({
    target: calibreRef,
    offset: ["start end", "center center"],
  });

  // 將滾動進度 (0 到 1) 映射到 CSS 屬性上 (比例、透明度、Y軸位移)
  const scale = useTransform(calibreScrollY, [0, 1], [0.85, 1]);
  const opacity = useTransform(calibreScrollY, [0, 1], [0, 1]);
  const y = useTransform(calibreScrollY, [0, 1], [150, 0]);

  return (
    <div className="relative w-full bg-black font-sans">
      {/* Section 1: 黑色主視覺 (Hero Section) 
        使用 sticky top-0 讓它固定在頂部，z-0 讓後續區塊可以覆蓋它
      */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
        {/* 頂部導覽列模擬 */}

        {/* 標題動畫 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-[7vmin] font-bold text-white tracking-tighter z-10 leading-none"
        >
          有力量，也有細節。
        </motion.h1>
        <Copy>
          {" "}
          <p className="mt-6 text-gray-400 text-center max-w-sm z-10 text-sm">
            強勁動力不易卡毛，細緻刀網舒適貼面，兼顧效率與膚感。
          </p>
        </Copy>

        {/* 這裡替換成影片中那張黑色手錶的背景圖 */}
        {/* 替換成這個寫法 */}
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `url('/images/2863f91d-4ff8-45c9-9c4c-f9a80a210e2d.png')`,
          }}
        />
      </div>

      {/* Section 2: 昔馬捍衛者文案 + 3D 互動展示 */}
      <div className="relative z-10 w-full bg-[#f5f5f5] text-black">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-8 text-center md:px-8 md:pt-28 md:pb-10">
          <Copy>
            <h2 className="text-[4.8vmin]">小。很強大。</h2>
          </Copy>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mt-10 md:mt-12"
          >
            <p className="text-[16px] font-mono leading-relaxed">
              昔馬捍衛者，把刮鬍、修容、收納與快充，放進一個精巧而有份量的設計裡。
            </p>
          </motion.div>
        </div>

        <HomeScrollSequence01 embedded />
      </div>

      {/* Section 3: 淺灰色機芯展示區 (Calibre Section) 
        綁定 calibreRef 來追蹤視差滾動進度
      */}
    </div>
  );
};

export default ParallaxPage;
