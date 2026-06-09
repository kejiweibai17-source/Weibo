"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const FRAME_COUNT = 150;
const FRAME_BASE = "/3d/01";

function frameSrc(index) {
  return `${FRAME_BASE}/${String(index).padStart(4, "0")}.png`;
}

const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  frameSrc(i + 1),
);

const HOTSPOTS = [
  {
    id: "type-c-charging",
    frame: 50,
    frameRange: [44, 58],
    x: "54%",
    y: "36%",
    cardAnchor: "right",
    info: {
      title: "Type-C 快速充電",
      subtitle: "1 小時充滿，3 分鐘閃充應急",
      description:
        "昔馬 SMASMALL 電動刮鬍刀採用 Type-C 充電。充電前請先關閉電源，使用 BSMI 認證的 5V/1A 或 5V/2A 充電器連接 Type-C 埠即可充電。充飽約需 1 小時；3 分鐘閃充可應急使用約 10 分鐘。",
      image: "/images/type-c-快速充電.png",
      imageAlt: "Type-C 快速充電說明圖 昔馬電動刮鬍刀 3 分鐘閃充 威柏科技-昔馬電動刮鬍刀總代理",

      notices: [
        "請使用 5V/1A 或 5V/2A 充電頭，勿使用 9V、20V 等快充頭，以免損壞機身或主機板。",
        "充電前請確認刮鬍刀完全乾燥，切勿在充電時清洗或帶進浴室使用。",
        "充電時請避免放置在潮濕、高溫的環境中。",
      ],
    },
  },
  {
    id: "alloy-body",
    frame: 130,
    frameRange: [122, 138],
    x: "46%",
    y: "52%",
    cardAnchor: "left",
    info: {
      title: "全合金機身",
      subtitle: "高溫壓鑄，硬派質感",
      description:
        "採用獨創高溫壓鑄全合金機身，手感沉穩冰冷，經細緻打磨處理，每一處曲面都展現復古未來主義美學。",
      image: "/images/a547d145-6bc1-4dd4-9653-81ee1945b2b8.png",
      imageAlt: "全合金壓鑄機身貼臉使用特寫 昔馬電動刮鬍刀 IPX7 防水 威柏科技-昔馬電動刮鬍刀總代理",
      specs: [
        { label: "機身材質", value: "全合金壓鑄" },
        { label: "表面處理", value: "細緻打磨" },
        { label: "防水等級", value: "IPX7 全機防水" },
      ],
      cta: { label: "了解更多", href: "/product01" },
    },
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** 記憶體快取 + 背景預載，減少滾動換幀卡頓 */
const frameCache = new Map();
const frameLoading = new Map();

function isFrameDecoded(img) {
  return Boolean(img?.complete && img.naturalWidth > 0);
}

function ensureFrame(index) {
  const idx = Math.max(0, Math.min(FRAME_COUNT - 1, index));
  if (frameCache.has(idx)) return Promise.resolve(frameCache.get(idx));

  const pending = frameLoading.get(idx);
  if (pending) return pending;

  const promise = new Promise((resolve) => {
    const img = new window.Image();
    const finish = async () => {
      frameLoading.delete(idx);
      try {
        await img.decode();
      } catch {
        /* ignore */
      }
      if (isFrameDecoded(img)) frameCache.set(idx, img);
      resolve(frameCache.get(idx) ?? null);
    };
    img.onload = finish;
    img.onerror = finish;
    img.src = FRAME_PATHS[idx];
    if (isFrameDecoded(img)) finish();
  });

  frameLoading.set(idx, promise);
  return promise;
}

function prefetchFrames(centerIndex, radius = 8) {
  for (let i = centerIndex - radius; i <= centerIndex + radius; i += 1) {
    if (i >= 0 && i < FRAME_COUNT) ensureFrame(i);
  }
}

function preloadAllFramesInBackground() {
  let index = 0;
  let cancelled = false;
  const concurrency = 3;
  let active = 0;

  const pump = () => {
    if (cancelled) return;
    while (active < concurrency && index < FRAME_COUNT) {
      const current = index;
      index += 1;
      active += 1;
      ensureFrame(current).finally(() => {
        active -= 1;
        pump();
      });
    }
  };

  pump();
  return () => {
    cancelled = true;
  };
}

function hotspotMarkerOpacity(frameIndex, [min, max]) {
  const pad = 6;
  if (frameIndex < min - pad || frameIndex > max + pad) return 0;
  if (frameIndex < min) return (frameIndex - (min - pad)) / pad;
  if (frameIndex > max) return (max + pad - frameIndex) / pad;
  return 1;
}

/** 雙層 img：載好下一幀才切換，避免空白；object-cover 滿版裁切 */
const SequenceFrame = memo(function SequenceFrame({ frontRef, backRef }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={frontRef}
        alt="昔馬電動刮鬍刀 360 度 3D 互動展示 威柏科技-昔馬電動刮鬍刀總代理"
        className="absolute inset-0 z-10 h-full w-full object-cover object-center"
        decoding="async"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={backRef}
        alt=""
        aria-hidden
        className="absolute inset-0 z-10 h-full w-full object-cover object-center opacity-0"
        decoding="async"
        draggable={false}
      />
    </>
  );
});

function HotspotMarker({ hotspot, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`查看 ${hotspot.info.title} 說明`}
      aria-expanded={isActive}
      className={[
        "pointer-events-auto absolute z-50 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-white/80 bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
        "transition-transform duration-300 hover:scale-110",
        isActive ? "scale-110 ring-4 ring-[#00B4D8]/30" : "",
      ].join(" ")}
      style={{ left: hotspot.x, top: hotspot.y }}
    >
      <span className="text-lg font-light leading-none">
        {isActive ? "×" : "+"}
      </span>
    </button>
  );
}

