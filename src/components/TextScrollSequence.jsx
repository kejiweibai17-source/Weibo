"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BG_IMAGE = "/images/275ad111-0677-4b7d-b249-4c4d6f93836c.png";
const CONSTELLATION = "/images/accessories/星座系列電動刮鬍刀禮盒";

const ELEMENT_CARDS = [
  {
    label: "FIRE SIGNS",
    sub: "火象星座",
    src: `${CONSTELLATION}/主圖_火象.jpg`,
  },
  {
    label: "AIR SIGNS",
    sub: "風象星座",
    src: `${CONSTELLATION}/主圖_風象.jpg`,
  },
  {
    label: "EARTH SIGNS",
    sub: "土象星座",
    src: `${CONSTELLATION}/主圖_土象.jpg`,
  },
  {
    label: "WATER SIGNS",
    sub: "水象星座",
    src: `${CONSTELLATION}/主圖_水象.jpg`,
  },
];

const SLIDE_COUNT = 3;

function SlideDiscover() {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="reveal-line mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-amber-200/90 sm:text-xs">
        Discover Your Sign
      </p>
      <h2 className="reveal-line mb-5 text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
        探索屬於你的星座
      </h2>
      <p className="reveal-line text-sm font-light tracking-wide text-white/85 sm:text-base md:text-lg">
        四象限定 · 星座系列電動刮鬍刀
      </p>
    </div>
  );
}

function SlideFourElements() {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center px-4">
      <p className="reveal-line mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-xs">
        SMASMALL 昔馬 · Four Elements
      </p>
      <h2 className="reveal-line text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
        星座系列
      </h2>
      <h2 className="reveal-line mb-4 text-2xl font-semibold tracking-tight text-amber-200 drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl">
        電動刮鬍刀禮盒
      </h2>
      <p className="reveal-line mb-8 text-sm font-light tracking-[0.2em] text-white/80 sm:text-base">
        火 · 風 · 土 · 水　四象限定
      </p>

      <div className="reveal-line grid w-full max-w-3xl grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {ELEMENT_CARDS.map((card) => (
          <div key={card.label} className="flex flex-col items-center gap-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-black/20">
              <Image
                src={card.src}
                alt={card.sub}
                fill
                sizes="(max-width: 768px) 22vw, 160px"
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-[8px] font-medium uppercase tracking-wider text-white/90 sm:text-[10px]">
                {card.label}
              </p>
              <p className="text-[9px] text-white/55 sm:text-[11px]">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideBornSharp() {
  const features = ["磁吸快拆刀網", "荷蘭進口鍍鋼刀片", "IPX7 全機防水"];

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-center md:justify-between md:gap-10 lg:gap-16">
      <div className="reveal-line flex shrink-0 items-end justify-center gap-3 md:gap-4">
        <div className="relative h-36 w-20 sm:h-44 sm:w-24 md:h-52 md:w-28">
          <Image
            src={`${CONSTELLATION}/產品內容物/星座系列電動刮鬍刀禮盒-風象星座-02.png`}
            alt="昔馬星座系列電動刮鬍刀 風象星座"
            fill
            sizes="120px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
        <div className="relative h-24 w-32 overflow-hidden rounded-sm bg-black/20 sm:h-28 sm:w-40 md:h-32 md:w-48">
          <Image
            src={`${CONSTELLATION}/產品內容物/星座系列電動刮鬍刀禮盒.png`}
            alt="昔馬星座系列電動刮鬍刀禮盒 四象全系列"
            fill
            sizes="200px"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div className="reveal-line flex flex-col items-center text-center md:items-end md:text-right">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-xs">
          SMASMALL 昔馬
        </p>
        <h2 className="mb-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          為俐落而生
        </h2>
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200 sm:text-base">
          Born To Be Sharp
        </p>
        <ul className="space-y-2.5 text-sm font-light text-white/90 sm:text-base">
          {features.map((item) => (
            <li key={item} className="reveal-line flex items-center gap-2 md:justify-end">
              <span className="text-amber-200/90" aria-hidden>
                ◆
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const SLIDES = [SlideDiscover, SlideFourElements, SlideBornSharp];

export default function TextScrollSequence() {
  const sliderRef = useRef(null);
  const indicesRef = useRef(null);
  const progressBarRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useGSAP(
    () => {
      let currentActive = 0;
      const pinDistance = window.innerHeight * SLIDE_COUNT;

      function createIndices() {
        if (!indicesRef.current) return;
        indicesRef.current.innerHTML = "";

        SLIDES.forEach((_, index) => {
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

      function revealSlide(index) {
        slideRefs.current.forEach((slideEl, i) => {
          if (!slideEl) return;

          if (i !== index) {
            gsap.set(slideEl, { autoAlpha: 0, pointerEvents: "none" });
            return;
          }

          gsap.set(slideEl, { autoAlpha: 1, pointerEvents: "auto" });
          const lines = slideEl.querySelectorAll(".reveal-line");

          gsap.set(lines, { y: 36, opacity: 0, filter: "blur(10px)" });
          gsap.to(lines, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.09,
            ease: "power3.out",
          });
        });
      }

      createIndices();
      revealSlide(0);

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

          let nextSlide = Math.floor(self.progress * SLIDE_COUNT);
          nextSlide = Math.min(nextSlide, SLIDE_COUNT - 1);

          if (currentActive !== nextSlide) {
            currentActive = nextSlide;
            setActiveSlide(nextSlide);
            revealSlide(nextSlide);
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
        {SLIDES.map((Slide, index) => (
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
