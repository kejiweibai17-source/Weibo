"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ⚠️ 注意：SplitText 是 GSAP Club 的付費套件，確認你的專案中已安裝並有權限使用
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// 移除了圖片，只保留文字段落
const slides = [
  {
    title:
      "Under the soft hum of streetlights she watches the world ripple through glass, her calm expression mirrored in the fragments of drifting light.",
  },
  {
    title:
      "A car slices through the desert, shadow chasing the wind as clouds of dust rise behind, blurring the horizon into gold and thunder.",
  },
  {
    title:
      "Reflections ripple across mirrored faces, each one a fragment of identity, caught between defiance, doubt, and the silence of thought.",
  },
  {
    title:
      "Soft light spills through the café windows as morning settles into wood and metal, capturing the rhythm of quiet human routine.",
  },
];

export default function TextScrollSequence() {
  const sliderRef = useRef(null);
  const titleRef = useRef(null);
  const indicesRef = useRef(null);
  const progressBarRef = useRef(null);

  useGSAP(
    () => {
      let activeSlide = 0;
      let currentSplit = null;
      // 每個 slide 佔用一個螢幕高度的滾動距離
      const pinDistance = window.innerHeight * slides.length;

      // 1. 動態建立右側點點與數字指示器
      function createIndices() {
        if (!indicesRef.current) return;
        indicesRef.current.innerHTML = "";

        slides.forEach((_, index) => {
          const indexNum = (index + 1).toString().padStart(2, "0");
          const indicatorElement = document.createElement("div");
          indicatorElement.dataset.index = index;
          // 使用 Tailwind 排版指示器
          indicatorElement.className =
            "flex items-center justify-end gap-3 mb-4 text-white font-mono text-sm";
          indicatorElement.innerHTML = `
            <span class="marker block w-3 h-[1px] bg-white origin-right transform scale-x-0"></span>
            <span class="index opacity-30">${indexNum}</span>
          `;
          indicesRef.current.appendChild(indicatorElement);

          // 初始化第一個點點的狀態
          if (index === 0) {
            gsap.set(indicatorElement.querySelector(".index"), { opacity: 1 });
            gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 1 });
          }
        });
      }

      // 2. 切換指示器動畫
      function animateIndicators(index) {
        if (!indicesRef.current) return;
        const indicators = indicesRef.current.querySelectorAll("div");

        indicators.forEach((indicator, i) => {
          const marker = indicator.querySelector(".marker");
          const idxEl = indicator.querySelector(".index");

          if (i === index) {
            gsap.to(idxEl, { opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(marker, { scaleX: 1, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(idxEl, { opacity: 0.3, duration: 0.3, ease: "power2.out" });
            gsap.to(marker, { scaleX: 0, duration: 0.3, ease: "power2.out" });
          }
        });
      }

      // 🌟 3. 新標題動畫 (加入退去模糊 Blur Reveal 效果)
      function animateNewTitle(index) {
        if (!titleRef.current) return;

        // 如果之前有切分過文字，先還原
        if (currentSplit) currentSplit.revert();

        // 注入新標題並套用置中排版的 Class
        titleRef.current.innerHTML = `<h1 class="text-3xl font-normal tracking-[-0.05em] leading-[1.3] text-center">${slides[index].title}</h1>`;

        // 將 <h1> 拆分為多行
        currentSplit = new SplitText(titleRef.current.querySelector("h1"), {
          type: "lines",
          linesClass: "line overflow-hidden py-1",
        });

        // 🌟 初始狀態：往下沉、全透明、高度模糊
        gsap.set(currentSplit.lines, {
          y: 40,
          opacity: 0,
          filter: "blur(12px)",
        });

        // 🌟 動畫進場：歸位、不透明、退去模糊 (Stagger 錯落效果)
        gsap.to(currentSplit.lines, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1, // 每行文字延遲 0.1 秒出現
          ease: "power3.out",
        });
      }

      // 執行初始化
      createIndices();
      animateNewTitle(0);

      // 4. 綁定滾動觸發器
      ScrollTrigger.create({
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          // 右側進度條跟隨滾動比例伸長
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleY: self.progress });
          }

          // 計算目前應該顯示哪一個 Slide
          let currentSlide = Math.floor(self.progress * slides.length);
          // 防呆：避免滑到底時 index 溢出
          currentSlide = Math.min(currentSlide, slides.length - 1);

          // 當 Slide 改變時，觸發文字與指示器動畫
          if (activeSlide !== currentSlide) {
            activeSlide = currentSlide;
            animateNewTitle(activeSlide);
            animateIndicators(activeSlide);
          }
        },
      });

      // 清除時還原 SplitText 避免記憶體洩漏
      return () => {
        if (currentSplit) currentSplit.revert();
      };
    },
    { scope: sliderRef },
  );

  return (
    <section
      ref={sliderRef}
      className="relative w-full h-screen bg-[#ffffff] text-stone-800 overflow-hidden font-sans"
    >
      {/* 🌟 文字正中間佈局 */}
      <div
        ref={titleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl flex items-center justify-center z-10"
      >
        {/* JS 會動態將 <h1 ...> 插入此處 */}
      </div>

      {/* 右側進度指示器 */}
      <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-20 flex items-center gap-6">
        {/* 數字與點點 */}
        <div ref={indicesRef} className="flex flex-col"></div>

        {/* 垂直進度條 */}
        <div className="relative w-[1px] h-[200px] md:h-[300px] bg-white/20">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white origin-top scale-y-0"
          ></div>
        </div>
      </div>
    </section>
  );
}
