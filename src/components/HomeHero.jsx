"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Preloader from "./Preloader";
import HomeMusicControl from "./HomeMusicControl";
import {
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
 * SEO：爬蟲略過 Preloader；主內容始終在 DOM（不 display:none）
 * @param {{ pageContentRef: React.RefObject }} props
 */
export default function HomeHero({ pageContentRef }) {
  const [introFinished, setIntroFinished] = useState(false);
  const [preloaderMounted, setPreloaderMounted] = useState(false);
  const [skipIntroAnimations, setSkipIntroAnimations] = useState(false);
  const lenis = useLenis();

  // 重新整理 → 顯示 Preloader；爬蟲／減少動態／站內再回 → 略過
  useEffect(() => {
    if (shouldShowHomePreloader()) {
      setPreloaderMounted(true);
      return;
    }
    setSkipIntroAnimations(true);
    setIntroFinished(true);
    requestAnimationFrame(() => revealHomeWithoutPreloader(pageContentRef));
  }, [pageContentRef]);

  // Lenis 滾動鎖定 / 解鎖
  useEffect(() => {
    if (!introFinished) {
      if (lenis) lenis.stop();
    } else {
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
            ScrollTrigger.refresh();
          },
        },
        "-=1",
      );
  }, [introFinished, skipIntroAnimations]);

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

      <section
        className="relative z-0 h-screen w-full overflow-hidden bg-black"
        aria-label="昔馬電動刮鬍刀首頁主視覺"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src="/video/威柏.mp4"
          autoPlay
          loop
          muted
          playsInline
          // 爬蟲不依賴影片；標題文字才是 SEO 主體
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-center px-4 pl-[13%] text-left">
          <div className="mt-3 flex flex-col items-start justify-start text-left">
            {/* 首頁唯一 h1：給 SEO／無障礙；視覺維持原設計 */}
            <h1 className="hero-title text-left font-light text-white">
              <span className="block text-4xl xl:text-7xl">秒懂男仕的禮物</span>
              <span className="hero-sub mt-1 block text-[22px] font-light xl:text-[26px]">
                星座系列　重磅上市
              </span>
              <span className="sr-only">
                ｜昔馬電動刮鬍刀 SMASMALL 台灣官方網站
              </span>
            </h1>
          </div>
        </div>

      </section>

      <HomeMusicControl />
    </>
  );
}
