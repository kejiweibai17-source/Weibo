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

const VIDEO_ID = "j9MOH9FR-T8";

const ParallaxPage = () => {
  const calibreRef = useRef(null);
  const [markerReady, setMarkerReady] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const { scrollYProgress: calibreScrollY } = useScroll({
    target: calibreRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(calibreScrollY, [0, 0.32], [0.88, 1], {
    clamp: true,
  });
  const opacity = useTransform(calibreScrollY, [0, 0.28], [0, 1], {
    clamp: true,
  });
  const y = useTransform(calibreScrollY, [0, 0.32], ["80px", "0px"], {
    clamp: true,
  });
  const cableY = useTransform(calibreScrollY, [0.38, 0.82], ["80px", "-56px"], {
    clamp: true,
  });
  const cableOpacity = useTransform(calibreScrollY, [0.38, 0.52], [0, 1], {
    clamp: true,
  });

  useMotionValueEvent(calibreScrollY, "change", (latest) => {
    setMarkerReady(latest >= 0.86);
  });

  return (
    <div className="relative w-full bg-black font-sans">
      {/* Section 1: 主視覺 */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-[33px] xl:text-[4rem] text-center font-bold text-white tracking-tighter z-10 leading-none drop-shadow-lg"
        >
          完美紳士 MATEBOX 3in1
        </motion.h1>
        <Copy>
          <p className="mt-6 text-gray-400 text-center max-w-sm z-10 text-sm drop-shadow-md">
            鐵系列波紋合金三機禮盒，致敬每一個為更好生活而奮鬥的人
          </p>
        </Copy>

        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `url('/images/accessories/完美紳士/情境圖/玩美-3.jpg')`,
          }}
        />
      </div>

      {/* Section 2: 深色文字區塊 */}
      <div className="relative z-10 bg-[#171717] min-h-screen w-full flex flex-col items-center justify-center text-black px-8 py-32 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl text-center space-y-16">
          <Copy>
            <h1 className="text-white">為完美紳士而生的設計與工藝</h1>
          </Copy>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-sm text-gray-100 font-mono leading-relaxed">
              從鑄造波紋壓花全合金機身，到三機同系列設計語言。
              鑰匙圈迷你刀、電動鼻毛刀、旗艦刮鬍刀三合一——
              每一個細節，皆為追求完美儀態的現代紳士而精煉…
            </p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: 產品展示 */}
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
              完美紳士
            </h2>
            <p className="text-sm text-gray-600 sm:text-base">MATEBOX 3in1</p>
          </motion.div>

          <motion.div
            style={{ scale, opacity, y }}
            className="relative z-10 flex w-full max-w-[min(72vw,340px)] flex-col items-center sm:max-w-[460px]"
          >
            <div className="relative w-full">
              <img
                src="/images/accessories/完美紳士/產品內容物/完美紳士-2.png"
                alt="昔馬完美紳士 波紋合金電動刮鬍刀 威柏科技-昔馬電動刮鬍刀總代理"
                className="relative z-10 block w-full h-auto object-contain"
              />

              <motion.button
                type="button"
                aria-label="播放完美紳士 MATEBOX 介紹影片"
                animate={
                  markerReady
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
                onClick={() => markerReady && setVideoOpen(true)}
                className={`absolute top-[30%] left-[35%] w-8 h-8 bg-[#101010] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20 border-0 p-0 ${markerReady ? "cursor-pointer hover:scale-110 transition-transform" : "pointer-events-none"}`}
              >
                A
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxPage;
