// components/Preloader.jsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markPreloaderPlayedThisSession } from "@/lib/preloaderSession";
import PreloaderBackdrop from "./PreloaderBackdrop";

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const introTextRef = useRef(null);
  const lineRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: overlayRef });

  const playIntro = contextSafe(() => {
    const tl = gsap.timeline({
      // 當黑幕完全消失時，呼叫父層傳入的 onComplete 函數
      onComplete: () => {
        markPreloaderPlayedThisSession();
        if (onComplete) onComplete();
      },
    });

    tl.to(introTextRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    })
      .to(lineRef.current, { opacity: 1, duration: 0.2 })
      .to(lineRef.current, {
        scaleX: 1,
        duration: 2.5,
        ease: "power2.inOut",
      })
      .to(lineRef.current, { opacity: 0, duration: 0.4 })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
  });

  return (
    <div
      ref={overlayRef}
      style={{ zIndex: 9999999999999999 }}
      className="preloader-overlay fixed inset-0 flex flex-col items-center justify-center touch-none overflow-hidden"
    >
      <PreloaderBackdrop />

      <div
        ref={introTextRef}
        className="relative z-10 flex flex-col items-center px-6"
      >
        <h1 className="mb-4 text-3xl font-light uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] md:text-5xl">
          SMASMALL
        </h1>
        <p className="mb-10 text-sm font-light tracking-wide text-gray-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] md:text-base">
          修容，也可以很講究。
        </p>

        <button
          onClick={playIntro}
          className="group flex items-center gap-3 px-6 py-2.5 border border-white/40 rounded-full text-white text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black"
        >
          昔馬電動刮鬍刀
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div
        ref={lineRef}
        className="absolute z-10 h-[1px] w-[250px] bg-white opacity-0 origin-left scale-x-0"
      />
    </div>
  );
}
