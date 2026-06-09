"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import Copy from "@/components/Copy";

const CALIBRE_VIDEO_ID = "j9MOH9FR-T8";

const ParallaxPage = () => {
  const calibreRef = useRef(null);
  const [markerReady, setMarkerReady] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // sticky 場景：在外層 h-[130vh] 內完成全部動畫，不需額外長版面
  const { scrollYProgress: calibreScrollY } = useScroll({
    target: calibreRef,
    offset: ["start start", "end end"],
  });

  // 主體：前段快速浮現
  const scale = useTransform(calibreScrollY, [0, 0.32], [0.88, 1], {
    clamp: true,
  });
  const opacity = useTransform(calibreScrollY, [0, 0.28], [0, 1], {
    clamp: true,
  });
  const y = useTransform(calibreScrollY, [0, 0.32], ["80px", "0px"], {
    clamp: true,
  });

  // 充電線：從產品正下方滑上插入（終點負值越大，插入越深）
  const cableY = useTransform(calibreScrollY, [0.38, 0.82], ["80px", "-56px"], {
    clamp: true,
  });
  const cableOpacity = useTransform(calibreScrollY, [0.38, 0.52], [0, 1], {
    clamp: true,
  });

  // 充電線插入完成後才顯示 A 標記
  useMotionValueEvent(calibreScrollY, "change", (latest) => {
    setMarkerReady(latest >= 0.86);
  });

  return (
    <div className="relative w-full bg-black font-sans">
      {/* =========================================================
          Section 1: 黑色主視覺 (Hero Section) 
          使用 sticky top-0 讓它固定在頂部，z-0 讓後續區塊可以覆蓋它
          ========================================================= */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
        {/* 標題動畫 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className=" text-[33px] xl:text-[4vmin] text-center font-bold text-white tracking-tighter z-10 leading-none drop-shadow-lg"
        >
          星座系列電動刮鬍刀禮盒
        </motion.h1>
        <Copy>
          <p className="mt-6 text-gray-400 text-center max-w-sm z-10 text-sm drop-shadow-md">
            合金壓鑄手工精心打磨，每處劃痕都是戰損痕跡的力量印記
          </p>
        </Copy>

        {/* 黑色手錶/刮鬍刀的背景圖 */}
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `url('/images/a547d145-6bc1-4dd4-9653-81ee1945b2b8.png')`,
          }}
        />
      </div>

      {/* =========================================================
          Section 2: 橘色文字區塊 (Ethos Section) 
          使用 relative z-10，在滾動時會自然蓋過上面 sticky 的黑色區塊
          ========================================================= */}
      <div className="relative z-10 bg-[#171717] min-h-screen w-full flex flex-col items-center justify-center text-black px-8 py-32 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl text-center space-y-16">
          {/* 使用 whileInView 讓元素進入畫面時觸發動畫 */}
          <Copy>
            <h1 className="text-white">
              Design & Strategy for the Vision-Driven
            </h1>
          </Copy>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-sm text-gray-100 font-mono leading-relaxed">
              WE HAVE METICULOUSLY HONED THE CRITICAL FACETS OF DESIGN AND
              FUNCTIONALITY. EXACTING PRECISION IN OUR LINES, SHAPES, CURVES...
            </p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: 機芯展示 — sticky 場景，130vh 滾動距離內完成動畫 */}
      <div
        ref={calibreRef}
        className="relative z-10 bg-[#ffffff] h-[130vh] shadow-[0_-10px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center z-20"
          >
            <h2 className="text-3xl font-bold text-black tracking-tight mb-1 sm:text-4xl">
              CALIBRE AMB+
            </h2>
            <p className="text-sm text-gray-600 sm:text-base">
              Developed by Weibo Technology
            </p>
          </motion.div>

          <motion.div
            style={{ scale, opacity, y }}
            className="relative z-10 flex w-full max-w-[min(72vw,340px)] flex-col items-center sm:max-w-[460px]"
          >
            <div className="relative w-full">
              <img
                src="/images/accessories/黑夜騎士/黑夜騎士-01.png"
                alt="昔馬黑夜騎士電動刮鬍刀 霧黑機身正面 威柏科技-昔馬電動刮鬍刀總代理"
                className="relative z-10 block w-full h-auto object-contain  "
              />

              <motion.button
                type="button"
                aria-label="播放 CALIBRE AMB+ 介紹影片"
                animate={
                  markerReady
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
                onClick={() => markerReady && setVideoOpen(true)}
                className={`absolute top-[30%] left-[35%] w-8 h-8 bg-[#101010] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20 border-0 p-0 ${
                  markerReady
                    ? "cursor-pointer hover:scale-110 transition-transform"
                    : "pointer-events-none"
                }`}
              >
                A
              </motion.button>
            </div>

            {/* flex 置中：motion 的 y transform 會覆蓋 Tailwind -translate-x-1/2 */}
            <div className="flex w-full justify-center -mt-[10%]">
              <motion.div
                style={{ y: cableY, opacity: cableOpacity }}
                className="w-[18%] pointer-events-none"
              >
                <img
                  src="/images/charging.png"
                  alt="昔馬電動刮鬍刀 Type-C 充電線 威柏科技-昔馬電動刮鬍刀總代理"
                  className="block w-full ml-0 xl:ml-2 h-auto object-contain drop-shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 影片 Popup */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="關閉影片"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white text-xl leading-none hover:bg-black/80 transition-colors"
              >
                ×
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${CALIBRE_VIDEO_ID}?autoplay=1&rel=0`}
                title="昔馬 SMASMALL 捍衛者+ 實測與工藝介紹"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParallaxPage;
