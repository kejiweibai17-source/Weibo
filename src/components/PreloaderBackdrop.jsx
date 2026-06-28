"use client";

import Image from "next/image";

const BG_IMAGE = "/images/24e6dbfc-0198-4061-8140-5e6519413cc8.png";

/** 與 CSS --cycle-duration 同步（秒）— 一輪：緩慢放大 → 全黑 → 煙霧散去 → 再放大 */
export const PRELOADER_CYCLE_SECONDS = 28 / 3;

const SMOKE_LAYERS = [
  { y: "18%", scale: 1.8, peak: 0.72, phase: 0 },
  { y: "42%", scale: 2.1, peak: 0.68, phase: 0.04 },
  { y: "62%", scale: 1.95, peak: 0.75, phase: 0.08 },
  { y: "28%", scale: 2.3, peak: 0.62, phase: 0.12 },
  { y: "78%", scale: 2.05, peak: 0.7, phase: 0.06 },
  { y: "52%", scale: 2.4, peak: 0.58, phase: 0.1 },
];

export default function PreloaderBackdrop() {
  return (
    <div
      className="preloader-cycle"
      style={{ "--cycle-duration": `${PRELOADER_CYCLE_SECONDS}s` }}
      aria-hidden
    >
      <div className="preloader-bg">
        <div className="preloader-bg-image">
          <Image
            src={BG_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* 背景圖上方、煙霧下方：固定透明黑遮罩 */}
      <div className="preloader-base-dim" />

      <div className="preloader-smoke">
        {SMOKE_LAYERS.map((layer, index) => (
          <span
            key={index}
            className="preloader-smoke-layer"
            style={{
              "--smoke-y": layer.y,
              "--smoke-scale": layer.scale,
              "--smoke-peak": layer.peak,
              "--layer-phase": layer.phase,
            }}
          />
        ))}
        <span className="preloader-smoke-envelope" />
      </div>
    </div>
  );
}
