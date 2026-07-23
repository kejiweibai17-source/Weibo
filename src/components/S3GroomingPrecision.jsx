"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/** 後台百分比依此桌機比例校正（全螢幕 + object-contain） */
const DESKTOP_REF = { w: 1920, h: 1080 };

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const raw = image.startsWith("/") ? image : `/${image.replace(/^\/+/, "")}`;
  return raw
    .split("/")
    .map((seg, i) => (i === 0 && seg === "" ? "" : encodeURIComponent(seg)))
    .join("/");
}

function parsePercent(value, fallback = 50) {
  const n = parseFloat(String(value ?? "").replace("%", ""));
  return Number.isFinite(n) ? n : fallback;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // 僅依寬度切換座標系，避免 touch desktop 誤判
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

/** 計算 object-contain 後，圖片在容器內的實際矩形 */
function computeContainRect(cw, ch, iw, ih) {
  if (!cw || !ch || !iw || !ih) return null;
  const containerRatio = cw / ch;
  const imageRatio = iw / ih;
  if (containerRatio > imageRatio) {
    const height = ch;
    const width = ch * imageRatio;
    return { width, height, left: (cw - width) / 2, top: 0 };
  }
  const width = cw;
  const height = cw / imageRatio;
  return { width, height, left: 0, top: (ch - height) / 2 };
}

/**
 * 桌機全螢幕 % → 手機全螢幕 %
 * 先對到圖片同一像素，再映到目前手機的 object-contain 位置。
 */
function mapDesktopPercentToViewport(
  leftStr,
  topStr,
  iw,
  ih,
  viewW,
  viewH,
  refW = DESKTOP_REF.w,
  refH = DESKTOP_REF.h,
) {
  const leftPct = parsePercent(leftStr);
  const topPct = parsePercent(topStr);
  const refRect = computeContainRect(refW, refH, iw, ih);
  const viewRect = computeContainRect(viewW, viewH, iw, ih);
  if (!refRect || !viewRect) {
    return { left: `${leftPct}%`, top: `${topPct}%` };
  }

  const x = (leftPct / 100) * refW;
  const y = (topPct / 100) * refH;
  const u = (x - refRect.left) / refRect.width;
  const v = (y - refRect.top) / refRect.height;

  const mx = viewRect.left + u * viewRect.width;
  const my = viewRect.top + v * viewRect.height;

  return {
    left: `${(mx / viewW) * 100}%`,
    top: `${(my / viewH) * 100}%`,
  };
}

function useImageNaturalSize(imageSrc) {
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!imageSrc) {
      setNatural({ w: 0, h: 0 });
      return undefined;
    }
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (!cancelled) {
        setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
    img.onerror = () => {
      if (!cancelled) setNatural({ w: 0, h: 0 });
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return natural;
}

function useStageSize(containerRef) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return size;
}

export default function S3GroomingPrecision({ section }) {
  const [activeId, setActiveId] = useState(null);
  const isMobile = useIsMobile();
  const stageRef = useRef(null);

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
    <S3GroomingPrecisionView
      stageRef={stageRef}
      defaultBg={defaultBg}
      backgroundSrc={backgroundSrc}
      showFeatureBg={showFeatureBg}
      shouldZoom={shouldZoom}
      zoomScale={zoomScale}
      active={active}
      isMobile={isMobile}
      isDetail={isDetail}
      hotspots={hotspots}
      preloadSrcs={preloadSrcs}
      hasInfoCard={hasInfoCard}
      primarySpec={primarySpec}
      gridSpecs={gridSpecs}
      activeIndex={activeIndex}
      activeDesc={activeDesc}
      activeThumb={activeThumb}
      subtitle={subtitle}
      openHotspot={openHotspot}
      closeHotspot={closeHotspot}
    />
  );
}

/** 分離 view，讓 size / natural hook 在 early-return 之後也能穩定呼叫 */
function S3GroomingPrecisionView({
  stageRef,
  defaultBg,
  backgroundSrc,
  showFeatureBg,
  shouldZoom,
  zoomScale,
  active,
  isMobile,
  isDetail,
  hotspots,
  preloadSrcs,
  hasInfoCard,
  primarySpec,
  gridSpecs,
  activeIndex,
  activeDesc,
  activeThumb,
  subtitle,
  openHotspot,
  closeHotspot,
}) {
  const natural = useImageNaturalSize(defaultBg);
  const stageSize = useStageSize(stageRef);

  const mappedHotspots = useMemo(() => {
    if (!isMobile) {
      return hotspots.map((spot) => ({
        ...spot,
        left: spot.left || "50%",
        top: spot.top || "50%",
      }));
    }
    if (!natural.w || !natural.h || !stageSize.w || !stageSize.h) {
      return null;
    }
    return hotspots.map((spot) => {
      const pos = mapDesktopPercentToViewport(
        spot.left,
        spot.top,
        natural.w,
        natural.h,
        stageSize.w,
        stageSize.h,
      );
      return { ...spot, left: pos.left, top: pos.top };
    });
  }, [hotspots, isMobile, natural.h, natural.w, stageSize.h, stageSize.w]);

  // 放大原點：手機要用換算後座標，才會對準同一零件
  const zoomOriginLeft = isMobile
    ? mappedHotspots?.find((s) => s.id === active?.id)?.left ||
      active?.left ||
      "50%"
    : active?.left || "50%";
  const zoomOriginTop = isMobile
    ? mappedHotspots?.find((s) => s.id === active?.id)?.top ||
      active?.top ||
      "50%"
    : active?.top || "50%";

  return (
    <div
      ref={stageRef}
      className="relative flex h-screen w-full touch-pan-y select-none items-center justify-center overflow-hidden bg-[#0a0a0c] font-sans"
    >
      <div
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden
      >
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

      {/* 預設爆炸圖：桌機／手機皆全螢幕 object-contain（與上一版桌機相同） */}
      {!showFeatureBg && backgroundSrc ? (
        <motion.div
          className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
          style={{
            transformOrigin: shouldZoom
              ? `${zoomOriginLeft} ${zoomOriginTop}`
              : "50% 50%",
            willChange: shouldZoom ? "transform" : "auto",
          }}
          animate={{ scale: zoomScale }}
          transition={{
            duration: isMobile ? 0.7 : 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="absolute inset-0" aria-hidden>
            <Image
              src={backgroundSrc}
              alt=""
              fill
              priority
              quality={isMobile ? 60 : 78}
              sizes="(max-width: 768px) 100vw, 1920px"
              className="object-contain object-center"
            />
          </div>
        </motion.div>
      ) : null}

      {showFeatureBg && backgroundSrc ? (
        <motion.div
          className="pointer-events-none absolute inset-0 h-full w-full"
          animate={{ scale: zoomScale }}
          style={{
            transformOrigin: shouldZoom
              ? `${zoomOriginLeft} ${zoomOriginTop}`
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
                className="object-cover object-center"
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

      {/* 熱點：桌機用後台原 %；手機換算到同一圖片像素 */}
      <AnimatePresence>
        {!isDetail && mappedHotspots ? (
          <motion.div
            key="hotspot-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 z-[60]"
          >
            {mappedHotspots.map((spot, idx) => (
              <motion.button
                key={`dot-${spot.id}`}
                type="button"
                aria-label={spot.title}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.04 * idx }}
                className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center md:h-14 md:w-14"
                style={{
                  top: spot.top,
                  left: spot.left,
                  pointerEvents: "auto",
                }}
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
              </motion.button>
            ))}
          </motion.div>
        ) : null}
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
