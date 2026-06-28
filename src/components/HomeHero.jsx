"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Preloader from "./Preloader";
import {
  markPreloaderPlayedThisSession,
  shouldShowHomePreloader,
} from "@/lib/preloaderSession";

gsap.registerPlugin(ScrollTrigger);

function revealHomeWithoutPreloader(pageContentRef) {
  gsap.set(".hero-title", { opacity: 1, scale: 1 });
  gsap.set(".hero-sub", { opacity: 1, y: 0 });
  if (pageContentRef?.current) {
    gsap.set(pageContentRef.current, { opacity: 1 });
  }
  ScrollTrigger.refresh();
}

/**
 * HomeHero
 * 負責：Preloader 狀態、Lenis 滾動鎖定、Hero 影片區、GSAP 文字動畫、頁面內容淡入
 * @param {{ pageContentRef: React.RefObject }} props
 */
export default function HomeHero({ pageContentRef }) {
  const [introFinished, setIntroFinished] = useState(false);
  const [preloaderMounted, setPreloaderMounted] = useState(false);
  const [skipIntroAnimations, setSkipIntroAnimations] = useState(false);
  const lenis = useLenis();

  // 重新整理 → 顯示 Preloader；站內再回首頁 → 略過
  useEffect(() => {
    if (shouldShowHomePreloader()) {
      setPreloaderMounted(true);
      return;
    }
    setSkipIntroAnimations(true);
    setIntroFinished(true);
    requestAnimationFrame(() => revealHomeWithoutPreloader(pageContentRef));
  }, [pageContentRef]);

  // 🌟 Lenis 滾動鎖定 / 解鎖 (已修復：移除 overflow: hidden)
  useEffect(() => {
    if (!introFinished) {
      // 只要畫面還在 Preloader 或動畫中，就停用 Lenis 滾動
      if (lenis) lenis.stop();
    } else {
      // 動畫結束，恢復滾動
      if (lenis) lenis.start();
    }
  }, [introFinished, lenis]);

  // Hero 文字浮現 + 頁面內容淡入
  useGSAP(() => {
    if (!introFinished) return;
    if (skipIntroAnimations) return;

    const tl = gsap.timeline();
    tl.fromTo(
      ".hero-title",
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
    )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=1",
      )
      .to(
        pageContentRef.current,
        {
          opacity: 1,
          duration: 1,
          onComplete: () => {
            // 動畫播完後，強制重新計算所有 ScrollTrigger 觸發點
            ScrollTrigger.refresh();
          },
        },
        "-=1",
      );
  }, [introFinished, skipIntroAnimations]);

  // 監聽 DOM 高度與圖片載入，確保 ScrollTrigger 計算正確
  useEffect(() => {
    if (!introFinished || !pageContentRef.current) return;

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(pageContentRef.current);
    ro.observe(document.body);

    pageContentRef.current.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", () => ScrollTrigger.refresh());
      }
    });

    return () => ro.disconnect();
  }, [introFinished, pageContentRef]);

  const handlePreloaderComplete = () => {
    setIntroFinished(true);
    setTimeout(() => setPreloaderMounted(false), 100);
  };

  return (
    <>
      {preloaderMounted && <Preloader onComplete={handlePreloaderComplete} />}

      <section className="relative w-full h-screen overflow-hidden bg-black z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src="/video/威柏.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="absolute inset-0 z-10 flex flex-col pl-[13%] items-start justify-center text-center pointer-events-none px-4">
          <h1 className="hero-title text-white text-5xl md:text-7xl lg:text-[˙vmin] font-light tracking-[0.2em] opacity-0 uppercase drop-shadow-xl">
            SMASMALL
          </h1>

          <p className="hero-sub mt-6 text-xl md:text-3xl text-gray-200 font-extralight opacity-0 drop-shadow-md">
            昔馬電動刮鬍刀系列
            <br className="md:hidden" />
            威柏科技代理
          </p>
        </div>
      </section>
    </>
  );
}
