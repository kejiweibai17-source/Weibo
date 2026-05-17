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
      <div className="relative z-10 bg-[#ea580c] min-h-screen w-full flex flex-col items-center justify-center text-black px-8 py-32">
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
      <div
        ref={calibreRef}
        className="relative z-10 bg-[#e5e5e5] min-h-screen w-full flex flex-col items-center pt-32 pb-24 overflow-hidden"
      >
        {/* 區塊標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 z-20"
        >
          <h2 className="text-4xl font-bold text-black tracking-tight mb-2">
            CALIBRE AMB+
          </h2>
          <p className="text-lg text-gray-700">
            Developed by le Cercle des Horlogers
          </p>
        </motion.div>

        {/* 核心視差物件：動態套用 scale, opacity, y
         */}
        <motion.div
          style={{ scale, opacity, y }}
          className="relative w-full max-w-4xl aspect-square flex items-center justify-center z-10"
        >
          {/* 替換成機芯去背圖 (PNG) */}
          <img
            src="機芯去背圖網址.png"
            alt="Calibre AMB+"
            className="w-full h-full object-contain drop-shadow-2xl"
          />

          {/* 影片中附著在機芯上的橘色標記 'A' */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute top-[30%] left-[35%] w-8 h-8 bg-[#ea580c] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
          >
            A
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxPage;
