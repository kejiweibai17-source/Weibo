"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { HERO_SLIDER_FALLBACK_SLIDES } from "@/data/hero-slider-fallback";

gsap.registerPlugin(ScrollTrigger, SplitText);

function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function Slider({ slides: slidesProp }) {
  const slides =
    slidesProp?.length > 0 ? slidesProp : [...HERO_SLIDER_FALLBACK_SLIDES];

  const sliderRef = useRef(null);
  const sliderImagesRef = useRef(null);
  const sliderTitleRef = useRef(null);
  const sliderIndicesRef = useRef(null);
  const progressBarRef = useRef(null);

  useGSAP(
    () => {
      if (!slides.length) return undefined;

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
        newSliderImage.alt = slides[index].title || `Slide ${index + 1}`;

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

        const slide = slides[index];
        sliderTitleRef.current.innerHTML = `
          <h1 class="text-4xl md:text-5xl font-bold tracking-wider mb-5">${escapeHtml(slide.title)}</h1>
          <p class="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">${escapeHtml(slide.description)}</p>
        `;

        const titleEl = sliderTitleRef.current.querySelector("h1");
        const descEl = sliderTitleRef.current.querySelector("p.description");
        if (!titleEl || !descEl) return;

        const titleSplit = new SplitText(titleEl, {
          type: "lines",
          linesClass: "line",
        });

        const descSplit = new SplitText(descEl, {
          type: "lines",
          linesClass: "line",
        });

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

      const st = ScrollTrigger.create({
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

          const currentSlide = Math.min(
            slides.length - 1,
            Math.floor(self.progress * slides.length),
          );

          if (activeSlide !== currentSlide) {
            activeSlide = currentSlide;
            animateNewSlide(activeSlide);
          }
        },
      });

      return () => {
        if (currentSplits.length > 0) {
          currentSplits.forEach((split) => split.revert());
        }
        st.kill();
      };
    },
    { scope: sliderRef, dependencies: [slides] },
  );

  const first = slides[0];

  return (
    <>
      <section className="slider section-slider" ref={sliderRef}>
        <div className="slider-images" ref={sliderImagesRef}>
          <img src={first.image} alt={first.title} />
        </div>

        <div
          className="slider-title ml-[5%] md:ml-[10%] max-w-[600px] px-4 md:px-0"
          ref={sliderTitleRef}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-5">
            {first.title}
          </h1>
          <p className="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">
            {first.description}
          </p>
        </div>

        <div className="slider-indicator hidden md:flex">
          <div className="slider-indices" ref={sliderIndicesRef}></div>
          <div className="slider-progress-bar">
            <div className="slider-progress" ref={progressBarRef}></div>
          </div>
        </div>
      </section>

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

        .slider-images {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .slider-images img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }

        .slider-images::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        .slider-title {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: white;
        }

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
