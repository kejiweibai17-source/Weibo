"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const FRAME_COUNT = 90;
const FRAME_BASE = "/3d/01";

function frameSrc(index) {
  return `${FRAME_BASE}/${String(index).padStart(4, "0")}.png`;
}

const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  frameSrc(i + 1),
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function drawCover(ctx, img, width, height) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const scale = Math.max(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function HomeScrollSequence01() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const readyRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (readyRef.current && imagesRef.current[frameRef.current]) {
      drawCover(
        ctx,
        imagesRef.current[frameRef.current],
        rect.width,
        rect.height,
      );
    }
  }, []);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawCover(ctx, img, rect.width, rect.height);
    frameRef.current = index;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const images = [];

    const loadAll = async () => {
      let loaded = 0;

      await Promise.all(
        FRAME_PATHS.map(
          (src, idx) =>
            new Promise((resolve) => {
              const img = new Image();
              img.decoding = "async";
              img.onload = () => {
                if (!cancelled) {
                  loaded += 1;
                  setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
                }
                resolve();
              };
              img.onerror = () => resolve();
              img.src = src;
              images[idx] = img;
            }),
        ),
      );

      if (cancelled) return;

      imagesRef.current = images;
      readyRef.current = true;
      setIsReady(true);
      resizeCanvas();
      drawFrame(0);
    };

    loadAll();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, resizeCanvas]);

  useGSAP(
    () => {
      if (!isReady || !sectionRef.current) return undefined;

      const pinDistance = Math.max(window.innerHeight * 2.8, FRAME_COUNT * 40);

      // 🌟 1. 建立 Master Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8, // 稍微拉高 scrub 讓一行行文字的拖曳感更絲滑
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              FRAME_COUNT - 1,
              Math.round(self.progress * (FRAME_COUNT - 1)),
            );
            drawFrame(index);

            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      // 設定總長度為 1
      tl.to({}, { duration: 1 });

      // 🌟 2. 文字一行一行隨滾動浮現 (使用 stagger 控制交錯時間)
      tl.fromTo(
        ".reveal-line",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1, // 每一行會依序延遲觸發，創造極致的一行行浮現感
          duration: 0.4,
          ease: "power3.out",
        },
        0.5, // 從滾動進度 50% 時開始依序執行
      );

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [isReady, drawFrame] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full !bg-[#dddad8] text-gray-900 overflow-hidden"
      aria-label="產品 3D 滾動展示"
    >
      {/* 🌟 核心亮點：混合模式 (Mix Blend Mode)
        - `mix-blend-difference text-white`：當背後的 3D 模型是白底時，文字會自動反轉成黑色；滑過金屬暗部時會自動反轉回白色。
        - 這種做法是日本網頁設計 (如 Sony, Apple JP) 創造極簡空間感的高級技巧。
      */}
      <div className="absolute inset-0 z-50 flex flex-col justify-end items-center pb-[10%] pointer-events-none mix-blend-difference text-white">
        <div className="flex flex-col items-center text-center pointer-events-auto">
          {/* 第 1 行：大標題 */}
          <div className="reveal-line">
            <h4 className="text-3xl md:text-5xl lg:text-[42px] font-light tracking-wide mb-4 md:mb-5">
              昔馬 SMASMALL{" "}
            </h4>
          </div>

          {/* 第 2 行：說明文 */}
          <div className="reveal-line">
            <p className="text-[13px] md:text-[22px] max-w-[600px] leading-relaxed mb-6 md:mb-8 font-light px-4">
              昔馬捍衛者電動刮鬍刀，將合金機身、浮動刀網、IPX7
              防水與快充續航整合在精巧尺寸中
            </p>
          </div>

          {/* 第 3 行：價格 */}
          <div className="reveal-line">
            <p className="text-[14px] md:text-[15px] font-medium mb-8 tracking-wider">
              合金壓鑄機身，經細緻打磨處理
            </p>
          </div>

          {/* 第 4 行：CONTACT 影片復刻按鈕 
            (利用 bg-white text-black，在 difference 混合模式下，白底時會自動變為黑底白字按鈕！)
          */}
          <div className="reveal-line">
            <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white text-black rounded-full hover:scale-105 transition-transform duration-300">
              <span className="text-[12px] font-bold tracking-widest uppercase">
                Buy Now
              </span>
              {/* 實心箭頭/播放圖標 */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="h-full w-full max-h-[100vh]"
          aria-hidden
        />

        {!isReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/95">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#00B4D8] transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              載入動畫序列… {loadProgress}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
