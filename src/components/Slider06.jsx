"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PRODUCT06_SLIDES } from "@/data/productSlides";
const { slides } = PRODUCT06_SLIDES;

export default function Slider() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const indicatorsRef = useRef([]);
  const timerRef = useRef(null);

  useGSAP(
    () => {
      let currentIndex = 0;
      let isAnimating = false;

      const slideDuration = 4;
      const transitionDuration = 1.5;
      const scaleDuration = 12;
      const scaleStart = 1.08;

      function animateSlide(nextIndex) {
        if (isAnimating || nextIndex === currentIndex) return;
        const currentImg = imagesRef.current[currentIndex];
        const nextImg = imagesRef.current[nextIndex];
        if (!currentImg || !nextImg) return;
        isAnimating = true;

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
            currentIndex = nextIndex;
            startAutoplay();
          },
        });

        gsap.set(nextImg, { zIndex: 2 });
        gsap.set(currentImg, { zIndex: 1 });
        tl.to(currentImg, { opacity: 0, duration: transitionDuration, ease: "power2.inOut" }, 0);
        gsap.set(nextImg, { scale: scaleStart, opacity: 0 });
        tl.to(nextImg, { opacity: 1, duration: transitionDuration, ease: "power2.inOut" }, 0);
        gsap.to(nextImg, { scale: 1, duration: scaleDuration, ease: "none" });

        indicatorsRef.current.forEach((ind, i) => {
          if (!ind) return;
          const ring = ind.querySelector(".ring");
          if (!ring) return;
          if (i === nextIndex) {
            gsap.to(ind, { opacity: 1, duration: 0.3 }, 0);
            gsap.to(ring, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
          } else {
            gsap.to(ind, { opacity: 0.4, duration: 0.3 }, 0);
            gsap.to(ring, { scale: 0, opacity: 0, duration: 0.3 }, 0);
          }
        });
      }

      function startAutoplay() {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          animateSlide((currentIndex + 1) % slides.length);
        }, slideDuration * 1000);
      }

      if (imagesRef.current[0]) {
        gsap.set(imagesRef.current, { opacity: 0 });
        gsap.set(imagesRef.current[0], { opacity: 1, scale: scaleStart, zIndex: 2 });
        gsap.to(imagesRef.current[0], { scale: 1, duration: scaleDuration, ease: "none" });
      }

      indicatorsRef.current.forEach((ind, i) => {
        if (!ind) return;
        const ring = ind.querySelector(".ring");
        if (!ring) return;
        if (i === 0) {
          gsap.set(ind, { opacity: 1 });
          gsap.set(ring, { scale: 1, opacity: 1 });
        } else {
          gsap.set(ind, { opacity: 0.4 });
          gsap.set(ring, { scale: 0, opacity: 0 });
        }
      });

      startAutoplay();
      return () => { clearTimeout(timerRef.current); };
    },
    { scope: containerRef },
  );

  return (
    <>
      <style>{`
        .hero-container {
          position: relative; width: 100%; height: 100svh;
          overflow: hidden; background-color: #000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #fff;
        }
        .slide-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; will-change: transform, opacity; }
        .slide-image img { width: 100%; height: 100%; object-fit: cover; }
        .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.25); z-index: 10; pointer-events: none; }
        .top-left-logo { position: absolute; top: 2.5rem; left: 3rem; z-index: 20; display: flex; flex-direction: column; gap: 2px; }
        .top-left-logo .logo-main { font-size: 1.25rem; font-weight: 900; letter-spacing: 0.05em; }
        .top-left-logo .logo-sub { font-size: 0.6rem; letter-spacing: 0.15em; opacity: 0.8; }
        .bottom-left-text { position: absolute; bottom: 2.5rem; left: 3rem; z-index: 20; font-size: 0.75rem; letter-spacing: 0.05em; }
        .bottom-left-text .underline { border-bottom: 1px solid #fff; padding-bottom: 2px; margin-right: 6px; }
        .bottom-right-scroll { position: absolute; bottom: 2.5rem; right: 3rem; z-index: 20; display: flex; align-items: center; gap: 1rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; opacity: 0.8; }
        .bottom-right-scroll .arrow-circle { width: 24px; height: 24px; border: 1px solid rgba(255,255,255,0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.5rem; }
        .side-indicators { position: absolute; right: 3rem; top: 50%; transform: translateY(-50%); z-index: 20; display: flex; flex-direction: column; gap: 1.2rem; }
        .indicator-item { position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
        .indicator-item .dot { width: 3px; height: 3px; background-color: #fff; border-radius: 50%; }
        .indicator-item .ring { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid rgba(255,255,255,0.8); border-radius: 50%; }
        @media (max-width: 768px) {
          .top-left-logo { top: 1.5rem; left: 1.5rem; }
          .bottom-left-text { bottom: 1.5rem; left: 1.5rem; font-size: 0.65rem; }
          .bottom-right-scroll { display: none; }
          .side-indicators { right: 1.5rem; }
        }
      `}</style>

      <section className="hero-container" ref={containerRef}>
        <div className="images-wrapper">
          {slides.map((slide, idx) => (
            <div key={`img-${idx}`} className="slide-image" ref={(el) => (imagesRef.current[idx] = el)}>
              <img src={slide.image} alt="電動鼻毛修剪器 情境圖" />
            </div>
          ))}
        </div>
        <div className="overlay"></div>

        <div className="top-left-logo">
          <span className="logo-main">昔馬理容</span>
          <span className="logo-sub">SMASMALL ICEBREAKER</span>
        </div>

        <div className="bottom-left-text">
          <span className="underline">ELECTRIC NOSE TRIMMER</span>
          <span> by <strong>WEIBO</strong></span>
        </div>

        <div className="bottom-right-scroll">
          SCROLL FOR CONTENTS
          <div className="arrow-circle">↓</div>
        </div>

        <div className="side-indicators">
          {slides.map((_, idx) => (
            <div key={`ind-${idx}`} className="indicator-item" ref={(el) => (indicatorsRef.current[idx] = el)}>
              <div className="dot"></div>
              <div className="ring"></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
