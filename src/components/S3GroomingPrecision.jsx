"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HOME_PRODUCT_INTRO_FEATURES_FALLBACK } from "@/data/home-product-intro-fallback";

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image.replace(/^\/+/, "")}`;
}

export default function S3GroomingPrecision({ section }) {
  const [activeId, setActiveId] = useState(null);

  if (!section) return null;

  const backgroundSrc =
    resolveImageSrc(section.backgroundImage) || "/images/s3-detail-bg.webp";
  const primarySpec = section.specs?.[0];
  const gridSpecs = section.specs?.slice(1) ?? [];
  const hotspots =
    Array.isArray(section.features) && section.features.length > 0
      ? section.features
      : HOME_PRODUCT_INTRO_FEATURES_FALLBACK;
  const active = hotspots.find((h) => h.id === activeId) ?? null;
  const isDetail = Boolean(active);
  const activeImage = active ? resolveImageSrc(active.image) : "";
  const activeDesc = active?.description || active?.desc || "";

  return (
    <div className="relative flex h-screen w-full select-none items-center justify-center overflow-hidden font-sans">
      {/* 背景：點擊熱點後朝該點放大 + 變暗 */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          scale: isDetail ? active.bgScale : 1,
          filter: isDetail ? "brightness(0.45)" : "brightness(1)",
        }}
        style={{
          transformOrigin: isDetail
            ? `${active.left} ${active.top}`
            : "50% 50%",
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundSrc})` }}
          aria-hidden
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/35" aria-hidden />

      {/* 高斯透明遮罩（細節模式） */}
      <AnimatePresence>
        {isDetail && (
          <motion.button
            type="button"
            aria-label="關閉細節"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-20 cursor-pointer bg-black/40 backdrop-blur-md"
            onClick={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>

      {/* 閃爍熱點 */}
      <AnimatePresence>
        {!isDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
          >
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                aria-label={spot.title}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center group cursor-pointer"
                style={{ top: spot.top, left: spot.left }}
                onClick={() => setActiveId(spot.id)}
              >
                <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
                <span className="absolute h-8 w-8 animate-ping rounded-full bg-white/35" />
                <span className="absolute h-10 w-10 rounded-full border border-white/45 transition-transform duration-300 group-hover:scale-125" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 左下產品資訊（全視角） */}
      <motion.div
        animate={{
          opacity: isDetail ? 0 : 1,
          y: isDetail ? 16 : 0,
          pointerEvents: isDetail ? "none" : "auto",
        }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12"
      >
        <div className="pointer-events-auto w-[min(340px,88vw)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-bold tracking-widest text-white">
              產品資訊
            </h3>
          </div>
          <div className="p-5">
            {primarySpec ? (
              <div className="mb-4">
                <p className="mb-1 text-xs tracking-wider text-gray-500">
                  {primarySpec.label}
                </p>
                <p className="text-lg text-white">{primarySpec.value}</p>
              </div>
            ) : null}
            {gridSpecs.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {gridSpecs.map((spec) => (
                  <div key={`${spec.label}-${spec.value}`}>
                    <p className="mb-1 text-[10px] tracking-wider text-gray-500">
                      {spec.label}
                    </p>
                    <p className="text-sm font-medium text-gray-200">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* 細節面板：標題 + 說明 + 素材圖 */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-6 bottom-6 z-40 w-[min(360px,90vw)] md:right-12 md:bottom-12"
          >
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/55 shadow-2xl backdrop-blur-xl">
              <div className="relative aspect-[4/3] w-full bg-black/40">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={active.title}
                    fill
                    sizes="360px"
                    className="object-contain p-4"
                  />
                ) : null}
                <button
                  type="button"
                  aria-label="關閉"
                  onClick={() => setActiveId(null)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-white/15"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 md:p-6">
                <h2 className="mb-2 text-lg font-bold tracking-wide text-white md:text-xl">
                  {active.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-300">
                  {activeDesc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
