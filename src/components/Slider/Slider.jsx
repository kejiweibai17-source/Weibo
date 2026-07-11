"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_SLIDER_FALLBACK_SLIDES } from "@/data/hero-slider-fallback";

gsap.registerPlugin(ScrollTrigger);

function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slideKey(slides) {
  return slides.map((s) => `${s.image}|${s.title}`).join("||");
}

export default function Slider({ slides: slidesProp }) {
  const resolvedSlides =
    slidesProp?.length > 0 ? slidesProp : HERO_SLIDER_FALLBACK_SLIDES;
  const slidesIdentity = slideKey(resolvedSlides);
  const slides = useMemo(
    () => [...resolvedSlides],
    // content identity — avoid re-init when parent passes a new array ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slidesIdentity],
  );

  const sliderRef = useRef(null);
  const sliderImagesRef = useRef(null);
  const sliderTitleRef = useRef(null);
  const sliderIndicesRef = useRef(null);
  const progressBarRef = useRef(null);

  useGSAP(
    () => {
      if (!slides.length) return undefined;

      let activeSlide = -1;

      const pinDistance = window.innerHeight * slides.length;
      const imageEls = sliderImagesRef.current
        ? Array.from(sliderImagesRef.current.querySelectorAll("img"))
        : [];

      gsap.set(imageEls, { opacity: 0, scale: 1.05 });
      if (imageEls[0]) {
        gsap.set(imageEls[0], { opacity: 1, scale: 1 });
      }
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleY: 0 });
      }

      function createIndices() {
        if (!sliderIndicesRef.current) return;
        sliderIndicesRef.current.innerHTML = "";

        slides.forEach((_, index) => {
          const indexNum = (index + 1).toString().padStart(2, "0");
          const indicatorElement = document.createElement("p");
          indicatorElement.dataset.index = String(index);
          indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
          sliderIndicesRef.current.appendChild(indicatorElement);

          gsap.set(indicatorElement.querySelector(".index"), {
            opacity: index === 0 ? 1 : 0.35,
          });
          gsap.set(indicatorElement.querySelector(".marker"), {
            scaleX: index === 0 ? 1 : 0,
          });
        });
      }

      function animateIndicators(index) {
        if (!sliderIndicesRef.current) return;

        sliderIndicesRef.current.querySelectorAll("p").forEach((indicator, i) => {
          const markerElement = indicator.querySelector(".marker");
          const indexElement = indicator.querySelector(".index");
          const active = i === index;

          gsap.to(indexElement, {
            opacity: active ? 1 : 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(markerElement, {
            scaleX: active ? 1 : 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }

      function showImage(index) {
        imageEls.forEach((img, i) => {
          const active = i === index;
          gsap.to(img, {
            opacity: active ? 1 : 0,
            scale: active ? 1 : 1.05,
            duration: active ? 0.55 : 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }

      function syncImageInstant(index) {
        imageEls.forEach((img, i) => {
          gsap.set(img, {
            opacity: i === index ? 1 : 0,
            scale: i === index ? 1 : 1.05,
          });
        });
      }

      function animateNewTitle(index) {
        if (!sliderTitleRef.current) return;

        const slide = slides[index];
        if (!slide) return;

        sliderTitleRef.current.innerHTML = `
          <h1 class="text-4xl md:text-5xl font-bold tracking-wider mb-5">${escapeHtml(slide.title)}</h1>
          <p class="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">${escapeHtml(slide.description)}</p>
        `;

        const titleEl = sliderTitleRef.current.querySelector("h1");
        const descEl = sliderTitleRef.current.querySelector("p.description");
        if (!titleEl || !descEl) return;

        gsap.fromTo(
          [titleEl, descEl],
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      }

      function goToSlide(index) {
        if (index < 0 || index >= slides.length || index === activeSlide) return;

        activeSlide = index;
        showImage(index);
        animateIndicators(index);
        animateNewTitle(index);
      }

      function slideFromProgress(progress) {
        if (slides.length <= 1) return 0;
        const raw = progress * slides.length;
        return Math.min(slides.length - 1, Math.max(0, Math.floor(raw)));
      }

      createIndices();
      activeSlide = 0;
      animateIndicators(0);

      const st = ScrollTrigger.create({
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, {
              scaleY: self.progress,
            });
          }
          goToSlide(slideFromProgress(self.progress));
        },
        onRefresh: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleY: self.progress });
          }
          // 只同步圖片透明度，不要在 refresh 裡改標題 DOM
          const next = slideFromProgress(self.progress);
          activeSlide = next;
          syncImageInstant(next);
          animateIndicators(next);
        },
      });

      return () => {
        if (sliderTitleRef.current) {
          gsap.killTweensOf(sliderTitleRef.current.querySelectorAll("h1, p"));
        }
        gsap.killTweensOf(imageEls);
        st.kill();
      };
    },
    { scope: sliderRef, dependencies: [slides] },
  );

  return (
    <>
      <section className="slider section-slider" ref={sliderRef}>
        <div className="slider-images" ref={sliderImagesRef}>
          {slides.map((slide, index) => (
            <img
              key={`${slide.image}-${index}`}
              src={slide.image}
              alt={slide.title || `Slide ${index + 1}`}
              decoding="async"
              style={{ opacity: index === 0 ? 1 : 0 }}
            />
          ))}
        </div>

        <div
          className="slider-title ml-[5%] md:ml-[10%] max-w-[600px] px-4 md:px-0"
          ref={sliderTitleRef}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-5">
            {slides[0]?.title}
          </h1>
          <p className="description leading-10 text-[16px] md:text-[18.5px] text-gray-300">
            {slides[0]?.description}
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

        .slider-title .line {
          display: block;
          overflow: hidden;
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
          transform: scaleY(0);
          transform-origin: top;
        }
      `,
        }}
      />
    </>
  );
}
