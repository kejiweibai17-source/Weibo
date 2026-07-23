// components/Preloader.jsx
"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markPreloaderPlayedThisSession } from "@/lib/preloaderSession";
import { startHomeMusic } from "@/lib/homeMusic";
import PreloaderBackdrop from "./PreloaderBackdrop";

/** 整體動畫時長保留 1/3（縮短 2/3） */
const T = 1 / 3;

/**
 * 自動進場／強制關閉（相對先前約 3.5 倍）
 * SEO 不受影響：搜尋爬蟲已在 shouldShowHomePreloader 略過整段 Preloader
 */
const AUTO_PLAY_MS = 12000;
const FORCE_DISMISS_MS = 35000;

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const introTextRef = useRef(null);
  const brandTextRef = useRef(null);
  const lineRef = useRef(null);
  const startedRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    // 進首頁即播，播完一次即停；preloader 結束後不中斷
    startHomeMusic();
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(brandTextRef.current, { opacity: 0 });
      gsap.set(lineRef.current, { opacity: 0, scaleX: 0 });
    },
    { scope: overlayRef },
  );

  const finish = contextSafe(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markPreloaderPlayedThisSession();
    if (onComplete) onComplete();
  });

  const playIntro = contextSafe(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const tl = gsap.timeline({
      onComplete: finish,
    });

    tl.to(introTextRef.current, {
      opacity: 0,
      duration: 0.6 * T,
      ease: "power2.inOut",
    })
      .to(
        brandTextRef.current,
        {
          opacity: 1,
          duration: 0.75 * T,
          ease: "power2.out",
        },
        "-=0.1",
      )
      .to(
        lineRef.current,
        { opacity: 1, duration: 0.5 * T, ease: "power2.out" },
        "<0.15",
      )
      .to(lineRef.current, {
        scaleX: 1,
        duration: 2.5 * T,
        ease: "power2.inOut",
      })
      .to(
        [brandTextRef.current, lineRef.current],
        { opacity: 0, duration: 0.55 * T, ease: "power2.inOut" },
        "+=0",
      )
      .to(overlayRef.current, {
        opacity: 0,
        duration: 1.5 * T,
        ease: "power2.inOut",
      });
  });

  const playIntroRef = useRef(playIntro);
  const finishRef = useRef(finish);
  playIntroRef.current = playIntro;
  finishRef.current = finish;

  // SEO／可用性：自動開始 + 逾時強制關閉（不依賴點擊）
  useEffect(() => {
    const autoPlay = window.setTimeout(
      () => playIntroRef.current(),
      AUTO_PLAY_MS,
    );
    const forceDismiss = window.setTimeout(() => {
      if (finishedRef.current) return;
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => finishRef.current(),
        });
      } else {
        finishRef.current();
      }
    }, FORCE_DISMISS_MS);

    return () => {
      window.clearTimeout(autoPlay);
      window.clearTimeout(forceDismiss);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{ zIndex: 9999999999999999 }}
      className="preloader-overlay fixed inset-0 flex flex-col items-center justify-center touch-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="昔馬電動刮鬍刀進場動畫"
      aria-live="polite"
      data-nosnippet
    >
      <PreloaderBackdrop />

      <div
        ref={introTextRef}
        className="relative z-10 flex flex-col items-center px-6"
      >
        {/* 不用 h1：避免搶走首頁主標題，影響 SEO 標題階層 */}
        <div className="mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)]">
          <img
            src="/images/SMASMALL-logo-white.png"
            alt="昔馬電動刮鬍刀 SMASMALL"
            width={775}
            height={195}
            className="h-auto w-[240px] md:w-[360px]"
            draggable={false}
          />
        </div>
        <p className="mb-10 text-sm font-normal tracking-wide text-gray-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] md:text-base">
          秒懂，男仕的禮物。
        </p>

        <button
          type="button"
          onClick={playIntro}
          className="group flex items-center gap-3 px-6 py-2.5 border border-white/40 rounded-full text-white text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black"
        >
          探索昔馬
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div className="absolute z-10 flex flex-col items-center" aria-hidden>
        <div
          ref={brandTextRef}
          className="mb-5 opacity-0 drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] will-change-opacity"
        >
          <img
            src="/images/SMASMALL-logo-white.png"
            alt=""
            width={775}
            height={195}
            className="h-auto w-[180px] md:w-[260px]"
            draggable={false}
          />
        </div>
        <div
          ref={lineRef}
          className="h-[1px] w-[250px] origin-left scale-x-0 bg-white opacity-0 md:w-[320px]"
        />
      </div>
    </div>
  );
}
