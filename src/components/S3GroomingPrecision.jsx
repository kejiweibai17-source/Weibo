"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const raw = image.startsWith("/") ? image : `/${image.replace(/^\/+/, "")}`;
  return raw
    .split("/")
    .map((seg, i) => (i === 0 && seg === "" ? "" : encodeURIComponent(seg)))
    .join("/");
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

export default function S3GroomingPrecision({ section }) {
  const [activeId, setActiveId] = useState(null);
  const isMobile = useIsMobile();

  const hotspots =
    section && Array.isArray(section.features) ? section.features : [];
  const specs = section && Array.isArray(section.specs) ? section.specs : [];

  const openHotspot = useCallback((spot) => {
    setActiveId(spot.id);
  }, []);

  const closeHotspot = useCallback(() => {
    setActiveId(null);
  }, []);

  const preloadSrcs = useMemo(() => {
    const list = [];
    const bg = resolveImageSrc(section?.backgroundImage);
    if (bg) list.push(bg);
    const features = Array.isArray(section?.features) ? section.features : [];
    features.forEach((h) => {
      const src = resolveImageSrc(h?.image);
      if (src) list.push(src);
    });
    return [...new Set(list)];
  }, [section]);

  useEffect(() => {
    preloadSrcs.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [preloadSrcs]);

  // 後台未傳 section，或規格／特色皆空 → 不渲染
  if (!section) return null;
  if (hotspots.length === 0 && specs.length === 0) return null;

  const defaultBg = resolveImageSrc(section.backgroundImage);

  const primarySpec = specs[0] ?? null;
  const gridSpecs = specs.slice(1).filter((spec) => Boolean(spec?.value));
  const hasInfoCard = Boolean(primarySpec?.value) || gridSpecs.length > 0;

  const activeIndex = hotspots.findIndex((h) => h.id === activeId);
  const active = activeIndex >= 0 ? hotspots[activeIndex] : null;
  const isDetail = Boolean(active);
  const activeDesc = (active?.description || active?.desc || "").trim();
  const activeThumb = resolveImageSrc(active?.image);
  const subtitle = (section.subtitle || "").trim();

  const showFeatureBg = isDetail && Boolean(activeThumb);
  const backgroundSrc = showFeatureBg ? activeThumb : defaultBg;
  const shouldZoom = isDetail;
  // 手機放大倍率封頂，避免大圖 scale 造成滾動／動畫卡頓
  const rawScale = Number(active?.bgScale) || 2.2;
  const zoomScale = shouldZoom
    ? isMobile
      ? Math.min(rawScale, 1.45)
      : rawScale
    : 1;

  return (
    <div className="relative flex h-screen w-full touch-pan-y select-none items-center justify-center overflow-hidden bg-[#0a0a0c] font-sans">
      {/* 預載全部背景／熱點圖（不 lazy），點擊小圓點時可即時切換 */}
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        {preloadSrcs.map((src) => (
          <Image
            key={`preload-${src}`}
            src={src}
            alt=""
            width={16}
            height={9}
            priority
            quality={isMobile ? 60 : 75}
            sizes="(max-width: 768px) 100vw, 1920px"
          />
        ))}
      </div>

      {/* 背景：next/image 依裝置給較小尺寸；手機約 828px 寬即可 */}
      {backgroundSrc ? (
        <motion.div
          className="pointer-events-none absolute inset-0 h-full w-full"
          animate={{ scale: zoomScale }}
          style={{
            transformOrigin: shouldZoom
              ? `${active?.left || "50%"} ${active?.top || "50%"}`
              : "50% 50%",
            willChange: shouldZoom ? "transform" : "auto",
          }}
          transition={{
            duration: isMobile ? 0.7 : 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={backgroundSrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isMobile ? 0.35 : 0.55, ease: "easeOut" }}
              className="absolute inset-0"
              aria-hidden
            >
              <Image
                src={backgroundSrc}
                alt=""
                fill
                priority
                quality={isMobile ? 60 : 78}
                sizes="(max-width: 768px) 100vw, 1920px"
                className={
                  showFeatureBg ? "object-cover object-center" : "object-contain object-center"
                }
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-black/35"
        aria-hidden
      />

      {isDetail ? (
        <button
          type="button"
          aria-label="關閉細節"
          className="absolute inset-0 z-20 cursor-pointer bg-transparent touch-manipulation"
          onClick={closeHotspot}
        />
      ) : null}

      {/* 熱點：手機縮小點擊區、改用較輕量脈衝，減少滾動卡頓 */}
      <AnimatePresence>
        {!isDetail
          ? hotspots.map((spot, idx) => (
              <motion.div
                key={`dot-${spot.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, delay: 0.04 * idx }}
                className="absolute z-[60]"
                style={{
                  top: spot.top || "50%",
                  left: spot.left || "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  type="button"
                  aria-label={spot.title}
                  className="group relative flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center md:h-14 md:w-14"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openHotspot(spot);
                  }}
                >
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
                  <span
                    className={`pointer-events-none absolute rounded-full bg-white/35 ${
                      isMobile
                        ? "h-7 w-7 opacity-70"
                        : "h-8 w-8 animate-ping"
                    }`}
                    style={
                      isMobile
                        ? {
                            animation: `s3-pulse 2.4s ease-in-out ${0.25 * idx}s infinite`,
                          }
                        : { animationDelay: `${0.3 * idx}s` }
                    }
                  />
                  <span className="pointer-events-none absolute h-9 w-9 rounded-full border border-white/45 transition-transform duration-300 group-hover:scale-125 md:h-10 md:w-10" />
                </button>
              </motion.div>
            ))
          : null}
      </AnimatePresence>

      {hasInfoCard ? (
        <motion.div
          animate={{
            opacity: isDetail ? 0 : 1,
            y: isDetail ? 16 : 0,
          }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-end p-6 md:p-12"
        >
          <div
            className="w-[min(340px,88vw)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md md:backdrop-blur-xl"
            style={{ pointerEvents: isDetail ? "none" : "auto" }}
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
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence>
        {isDetail && active ? (
          <motion.div
            key={`detail-card-${active.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
              delay: isMobile ? 0 : 0.1,
            }}
            className="absolute bottom-6 right-6 z-40 w-[min(320px,88vw)] overflow-hidden rounded-2xl border border-[#d4d4d8] bg-[#ececee] shadow-2xl touch-manipulation md:bottom-12 md:right-12"
          >
            <div className="relative">
              {activeThumb ? (
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={activeThumb}
                    alt={active.title || ""}
                    fill
                    priority
                    quality={isMobile ? 60 : 75}
                    sizes="(max-width: 768px) 88vw, 320px"
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="h-10 w-full" aria-hidden />
              )}
              <button
                type="button"
                aria-label="關閉"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeHotspot();
                }}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e4e4e7] text-slate-500 shadow-sm transition-colors hover:bg-[#d4d4d8] hover:text-slate-800"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5">
              <p className="mb-1.5 text-[11px] tracking-[0.14em] text-slate-500">
                {activeIndex + 1}.{" "}
                {subtitle ? subtitle.toUpperCase() : "PRODUCT FEATURE"}
              </p>
              {active.title ? (
                <h2 className="mb-2 text-lg font-bold leading-snug tracking-wide text-slate-900">
                  {active.title}
                </h2>
              ) : null}
              {activeDesc ? (
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {activeDesc}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes s3-pulse {
              0%, 100% { transform: scale(1); opacity: 0.45; }
              50% { transform: scale(1.35); opacity: 0.15; }
            }
          `,
        }}
      />
    </div>
  );
}