function InfoPanel({ hotspot, onClose }) {
  const { info } = hotspot;

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[60] hidden animate-[fadeUp_0.35s_ease-out] md:flex md:justify-center md:px-4 md:pb-4">
      <div className="w-full  max-w-[650px]   border border-gray-100 bg-white shadow-[0_-16px_48px_rgba(0,0,0,0.12)] ">
        <div className="flex w-full flex-col px-6 py-7 md:px-8 md:py-8">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                {info.title}
              </h3>
              {info.subtitle && (
                <p className="mt-1.5 text-sm text-gray-500 md:text-base">
                  {info.subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {info.image && (
            <div className="relative mb-6  w-full overflow-hidden bg-gray-50  ">
              <Image
                src={info.image}
                alt={info.imageAlt ?? `${info.title} 昔馬電動刮鬍刀 威柏科技-昔馬電動刮鬍刀總代理`}
                width={1300}
                height={600}
                className=" w-full"
              />
            </div>
          )}

          <p className="mb-6 w-full text-[15px] leading-relaxed text-gray-600 md:text-base md:leading-loose">
            {info.description}
          </p>

          {info.specs?.length > 0 && (
            <ul className="grid w-full grid-cols-1 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
              {info.specs.map((spec) => (
                <li key={spec.label} className="  bg-gray-50 px-4 py-3 text-sm">
                  <span className="block font-semibold text-gray-800">
                    {spec.label}
                  </span>
                  <span className="mt-0.5 block text-gray-600">
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {info.statusLights?.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                狀態燈號
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {info.statusLights.map((item) => (
                  <li key={item.label} className="flex gap-2">
                    <span className="shrink-0 font-medium text-gray-800">
                      {item.label}：
                    </span>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {info.notices?.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                充電注意事項
              </p>
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-gray-600">
                {info.notices.map((notice) => (
                  <li key={notice}>{notice}</li>
                ))}
              </ul>
            </div>
          )}

          {info.cta && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <Link
                href={info.cta.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-900 px-5 py-2 text-sm font-semibold tracking-wide text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                {info.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileInfoPanel({ hotspot, onClose }) {
  const { info } = hotspot;

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-[70] flex animate-[fadeUp_0.35s_ease-out] justify-center px-4 pb-4 md:hidden">
      <div className="w-full max-w-[600px] overflow-hidden   border border-gray-100 bg-white shadow-[0_-16px_48px_rgba(0,0,0,0.15)]">
        <div className="flex w-full flex-col px-5 py-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
              {info.subtitle && (
                <p className="mt-1 text-sm text-gray-500">{info.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="text-xl leading-none text-gray-400"
            >
              ×
            </button>
          </div>

          {info.image && (
            <div className="relative mb-4 w-full overflow-hidden  bg-gray-50">
              <Image
                src={info.image}
                alt={info.imageAlt ?? `${info.title} 昔馬電動刮鬍刀 威柏科技-昔馬電動刮鬍刀總代理`}
                width={1000}
                height={400}
                className="w-full"
              />
            </div>
          )}

          <p className="mb-4 w-full text-[14px] leading-relaxed text-gray-600">
            {info.description}
          </p>

          {info.specs?.length > 0 && (
            <ul className="grid w-full gap-2 border-t border-gray-100 pt-4">
              {info.specs.map((spec) => (
                <li
                  key={spec.label}
                  className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold text-gray-800">
                    {spec.label}
                  </span>
                  <span className="ml-1 text-gray-600">{spec.value}</span>
                </li>
              ))}
            </ul>
          )}

          {info.cta && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <Link
                href={info.cta.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900"
              >
                {info.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeScrollSequence01() {
  const sectionRef = useRef(null);
  const frameFrontRef = useRef(null);
  const frameBackRef = useRef(null);
  const activeLayerRef = useRef("front");
  const progressRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const lastFrameIndexRef = useRef(-1);
  const scrollDirRef = useRef(1);
  const hotspotRefs = useRef([]);

  const [openHotspotId, setOpenHotspotId] = useState(null);
  const openHotspotIdRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  openHotspotIdRef.current = openHotspotId;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setFrame = useCallback((exactIndex) => {
    const frameIndex = Math.round(
      Math.max(0, Math.min(FRAME_COUNT - 1, exactIndex)),
    );

    if (frameIndex !== lastFrameIndexRef.current) {
      scrollDirRef.current = frameIndex >= lastFrameIndexRef.current ? 1 : -1;
    }

    if (frameIndex === lastFrameIndexRef.current) return;

    const path = FRAME_PATHS[frameIndex];
    const front = frameFrontRef.current;
    const back = frameBackRef.current;
    if (!front || !back) return;

    const active = activeLayerRef.current === "front" ? front : back;
    const buffer = activeLayerRef.current === "front" ? back : front;

    if (active.src.endsWith(path)) {
      lastFrameIndexRef.current = frameIndex;
      prefetchFrames(frameIndex, 10);
      return;
    }

    const swap = () => {
      buffer.style.opacity = "1";
      active.style.opacity = "0";
      activeLayerRef.current =
        activeLayerRef.current === "front" ? "back" : "front";
      lastFrameIndexRef.current = frameIndex;
    };

    const applyToBuffer = () => {
      if (buffer.src.endsWith(path) && buffer.complete) {
        swap();
        return;
      }
      buffer.onload = () => {
        buffer.onload = null;
        swap();
      };
      buffer.src = path;
    };

    if (frameCache.has(frameIndex)) {
      applyToBuffer();
    } else {
      ensureFrame(frameIndex).then(() => applyToBuffer());
    }

    const ahead = scrollDirRef.current > 0 ? 12 : -12;
    prefetchFrames(frameIndex + ahead, 6);
    prefetchFrames(frameIndex, 8);
  }, []);

  const updateHotspots = useCallback((exactFrame) => {
    HOTSPOTS.forEach((hotspot, index) => {
      const el = hotspotRefs.current[index];
      if (!el) return;

      const opacity = hotspotMarkerOpacity(exactFrame, hotspot.frameRange);
      gsap.set(el, {
        autoAlpha: opacity,
        scale: 0.85 + opacity * 0.15,
      });
    });

    const openId = openHotspotIdRef.current;
    if (openId) {
      const openHotspot = HOTSPOTS.find((h) => h.id === openId);
      if (openHotspot) {
        const stillVisible =
          hotspotMarkerOpacity(exactFrame, openHotspot.frameRange) > 0.2;
        if (!stillVisible) setOpenHotspotId(null);
      }
    }
  }, []);

  const paint = useCallback(
    (progress) => {
      scrollProgressRef.current = progress;
      const exactFrame = progress * (FRAME_COUNT - 1);
      setFrame(exactFrame);
      updateHotspots(exactFrame);
    },
    [setFrame, updateHotspots],
  );

  const paintRef = useRef(paint);
  paintRef.current = paint;

  useEffect(() => {
    const front = frameFrontRef.current;
    if (front) {
      front.src = FRAME_PATHS[0];
      lastFrameIndexRef.current = 0;
    }
    prefetchFrames(0, 10);
    prefetchFrames(49, 5);
    prefetchFrames(129, 5);
    const cancelPreload = preloadAllFramesInBackground();
    return cancelPreload;
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return undefined;

      const pinDistance = Math.max(window.innerHeight * 7, FRAME_COUNT * 56);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            paintRef.current(self.progress);
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      tl.to({}, { duration: 1 });

      const st = tl.scrollTrigger;
      if (st) {
        scrollProgressRef.current = st.progress;
        requestAnimationFrame(() => paintRef.current(st.progress));
      }

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => paintRef.current(scrollProgressRef.current));
    };

    refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 500);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  const activeHotspot = HOTSPOTS.find((h) => h.id === openHotspotId);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#f0f0f0] text-gray-900"
      aria-label="產品 3D 滾動展示"
    >
      <div className="relative h-[100dvh] w-full overflow-hidden bg-[#f0f0f0]">
        <SequenceFrame frontRef={frameFrontRef} backRef={frameBackRef} />

        <div className="pointer-events-none absolute inset-0 z-40">
          {HOTSPOTS.map((hotspot, index) => (
            <div
              key={hotspot.id}
              ref={(el) => {
                hotspotRefs.current[index] = el;
              }}
              className="pointer-events-none absolute inset-0"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <HotspotMarker
                hotspot={hotspot}
                isActive={openHotspotId === hotspot.id}
                onClick={() =>
                  setOpenHotspotId((prev) =>
                    prev === hotspot.id ? null : hotspot.id,
                  )
                }
              />
            </div>
          ))}
        </div>

        {activeHotspot && !isMobile && (
          <InfoPanel
            hotspot={activeHotspot}
            onClose={() => setOpenHotspotId(null)}
          />
        )}
      </div>

      {activeHotspot && isMobile && (
        <MobileInfoPanel
          hotspot={activeHotspot}
          onClose={() => setOpenHotspotId(null)}
        />
      )}

      <div className="absolute bottom-0 left-0 z-50 h-[2px] w-full origin-left bg-gray-200/60">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-[#00B4D8]"
        />
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
