import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Copy from "@/components/Copy";

const ParallaxPage = () => {
  // 控制影片彈窗的狀態
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // 針對第三區塊（灰色機芯區）建立滾動參考點
  const calibreRef = useRef(null);

  // 追蹤第三區塊的滾動進度
  const { scrollYProgress: calibreScrollY } = useScroll({
    target: calibreRef,
    offset: ["start end", "center center"],
  });

  // 將滾動進度 (0 到 1) 映射到 CSS 屬性上
  const scale = useTransform(calibreScrollY, [0, 1], [0.85, 1]);
  const opacity = useTransform(calibreScrollY, [0, 1], [0, 1]);
  const y = useTransform(calibreScrollY, [0, 1], [150, 0]);

  return (
    <>
      <div className="relative w-full bg-black font-sans">
        {/* Section 1: 黑色主視覺 (Hero Section) */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[6rem] font-bold text-white tracking-tighter z-10 leading-none"
          >
            SMSMALL
          </motion.h1>
          <Copy>
            <p className="mt-6 text-gray-400 text-center max-w-sm z-10 text-sm">
              Sleek design. High-tech minimalism. The perfect harmony between
              design and precision engineering.
            </p>
          </Copy>

          <div
            className="absolute inset-0 opacity-50 bg-cover bg-center z-[-1]"
            style={{ backgroundImage: `url('/images/003.png')` }}
          />
        </div>

        {/* Section 2: 橘色文字區塊 (Ethos Section) */}
        <div className="relative z-10 bg-[#ea580c] min-h-screen w-full flex flex-col items-center justify-center text-black px-8 py-32">
          <div className="max-w-3xl text-center space-y-16">
            <Copy>
              <h1 className=" text-2xl md:text-3xl text-stone-200 xl:text-5xl leading-normal">
                合金壓鑄手工精心打磨，每處劃痕都是戰損痕跡的力量印記
              </h1>
            </Copy>

            <Copy>
              <p className="text-[16px] text-stone-200 font-mono leading-relaxed">
                1小時快速充電，可約續航60分鐘，日常使用約20天
              </p>
            </Copy>
          </div>
        </div>

        {/* Section 3: 淺灰色機芯展示區 (Calibre Section) */}
        <div
          ref={calibreRef}
          className="relative z-10 bg-[#e5e5e5] min-h-screen w-full flex flex-col items-center pt-32 pb-24 overflow-hidden"
        >
          <div className="w-[85%] flex justify-center items-center flex-col z-20 relative">
            <Copy>
              <h2 className="text-4xl font-bold text-black tracking-tight mb-2">
                捍衛者+
              </h2>
            </Copy>
            <Copy>
              <p className="text-[16px] text-stone-800 text-center">
                合金壓鑄手工精心打磨，每處劃痕都是戰損痕跡的力量印記
              </p>
            </Copy>
            <Copy>
              <p className="text-[16px] text-stone-800 text-center">
                全套征服全臉的修容武裝禮盒
              </p>
            </Copy>
          </div>

          <motion.div
            style={{ scale, opacity, y }}
            className="relative w-full max-w-[650px] pb-14  border aspect-square flex items-center justify-center z-10 mt-12"
          >
            {/* 主體：機芯/刮鬍刀圖 */}
            <img
              src="/images/捍衛者/捍衛者-01.png"
              alt="Calibre AMB+"
              className="w-full h-full object-contain drop-shadow-2xl relative z-20"
            />

            {/* 充電線插入動畫 */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2,
              }}
              className="absolute max-w-[160px]  bottom-[-22%] left-[35%] md:left-[39%] -translate-x-1/2    z-10"
            >
              <img
                src="/images/charging.png"
                alt="Charging Cable"
                className="w-full h-auto   object-contain"
              />
            </motion.div>

            {/* 🌟 調整後的橘色標記 'A' */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              // amount 提高到 0.8，確保畫面滾到比較中間時才準備觸發
              viewport={{ once: false, amount: 0.8 }}
              transition={{
                delay: 1.5, // 延遲加長，讓充電線有足夠時間「插好」
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              onClick={() => setIsVideoOpen(true)}
              className="absolute top-[30%] left-[35%] w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer transition-transform z-30 group"
            >
              {/* 標籤主體 */}
              <span className="relative z-10 w-full h-full bg-[#ea580c] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                A
              </span>
              {/* 持續向外擴散的波紋動畫（重複效果） */}
              <span className="absolute inset-0 rounded-full bg-[#ea580c] opacity-75 animate-ping"></span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 🌟 影片彈窗 (Video Modal) */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            // 點擊背景關閉
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              // 防止點擊影片本體時關閉彈窗
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              {/* 關閉按鈕 */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-[#ea580c] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* 嵌入影片 (先隨便放一個 YouTube 範例，可自行替換 src) */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/j9MOH9FR-T8?si=MF8yvPaSzU2lC-tc"
                title="SMASMALL Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ParallaxPage;
