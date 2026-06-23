"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  TEXT_SCROLL_SLIDE_COUNT,
  TEXT_SCROLL_SLIDES,
  revealTextScrollSlide,
} from "./textScrollSequenceSlides";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BG_IMAGE = "/images/275ad111-0677-4b7d-b249-4c4d6f93836c.png";

export default function TextScrollSequence() {
  const sliderRef = useRef(null);
  const indicesRef = useRef(null);
  const progressBarRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useGSAP(
    () => {
      let currentActive = 0;
      const pinDistance = window.innerHeight * TEXT_SCROLL_SLIDE_COUNT;

      function createIndices() {
        if (!indicesRef.current) return;
        indicesRef.current.innerHTML = "";

        TEXT_SCROLL_SLIDES.forEach((_, index) => {
          const indexNum = (index + 1).toString().padStart(2, "0");
          const indicatorElement = document.createElement("div");
          indicatorElement.dataset.index = index;
          indicatorElement.className =
            "mb-4 flex items-center justify-end gap-3 font-mono text-sm text-white";
          indicatorElement.innerHTML = `
            <span class="marker block h-[1px] w-3 origin-right scale-x-0 bg-white"></span>
            <span class="index opacity-30">${indexNum}</span>
          `;
          indicesRef.current.appendChild(indicatorElement);

          if (index === 0) {
            gsap.set(indicatorElement.querySelector(".index"), { opacity: 1 });
            gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 1 });
          }
        });
      }

      function animateIndicators(index) {
        if (!indicesRef.current) return;
        indicesRef.current.querySelectorAll("div").forEach((indicator, i) => {
          const marker = indicator.querySelector(".marker");
          const idxEl = indicator.querySelector(".index");
          const isActive = i === index;

          gsap.to(idxEl, {
            opacity: isActive ? 1 : 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(marker, {
            scaleX: isActive ? 1 : 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }

      createIndices();
      revealTextScrollSlide(slideRefs, 0);

      ScrollTrigger.create({
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleY: self.progress });
          }

          let nextSlide = Math.floor(self.progress * TEXT_SCROLL_SLIDE_COUNT);
          nextSlide = Math.min(nextSlide, TEXT_SCROLL_SLIDE_COUNT - 1);

          if (currentActive !== nextSlide) {
            currentActive = nextSlide;
            setActiveSlide(nextSlide);
            revealTextScrollSlide(slideRefs, nextSlide);
            animateIndicators(nextSlide);
          }
        },
      });
    },
    { scope: sliderRef },
  );

  return (
    <section
      ref={sliderRef}
      className="relative h-screen w-full overflow-hidden font-sans text-white"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-black/70" aria-hidden />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {TEXT_SCROLL_SLIDES.map((Slide, index) => (
          <div
            key={index}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="absolute inset-0 flex items-center justify-center px-4"
            style={{
              visibility: index === activeSlide ? "visible" : "hidden",
              opacity: index === activeSlide ? 1 : 0,
            }}
          >
            <Slide />
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 items-center gap-6 md:right-12">
        <div ref={indicesRef} className="flex flex-col" />
        <div className="relative h-[200px] w-[1px] bg-white/20 md:h-[300px]">
          <div
            ref={progressBarRef}
            className="absolute left-1/2 top-0 h-full w-[3px] origin-top -translate-x-1/2 scale-y-0 bg-white"
          />
        </div>
      </div>
    </section>
  );
}
