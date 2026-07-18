"use client";

import React, { useCallback, useState } from "react";
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

export default function S3GroomingPrecision({ section }) {
  const [activeId, setActiveId] = useState(null);

  const hotspots =
    section && Array.isArray(section.features) ? section.features : [];
  const specs = section && Array.isArray(section.specs) ? section.specs : [];

  const openHotspot = useCallback((spot) => {
    setActiveId(spot.id);
  }, []);

  const closeHotspot = useCallback(() => {
    setActiveId(null);
  }, []);

  // 後台未傳 section，或規格／特色皆空 → 不渲染
  if (!section) return null;
  if (hotspots.length === 0 && specs.length === 0) return null;

  const primarySpec = specs[0] ?? null;
  const gridSpecs = specs.slice(1).filter((spec) => Boolean(spec?.value));

  const hasInfoCard = Boolean(primarySpec?.value) || gridSpecs.length > 0;

  const activeIndex = hotspots.findIndex((h) => h.id === activeId);
  const active = activeIndex >= 0 ? hotspots[activeIndex] : null;
  const isDetail = Boolean(active);
  const activeDesc = (active?.description || active?.desc || "").trim();
  const activeThumb = resolveImageSrc(active?.image);
  const subtitle = (section.subtitle || "").trim();

  // 預設背景完全使用後台設定；點擊熱點後換成該特色圖，關閉時還原
  const defaultBg = resolveImageSrc(section.backgroundImage);
  const showFeatureBg = isDetail && Boolean(activeThumb);
  const backgroundSrc = showFeatureBg ? activeThumb : defaultBg;
  // 展開資訊時，不論是否切換特色圖，都依後台倍率朝熱點位置放大
  const shouldZoom = isDetail;

  return (
    <div className="relative flex h-screen w-full select-none items-center justify-center overflow-hidden bg-[#0a0a0c] font-sans">
      {/* 背景：預設固定一張；點擊熱點後淡入該特色圖，關閉時還原 */}
      {backgroundSrc ? (
        <motion.div
          className="pointer-events-none absolute inset-0 h-full w-full"
          animate={{ scale: shouldZoom ? Number(active?.bgScale) || 2.2 : 1 }}
          style={{
            transformOrigin: shouldZoom
              ? `${active?.left || "50%"} ${active?.top || "50%"}`
              : "50% 50%",
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={backgroundSrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className={`absolute inset-0 bg-center bg-no-repeat ${
                showFeatureBg ? "bg-cover" : "bg-contain"
              }`}
              style={{ backgroundImage: `url("${backgroundSrc}")` }}
              aria-hidden
            />
          </AnimatePresence>
        </motion.div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-black/35"
        aria-hidden
      />

      {/* 細節模式：點背景任意處關閉 */}
      {isDetail ? (
        <button
          type="button"
          aria-label="關閉細節"
          className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          onClick={closeHotspot}
        />
      ) : null}

      {/* 熱點：一開始全部顯示、持續閃爍 */}
      <AnimatePresence>
        {!isDetail
          ? hotspots.map((spot, idx) => (
              <motion.div
                key={`dot-${spot.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
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
                  className="group relative flex h-14 w-14 cursor-pointer items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openHotspot(spot);
                  }}
                >
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
                  <span
                    className="pointer-events-none absolute h-8 w-8 animate-ping rounded-full bg-white/35"
                    style={{ animationDelay: `${0.3 * idx}s` }}
                  />
                  <span className="pointer-events-none absolute h-10 w-10 rounded-full border border-white/45 transition-transform duration-300 group-hover:scale-125" />
                </button>
              </motion.div>
            ))
          : null}
      </AnimatePresence>

      {/* 左側資訊欄（無上一個／下一個） */}
      {hasInfoCard ? (
        <motion.div
          animate={{
            opacity: isDetail ? 0 : 1,
            y: isDetail ? 16 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-end p-6 md:p-12"
        >
          <div
            className="w-[min(340px,88vw)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
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

      {/* 點擊熱點後的資訊卡（右下，含縮圖＋編號＋標題＋說明＋關閉） */}
      <AnimatePresence>
        {isDetail && active ? (
          <motion.div
            key={`detail-card-${active.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15,
            }}
            className="absolute bottom-6 right-6 z-40 w-[min(320px,88vw)] overflow-hidden rounded-2xl border border-[#d4d4d8] bg-[#ececee] shadow-2xl md:bottom-12 md:right-12"
          >
            {/* 縮圖區 */}
            <div className="relative">
              {activeThumb ? (
                <div
                  className="aspect-[16/10] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${activeThumb}")` }}
                  aria-hidden
                />
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

            {/* 文字區 */}
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
    </div>
  );
}
