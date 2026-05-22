// components/Preloader.jsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const introTextRef = useRef(null);
  const lineRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: overlayRef });

  const playIntro = contextSafe(() => {
    const tl = gsap.timeline({
      // 當黑幕完全消失時，呼叫父層傳入的 onComplete 函數
      onComplete: () => {
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
      className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center touch-none"
    >
      <div ref={introTextRef} className="flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase mb-4 text-white">
          SMASMALL
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-light tracking-wide mb-10">
          The power of precision. Made accessible.
        </p>

        <button
          onClick={playIntro}
          className="group flex items-center gap-3 px-6 py-2.5 border border-white/40 rounded-full text-white text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black"
        >
          Enter the Experience
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div
        ref={lineRef}
        className="absolute h-[1px] w-[250px] bg-white opacity-0 origin-left scale-x-0"
      />
    </div>
  );
}
