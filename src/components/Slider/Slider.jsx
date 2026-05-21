"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 🌟 昔馬 SMASMALL 專屬文案
const slides = [
  {
    title: "獨創全合金壓鑄機身",
    description:
      "拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落，完美展現復古未來主義的獨特品味。",
    image: "/images/index/banner-01.png",
  },
  {
    title: "業界首創磁吸快拆刀頭",
    description:
      "搭載高精密磁吸結構，一秒即可無縫貼合與拆卸。不僅大幅縮短日常清理時間，更徹底解決傳統機械卡榫易斷裂、易磨損的問題。",
    image: "/images/index/banner-02.png",
  },
  {
    title: "荷蘭進口精鋼刀片",
    description:
      "嚴選頂規荷蘭進口精鋼，搭配雙環超薄刀網與自銳研磨技術。刀片越用越鋒利，精準捕捉各種方向的鬍鬚，享受極致滑順的剃鬚體驗。",
    image: "/images/index/banner-03.png",
  },
  {
    title: "IPX7 頂級全機防水",
    description:
      "支援全機身水洗與乾濕兩用。無論是搭配刮鬍泡的深層淨容，或是淋浴時的快速剃鬚，都能輕鬆應對，用水一沖即淨，衛生無死角。",
    image: "/images/index/banner-04.png",
  },
];

export default function Slider() {
  const sliderRef = useRef(null);
  const sliderImagesRef = useRef(null);
  const sliderTitleRef = useRef(null);
  const sliderIndicesRef = useRef(null);
  const progressBarRef = useRef(null);

  useGSAP(
    () => {
      let activeSlide = 0;
      let currentSplits = [];

      const pinDistance = window.innerHeight * slides.length;

      function createIndices() {
        if (sliderIndicesRef.current) {
          sliderIndicesRef.current.innerHTML = "";

          slides.forEach((_, index) => {
            const indexNum = (index + 1).toString().padStart(2, "0");
            const indicatorElement = document.createElement("p");
            indicatorElement.dataset.index = index;
            indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
            sliderIndicesRef.current.appendChild(indicatorElement);

            if (index === 0) {
              gsap.set(indicatorElement.querySelector(".index"), {
                opacity: 1,
              });
              gsap.set(indicatorElement.querySelector(".marker"), {
                scaleX: 1,
              });
            } else {
              gsap.set(indicatorElement.querySelector(".index"), {
                opacity: 0.35,
              });
              gsap.set(indicatorElement.querySelector(".marker"), {
                scaleX: 0,
              });
            }
          });
        }
      }

      function animateNewSlide(index) {
        if (!sliderImagesRef.current || !sliderTitleRef.current) return;

        const newSliderImage = document.createElement("img");
        newSliderImage.src = slides[index].image;
        newSliderImage.alt = `Slide ${index + 1}`;

        gsap.set(newSliderImage, {
          opacity: 0,
          scale: 1.1,
        });

        sliderImagesRef.current.appendChild(newSliderImage);

        gsap.to(newSliderImage, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(newSliderImage, {
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });

        const allImages = sliderImagesRef.current.querySelectorAll("img");
        if (allImages.length > 3) {
          const removeCount = allImages.length - 3;
          for (let i = 0; i < removeCount; i++) {
            sliderImagesRef.current.removeChild(allImages[i]);
          }
        }

        animateNewTitle(index);
        animateIndicators(index);
      }

      function animateIndicators(index) {
        if (!sliderIndicesRef.current) return;

        const indicators = sliderIndicesRef.current.querySelectorAll("p");

        indicators.forEach((indicator, i) => {
          const markerElement = indicator.querySelector(".marker");
          const indexElement = indicator.querySelector(".index");

          if (i === index) {
            gsap.to(indexElement, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(markerElement, {
              scaleX: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            gsap.to(indexElement, {
              opacity: 0.5,
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(markerElement, {
              scaleX: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      }

      function animateNewTitle(index) {
        if (!sliderTitleRef.current) return;

        if (currentSplits.length > 0) {
          currentSplits.forEach((split) => split.revert());
          currentSplits = [];
        }

        // 🌟 修復 2：加上 Tailwind class，確保第二張以後的排版跟第一張一模一樣
        sliderTitleRef.current.innerHTML = `
          <h1 class="text-4xl md:text-5xl font-bold tracking-wider mb-5">${slides[index].title}</h1>
          <p class="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">${slides[index].description}</p>
        `;

        // 拆分 <h1>
        const titleSplit = new SplitText(
          sliderTitleRef.current.querySelector("h1"),
          { type: "lines", linesClass: "line" },
        );

        // 拆分 <p>
        const descSplit = new SplitText(
          sliderTitleRef.current.querySelector("p.description"),
          { type: "lines", linesClass: "line" },
        );

        currentSplits.push(titleSplit, descSplit);

        gsap.set(titleSplit.lines, { yPercent: 100, opacity: 0 });
        gsap.set(descSplit.lines, { yPercent: 100, opacity: 0 });

        gsap.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.05,
          ease: "power3.out",
        });

        gsap.to(descSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          delay: 0.2,
          stagger: 0.05,
          ease: "power3.out",
        });
      }

      createIndices();

      ScrollTrigger.create({
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, {
              scaleY: self.progress,
            });
          }

          const currentSlide = Math.floor(self.progress * slides.length);

          if (activeSlide !== currentSlide && currentSlide < slides.length) {
            activeSlide = currentSlide;
            animateNewSlide(activeSlide);
          }
        },
      });

      return () => {
        if (currentSplits.length > 0) {
          currentSplits.forEach((split) => split.revert());
        }
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: sliderRef },
  );

  return (
    <>
      <section className="slider section-slider" ref={sliderRef}>
        <div className="slider-images" ref={sliderImagesRef}>
          <img src={slides[0].image} alt="Slide 1" />
        </div>

        <div
          className="slider-title ml-[5%] md:ml-[10%] max-w-[600px] px-4 md:px-0"
          ref={sliderTitleRef}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-5">
            {slides[0].title}
          </h1>
          <p className="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">
            {slides[0].description}
          </p>
        </div>

        <div className="slider-indicator hidden md:flex">
          <div className="slider-indices" ref={sliderIndicesRef}></div>
          <div className="slider-progress-bar">
            <div className="slider-progress" ref={progressBarRef}></div>
          </div>
        </div>
      </section>

      {/* 🌟 核心修復：封裝在此元件專用的 CSS，不依賴全域樣式 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .section-slider {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #050507;
        }

        /* 圖片容器 */
        .slider-images {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        /* 讓 JS 動態加入的所有圖片都能滿版並維持比例 */
        .slider-images img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }

        /* 暗色漸層遮罩，讓文字永遠清晰可見 */
        .slider-images::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        /* 標題定位 */
        .slider-title {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: white;
        }

        /* 右側指示器定位 */
        .slider-indicator {
          position: absolute;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          z-index: 10;
          align-items: center;
          gap: 2rem;
        }

        .slider-indices p {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 24px;
          color: white;
          font-family: monospace;
          font-size: 14px;
        }

        .slider-indices .marker {
          display: block;
          width: 24px;
          height: 2px;
          background-color: white;
          transform-origin: right;
        }

        .slider-progress-bar {
          width: 2px;
          height: 200px;
          background-color: rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .slider-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: white;
          transform-origin: top;
        }
      `,
        }}
      />
    </>
  );
}
