// components/Preloader.jsx
"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markPreloaderPlayedThisSession } from "@/lib/preloaderSession";
import PreloaderBackdrop from "./PreloaderBackdrop";

const PRELOADER_MUSIC =
  "/music/poradovskyi-fashion-luxury-sensual-music-519482.mp3";

/** 整體動畫時長保留 1/3（縮短 2/3） */
const T = 1 / 3;

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const introTextRef = useRef(null);
  const brandTextRef = useRef(null);
  const lineRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(PRELOADER_MUSIC);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        const resumeOnInteraction = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", resumeOnInteraction);
          document.removeEventListener("touchstart", resumeOnInteraction);
        };
        document.addEventListener("click", resumeOnInteraction, { once: true });
        document.addEventListener("touchstart", resumeOnInteraction, {
          once: true,
        });
      });
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(brandTextRef.current, { opacity: 0 });
      gsap.set(lineRef.current, { opacity: 0, scaleX: 0 });
    },
    { scope: overlayRef },
  );

  const stopMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    gsap.to(audio, {
      volume: 0,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      },
    });
  };

  const playIntro = contextSafe(() => {
    stopMusic();

    const tl = gsap.timeline({
      onComplete: () => {
        markPreloaderPlayedThisSession();
        if (onComplete) onComplete();
      },
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
        <h1 className="mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)]">
          <img
            src="/images/SMASMALL-logo-white.png"
            alt="SMASMALL"
            width={775}
            height={195}
            className="h-auto w-[240px] md:w-[360px]"
            draggable={false}
          />
        </h1>
        <p className="mb-10 text-sm font-normal tracking-wide text-gray-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] md:text-base">
          秒懂，男仕的禮物。
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

      <div className="absolute z-10 flex flex-col items-center">
        <div
          ref={brandTextRef}
          className="mb-5 opacity-0 drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] will-change-opacity"
        >
          <img
            src="/images/SMASMALL-logo-white.png"
            alt="昔馬 SMASMALL"
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
