"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Copy from "@/components/Copy";
export default function SeriesHeroSlider({ slides, autoplaySeconds = 4 }) {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const titleRef = useRef(null);
  const indicatorsRef = useRef([]);
  const timerRef = useRef(null);

  useGSAP(
    () => {
      if (!slides?.length) return undefined;

      let currentIndex = 0;
      let isAnimating = false;
      const slideDuration = autoplaySeconds;
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

        if (titleRef.current) {
          const currentTitle = titleRef.current.querySelector(`div[data-index="${currentIndex}"]`);
          const nextTitle = titleRef.current.querySelector(`div[data-index="${nextIndex}"]`);
          if (currentTitle && nextTitle) {
            tl.to(currentTitle, { autoAlpha: 0, duration: transitionDuration, ease: "power2.inOut" }, 0);
            gsap.set(nextTitle, { autoAlpha: 0 });
            tl.to(nextTitle, { autoAlpha: 1, duration: transitionDuration, ease: "power2.inOut" }, 0);
          }
        }

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

      startAutoplay();

      return () => clearTimeout(timerRef.current);
    },
    { scope: containerRef, dependencies: [slides, autoplaySeconds] },
  );

  if (!slides?.length) return null;

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            ref={(el) => {
              imagesRef.current[index] = el;
            }}
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/25" />

      <div
        ref={titleRef}
        className="relative z-10 flex h-full items-end px-6 pb-24 md:px-12 md:pb-32"
      >
        {slides.map((slide, index) => (
          <div
            key={`title-${index}`}
            data-index={index}
            className="title-group absolute bottom-24 left-6 md:bottom-32 md:left-12"
            style={{ visibility: index === 0 ? "visible" : "hidden", opacity: index === 0 ? 1 : 0 }}
          >
            {slide.eyebrow ? (
              <Copy>
                <p className="mb-3 text-xs tracking-[0.35em] text-white/80 uppercase">
                  {slide.eyebrow}
                </p>
              </Copy>
            ) : null}
            {slide.title ? (
              <Copy>
                <h1 className="max-w-3xl text-4xl font-bold text-white md:text-6xl">
                  {slide.title}
                </h1>
              </Copy>
            ) : null}
            {slide.subtitle ? (
              <Copy>
                <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
                  {slide.subtitle}
                </p>
              </Copy>
            ) : null}
          </div>
        ))}
      </div>

      <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-10">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            ref={(el) => {
              indicatorsRef.current[index] = el;
            }}
            className="relative h-3 w-3 rounded-full border border-white/70 bg-transparent opacity-40"
            aria-label={`Slide ${index + 1}`}
          >
            <span className="ring absolute inset-0 rounded-full border border-white scale-0 opacity-0" />
          </button>
        ))}
      </div>
    </section>
  );
}
