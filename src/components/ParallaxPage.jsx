"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "@/components/Copy";

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
          className="text-[6rem] font-bold text-white tracking-tighter z-10 leading-none"
        >
          SMSMALL
        </motion.h1>
        <Copy>
          {" "}
          <p className="mt-6 text-gray-400 text-center max-w-sm z-10 text-sm">
            Sleek design. High-tech minimalism. The perfect harmony between
            design and precision engineering.
          </p>
        </Copy>

        {/* 這裡替換成影片中那張黑色手錶的背景圖 */}
        {/* 替換成這個寫法 */}
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `url('/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png')`,
          }}
        />
      </div>

      {/* Section 2: 橘色文字區塊 (Ethos Section) 
        使用 relative z-10，在滾動時會自然蓋過上面 sticky 的黑色區塊
      */}
      <div className="relative z-10 bg-[#f5f5f5] min-h-screen w-full flex flex-col items-center justify-center text-black px-8 py-32">
        <div className="max-w-3xl text-center space-y-16">
          {/* 使用 whileInView 讓元素進入畫面時觸發動畫 */}
          <Copy>
            <h1>Design & Strategy for the Vision-Driven</h1>
          </Copy>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-sm font-mono leading-relaxed">
              WE HAVE METICULOUSLY HONED THE CRITICAL FACETS OF DESIGN AND
              FUNCTIONALITY. EXACTING PRECISION IN OUR LINES, SHAPES, CURVES...
            </p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: 淺灰色機芯展示區 (Calibre Section) 
        綁定 calibreRef 來追蹤視差滾動進度
      */}
    </div>
  );
};

export default ParallaxPage;
