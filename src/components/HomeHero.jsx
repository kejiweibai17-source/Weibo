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

  // 圖片載入後再算一次 ScrollTrigger（避免監聽 body 造成 refresh 迴圈卡死）
  useEffect(() => {
    if (!introFinished || !pageContentRef.current) return;

    let raf = 0;
    let timer = 0;
    const scheduleRefresh = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 200);
    };

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(pageContentRef.current);

    const onImgLoad = () => scheduleRefresh();
    const images = pageContentRef.current.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete)
        img.addEventListener("load", onImgLoad, { once: true });
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      images.forEach((img) => img.removeEventListener("load", onImgLoad));
    };
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

        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center pl-[13%] px-4 text-left pointer-events-none">
          <h1 className="hero-title opacity-0 drop-shadow-xl">
            <img
              src="/images/SMASMALL-logo-white.png"
              alt="SMASMALL"
              width={775}
              height={195}
              className="h-auto w-[280px] md:w-[420px] lg:w-[min(520px,48vw)]"
              draggable={false}
            />
          </h1>

          <div className="mt-3 flex flex-col items-start justify-start text-left">
            <b className="text-white text-[35px]">秒懂男仕的禮物</b>
            <b className="text-white text-[16px]">星座系列　重磅上市</b>
          </div>
        </div>
      </section>
    </>
  );
}
