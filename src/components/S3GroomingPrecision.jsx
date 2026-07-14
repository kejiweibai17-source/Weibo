"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const raw = image.startsWith("/") ? image : `/${image.replace(/^\/+/, "")}`;
  return raw
    .split("/")
    .map((seg, i) => (i === 0 && seg === "" ? "" : encodeURIComponent(seg)))
    .join("/");
}

export default function S3GroomingPrecision({ section }) {
  const [activeId, setActiveId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hotspots =
    section && Array.isArray(section.features) ? section.features : [];
  const specs = section && Array.isArray(section.specs) ? section.specs : [];

  const goPrev = useCallback(() => {
    if (hotspots.length < 2) return;
    setActiveId(null);
    setCurrentIndex((i) => (i - 1 + hotspots.length) % hotspots.length);
  }, [hotspots.length]);

  const goNext = useCallback(() => {
    if (hotspots.length < 2) return;
    setActiveId(null);
    setCurrentIndex((i) => (i + 1) % hotspots.length);
  }, [hotspots.length]);

  const openHotspot = useCallback(
    (spot) => {
      const idx = hotspots.findIndex((h) => h.id === spot.id);
      if (idx >= 0) setCurrentIndex(idx);
      setActiveId(spot.id);
    },
    [hotspots],
  );

  // 後台未傳 section，或規格／特色皆空 → 不渲染
  if (!section) return null;
  if (hotspots.length === 0 && specs.length === 0) return null;

  const safeIndex =
    hotspots.length > 0
      ? ((currentIndex % hotspots.length) + hotspots.length) % hotspots.length
      : 0;
  const currentFeature = hotspots[safeIndex] ?? null;

  const backgroundSrc =
    resolveImageSrc(currentFeature?.image) ||
    resolveImageSrc(section.backgroundImage) ||
    "";

  const primarySpec = specs[0] ?? null;
  const gridSpecs = specs.slice(1).filter((spec) => {
    if (!spec?.value) return false;
    if (spec.label === "核心功能") return false;
    return true;
  });

  const hasInfoCard =
    Boolean(primarySpec?.value) ||
    Boolean(currentFeature?.title) ||
    gridSpecs.length > 0 ||
    hotspots.length > 1;

  const active = hotspots.find((h) => h.id === activeId) ?? null;
  const isDetail = Boolean(active);
  const activeDesc = (active?.description || active?.desc || "").trim();
  const subtitle = (section.subtitle || "").trim();

  return (
    <div className="relative flex h-screen w-full select-none items-center justify-center overflow-hidden font-sans bg-[#0a0a0c]">
      {/* 背景：僅在後台有圖時顯示 */}
      {backgroundSrc ? (
        <motion.div
          className="pointer-events-none absolute inset-0 h-full w-full"
          animate={{ scale: isDetail ? Number(active?.bgScale) || 2.2 : 1 }}
          style={{
            transformOrigin: isDetail
              ? `${active?.left || "50%"} ${active?.top || "50%"}`
              : "50% 50%",
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${safeIndex}-${backgroundSrc}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${backgroundSrc}")` }}
              aria-hidden
            />
          </AnimatePresence>
        </motion.div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-black/35" aria-hidden />

      {isDetail ? (
        <button
          type="button"
          aria-label="關閉細節"
          className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          onClick={() => setActiveId(null)}
        />
      ) : null}

      <AnimatePresence mode="wait">
        {!isDetail && currentFeature ? (
          <motion.div
            key={`dot-${currentFeature.id}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
            className="absolute z-[60]"
            style={{
              top: currentFeature.top || "50%",
              left: currentFeature.left || "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              type="button"
              aria-label={currentFeature.title}
              className="group relative flex h-14 w-14 cursor-pointer items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openHotspot(currentFeature);
              }}
            >
              <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
              <span className="pointer-events-none absolute h-8 w-8 animate-ping rounded-full bg-white/35" />
              <span className="pointer-events-none absolute h-10 w-10 rounded-full border border-white/45 transition-transform duration-300 group-hover:scale-125" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {hasInfoCard ? (
        <motion.div
          animate={{
            opacity: isDetail ? 0 : 1,
            y: isDetail ? 16 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-end p-6 md:p-12"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="w-[min(340px,88vw)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
            style={{
              pointerEvents: isDetail ? "none" : "auto",
            }}
          >
            <div className="border-b border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-bold tracking-widest text-white">
                產品資訊
              </h3>
            </div>

            <div className="p-5">
              {primarySpec?.value ? (
                <div className="mb-4">
                  {primarySpec.label ? (
                    <p className="mb-1 text-xs tracking-wider text-gray-500">
                      {primarySpec.label}
                    </p>
                  ) : null}
                  <p className="text-lg text-white">{primarySpec.value}</p>
                </div>
              ) : null}

              {currentFeature?.title ? (
                <div className="mb-4">
                  <p className="mb-1 text-xs tracking-wider text-gray-500">
                    核心功能
                  </p>
                  <p className="text-base font-medium text-white">
                    {currentFeature.title}
                  </p>
                </div>
              ) : null}

              {gridSpecs.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {gridSpecs.map((spec) => (
                    <div key={`${spec.label}-${spec.value}`}>
                      {spec.label ? (
                        <p className="mb-1 text-[10px] tracking-wider text-gray-500">
                          {spec.label}
                        </p>
                      ) : null}
                      <p className="text-sm font-medium text-gray-200">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {hotspots.length > 1 ? (
              <div className="flex border-t border-white/10 bg-black/20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 border-r border-white/10 py-4 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm font-medium">上一個</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goNext();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 py-4 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="text-sm font-medium">下一個</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence>
        {isDetail && active ? (
          <motion.div
            key={`detail-copy-${active.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            className="pointer-events-none absolute right-6 bottom-6 z-40 w-[min(360px,88vw)] text-right md:right-12 md:bottom-12"
          >
            {subtitle ? (
              <p className="mb-2 text-xs tracking-widest text-gray-400 uppercase">
                {subtitle}
              </p>
            ) : null}
            {active.title ? (
              <h2 className="mb-3 text-xl font-bold tracking-wide text-white md:text-2xl">
                {active.title}
              </h2>
            ) : null}
            {activeDesc ? (
              <p className="text-sm leading-relaxed text-gray-300">
                {activeDesc}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
