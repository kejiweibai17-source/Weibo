"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// FadeUpItem：包住任意子元素，進入視窗時 fade + slide up
// ============================================================
export function FadeUpItem({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// TextParallaxContent
//  - 背景圖用 GSAP ScrollTrigger pin 固定（同 Slider.jsx 做法）
//  - 不使用 CSS sticky，不使用 Framer Motion useScroll
//  - 內容帶 -mt 從下往上滾動覆蓋背景
// ============================================================
const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  const wrapperRef = useRef(null); // useGSAP scope
  const sectionRef = useRef(null); // 被 pin 的背景 section
  const bgRef = useRef(null);      // 背景圖（做 scale + Y 視差）
  const textRef = useRef(null);    // 文字 overlay

  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      const text = textRef.current;
      if (!section || !bg || !text) return;

      // Pin 持續距離：1.5 個螢幕高度（讓文字動畫有充足時間播放）
      const PIN_DIST = window.innerHeight * 1.5;

      // ① Pin 背景 section（同 Slider.jsx 的 ScrollTrigger.create pin）
      //    pinSpacing: false → 不插入額外間距，讓 content 從下方自然滾上來覆蓋
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DIST}`,
        pin: true,
        pinSpacing: false,
      });

      // ② 背景圖視差：scale 放大 + 微微上移（同 Slider 的 scrub 做法）
      gsap.fromTo(
        bg,
        { scale: 1.05, y: "0%" },
        {
          scale: 1.15,
          y: "-8%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${PIN_DIST}`,
            scrub: 1.5,
          },
        },
      );

      // ③ 文字 overlay：進入 → 停留 → 淡出
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${PIN_DIST}`,
            scrub: 1,
          },
        })
        .fromTo(
          text,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.3 },
        )
        .to(text, { y: 0, autoAlpha: 1, duration: 0.4 })
        .to(text, { y: -40, autoAlpha: 0, ease: "power2.in", duration: 0.3 });
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef}>
      {/* ── 背景 section（被 GSAP pin 住）── */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* 背景圖 */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgUrl})` }}
        />

        {/* 暗色遮罩，讓文字更易讀 */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        {/* 文字 overlay（GSAP 控制 autoAlpha，初始不可見） */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 pointer-events-none"
          style={{ visibility: "hidden" }}
        >
          <p
            className="mb-3 text-center text-xl md:text-3xl font-light tracking-widest uppercase drop-shadow-md"
            style={{ WebkitFontSmoothing: "antialiased" }}
          >
            {subheading}
          </p>
          <p
            className="text-center text-4xl font-bold md:text-7xl leading-tight drop-shadow-lg"
            style={{ WebkitFontSmoothing: "antialiased" }}
          >
            {heading}
          </p>
        </div>
      </section>

      {/* ── 往上滾的內容層 ──
            -mt-[60vh]：讓內容從 40vh 處開始，滾動時覆蓋 pin 住的背景
            z-10：確保內容在背景圖層上方
      */}
      <div className="relative z-10 -mt-[60vh]">{children}</div>
    </div>
  );
};

// ============================================================
// 範例 ExampleContent（卡片區）
// ============================================================
const ExampleContent = () => (
  <div className="w-[85%] max-w-[1920px] mx-auto space-y-24 py-8">
    <FadeUpItem>
      <div className="left-card">
        <div className="card bg-white rounded-[25px] w-[450px] max-w-[450px] h-[550px] max-h-[500px] shadow-xl overflow-hidden">
          <div className="w-full p-4">
            <Image
              src="/images/001.png"
              placeholder="empty"
              loading="lazy"
              width={600}
              height={400}
              className="w-full rounded-[20px]"
              alt="card-image"
            />
          </div>
        </div>
      </div>
    </FadeUpItem>

    <FadeUpItem delay={0.1}>
      <div className="right-card flex justify-end">
        <div className="card bg-white rounded-[25px] w-[550px] max-w-[450px] h-[550px] max-h-[500px] shadow-xl overflow-hidden">
          <div className="p-4">
            <Image
              src="/images/001.png"
              placeholder="empty"
              loading="lazy"
              width={600}
              height={400}
              className="w-full rounded-[20px]"
              alt="card-image"
            />
          </div>
        </div>
      </div>
    </FadeUpItem>

    <FadeUpItem delay={0.05}>
      <div className="left-card">
        <div className="card bg-white rounded-[25px] w-[450px] max-w-[450px] h-[550px] max-h-[500px] shadow-xl overflow-hidden">
          <div className="w-full p-4">
            <Image
              src="/images/001.png"
              placeholder="empty"
              loading="lazy"
              width={600}
              height={400}
              className="w-full rounded-[20px]"
              alt="card-image"
            />
          </div>
        </div>
      </div>
    </FadeUpItem>

    <FadeUpItem delay={0.1}>
      <div className="right-card flex justify-end">
        <div className="card bg-white rounded-[25px] w-[550px] max-w-[450px] h-[550px] max-h-[500px] shadow-xl overflow-hidden">
          <div className="p-4">
            <Image
              src="/images/001.png"
              placeholder="empty"
              loading="lazy"
              width={600}
              height={400}
              className="w-full rounded-[20px]"
              alt="card-image"
            />
          </div>
        </div>
      </div>
    </FadeUpItem>
  </div>
);

// ============================================================
// 預設匯出：完整範例頁面
// ============================================================
const TextParallaxContentExample = () => (
  <TextParallaxContent
    imgUrl="/images/001.png"
    subheading="Collaborate"
    heading="Built for all of us."
  >
    <div className="bg-white space-y-0 px-8 pt-[8vh] pb-32">
      <FadeUpItem>
        <h1 className="text-4xl font-bold text-gray-900 mb-16">HELLO</h1>
      </FadeUpItem>
      <ExampleContent />
    </div>
  </TextParallaxContent>
);

export default TextParallaxContentExample;
