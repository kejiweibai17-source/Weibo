"use client";

import React, { useRef, useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import Parallax from "../components/ParallaxPage";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import EmblaCarousel from "@/components/EmblaCarousel/index";
import TextParallaxContentExample02 from "../components/TextParallaxContent02/page";
import Slider from "../components/Slider/Slider";
import TestimonialsSection from "@/components/TestimonialsSection";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import TextScrollSequence from "../components/TextScrollSequence";
// 🌟 引入 Lenis Hook 來控制平滑滾動的暫停與恢復
import { useLenis } from "@studio-freight/react-lenis";

const FeatureCarousel = dynamic(
  () => import("../components/EmblaCarouselTravel/index"),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

// 🌟 準備要傳給輪播的設定與圖片資料
const OPTIONS = { dragFree: true, loop: true };
const SLIDES = [
  {
    image: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png",
    title: "專利認可",
  },
  {
    image: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
    title: "Third Slide",
  },
  {
    image: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png",
    title: "Third Slide",
  },
  {
    image: "/images/c27b8987-cfae-45a5-b9b1-9390b866a0d6.png",
    title: "Fourth Slide",
  },
];

export default function Home({ faqs = [] }) {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

  // 動畫相關 Refs
  const overlayRef = useRef(null);
  const introTextRef = useRef(null);
  const lineRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const scrollIndRef = useRef(null);
  const pageContentRef = useRef(null);

  // 控制前導層是否從 DOM 移除
  const [isIntroUnmounted, setIsIntroUnmounted] = useState(false);

  // 🌟 取得 Lenis 實例以控制滾動
  const lenis = useLenis();

  // 1. 鎖定初始滾動 (完美攔截原生滾動與 Lenis 平滑滾動)
  useEffect(() => {
    if (!isIntroUnmounted) {
      // 停止 Lenis 滾動計算
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // 恢復 Lenis 滾動計算
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isIntroUnmounted, lenis]);

  // 2. 字體載入
  useEffect(() => {
    const font = new FontFace(
      "ResourceHanRoundedCN-Heavy",
      "url(/fonts/ResourceHanRoundedCN-Heavy.ttf)",
    );

    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        if (carouselRef.current) {
          carouselRef.current.style.fontFamily =
            "ResourceHanRoundedCN-Heavy, sans-serif";
        }
      })
      .catch((error) => {
        console.log("字體加載失敗:", error);
      });
  }, []);

  // 3. GSAP 動畫初始化 (包含視差與新增的滾動文字效果)
  const { contextSafe } = useGSAP(
    () => {
      // === 原本的圖片視差動畫邏輯 ===
      const images = document.querySelectorAll(".animate-image-wrapper");
      images.forEach((image, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "top center",
            toggleActions: "play none none none",
            id: "imageReveal-" + i,
          },
        });

        tl.fromTo(
          image.querySelector(".overlay"),
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          },
        )
          .to(image.querySelector(".overlay"), {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          })
          .fromTo(
            image.querySelector(".image-container"),
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "power3.inOut",
            },
            "-=0.5",
          )
          .fromTo(
            image.querySelector(".img-zoom"),
            {
              scale: 1.84,
              willChange: "transform",
              transformOrigin: "center center",
            },
            { scale: 1, duration: 2.5, ease: "expo.out" },
            "<",
          );
      });

      // === 影片中的錯落模糊滾動解鎖文字動畫 (Staggered Blur Reveal) ===
      const textBlocks = document.querySelectorAll(".reveal-text-block");
      textBlocks.forEach((block) => {
        const lines = block.querySelectorAll(".reveal-line");

        gsap.fromTo(
          lines,
          { opacity: 0, y: 40, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.3,
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              end: "bottom 55%",
              scrub: 1,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  // 4. 點擊按鈕觸發的 Timeline 前導動畫
  const playIntro = contextSafe(() => {
    const tl = gsap.timeline();

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
        onComplete: () => setIsIntroUnmounted(true),
      })
      .fromTo(
        heroTitleRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
        "-=1",
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=1",
      )
      .to(scrollIndRef.current, { opacity: 1, duration: 1 }, "-=0.5")
      .to(pageContentRef.current, { opacity: 1, duration: 1 }, "-=1");
  });

  return (
    <main
      ref={containerRef}
      className="relative bg-black min-h-screen text-white"
    >
      {/* =========================================================
          1. Preloader Overlay (前導黑幕)
          ========================================================= */}
      {!isIntroUnmounted && (
        <div
          ref={overlayRef}
          // 🌟 修正：利用 style 強行注入極大值的 z-index，保證蓋過所有 Navbar
          style={{ zIndex: 9999999999999999 }}
          className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center touch-none"
        >
          <div ref={introTextRef} className="flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase mb-4">
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
      )}

      {/* =========================================================
          2. Hero Video Section (首頁全螢幕影片背景區)
          ========================================================= */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src="https://vaonis.com/cdn/shop/videos/c/vp/1a4c100aa99349bba6460252485f9d50/1a4c100aa99349bba6460252485f9d50.HD-1080p-2.5Mbps-65658264.mp4?v=0"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <h1
            ref={heroTitleRef}
            className="text-5xl md:text-7xl lg:text-[6rem] font-light tracking-[0.2em] opacity-0 uppercase drop-shadow-xl"
          >
            SMASMALL
          </h1>
          <p
            ref={heroSubRef}
            className="mt-6 text-xl md:text-3xl text-gray-200 font-light opacity-0 drop-shadow-md"
          >
            A professional grooming tool, <br className="md:hidden" />
            reinvented for your space.
          </p>
        </div>

        <div
          ref={scrollIndRef}
          className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white/80 flex items-center gap-3 text-sm font-light tracking-widest uppercase opacity-0"
        >
          <span className="animate-bounce text-lg">↓</span>
          Scroll to discover
        </div>
      </section>

      {/* =========================================================
          3. 原本的頁面內容區塊 (預設透明，看完前導才浮現)
          ========================================================= */}
      <div ref={pageContentRef} className="opacity-0">
        <TextScrollSequence />
        <Parallax />
        <Slider />
        <TextParallaxContentExample02 />
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>
    </main>
  );
}
