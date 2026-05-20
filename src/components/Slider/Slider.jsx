"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 🌟 替換為昔馬 SMASMALL 專屬文案
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

        // 更新 HTML
        sliderTitleRef.current.innerHTML = `
          <h1>${slides[index].title}</h1>
          <p class="description">${slides[index].description}</p>
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

        // 🌟 分別設定初始狀態，才能分開控制動畫
        gsap.set(titleSplit.lines, { yPercent: 100, opacity: 0 });
        gsap.set(descSplit.lines, { yPercent: 100, opacity: 0 });

        // 🌟 標題動畫 (沒有延遲)
        gsap.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.05,
          ease: "power3.out",
        });

        // 🌟 描述動畫 (加上 delay: 0.5)
        gsap.to(descSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          delay: 0.2, // 這裡設定了 0.5 秒的延遲
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
    <section className="slider" ref={sliderRef}>
      <div className="slider-images" ref={sliderImagesRef}>
        <img src={slides[0].image} alt="Slide 1" />
      </div>

      <div
        className="slider-title ml-[90px] max-w-[500px]"
        ref={sliderTitleRef}
      >
        <h1>{slides[0].title}</h1>
        <p className=" !leading-10 mt-5 !text-[18.5px]">
          {slides[0].description}
        </p>
      </div>

      <div className="slider-indicator">
        <div className="slider-indices" ref={sliderIndicesRef}></div>

        <div className="slider-progress-bar">
          <div className="slider-progress" ref={progressBarRef}></div>
        </div>
      </div>
    </section>
  );
}
