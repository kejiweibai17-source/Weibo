"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Copy from "@/components/Copy";

const HomeScrollSequence01 = dynamic(
  () => import("@/components/home/HomeScrollSequence01"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#08001a] text-sm text-purple-400/60">
        載入 3D 展示…
      </div>
    ),
  },
);

const S3GroomingPrecision = dynamic(
  () => import("@/components/S3GroomingPrecision"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0c] text-sm text-white/50">
        載入產品介紹…
      </div>
    ),
  },
);

const ParallaxPage = ({ productIntroSection = null }) => {
  return (
    <div className="relative w-full bg-black font-sans">
      {productIntroSection ? (
        <div className="sticky top-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          <S3GroomingPrecision section={productIntroSection} />
        </div>
      ) : null}

      {/* 接續區塊：z-10 滑過 sticky 層 */}
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
      </div>

      {/* 3D 刀頭互動區：獨立深紫色區塊 */}
      <div className="relative z-10 w-full">
        <HomeScrollSequence01 />
      </div>
    </div>
  );
};

export default ParallaxPage;
