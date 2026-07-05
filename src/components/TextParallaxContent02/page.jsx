"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Info, ChevronDown } from "lucide-react";
import { HOME_BLADE_INTRO_FALLBACK } from "@/data/home-blade-intro-fallback";

gsap.registerPlugin(ScrollTrigger);

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image.replace(/^\/+/, "")}`;
}

export default function ElegantScrollSection({ section = null }) {
  const data = section || HOME_BLADE_INTRO_FALLBACK;
  const intro = data.intro;
  const accordion = data.accordion;
  const defaultOpenId = accordion.items[0]?.id || "";

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(defaultOpenId);

  const backgroundImage = resolveImageSrc(intro.backgroundImage);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: bgRef.current,
        pinSpacing: false,
      });

      gsap.to(".slider-bg", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      gsap.fromTo(
        ".intro-item",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          stagger: 0.2,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".intro-container",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(".intro-content", {
        opacity: 0,
        y: -150,
        scrollTrigger: {
          trigger: ".intro-container",
          start: "top 20%",
          end: "top -20%",
          scrub: 1,
        },
      });

      gsap.fromTo(
        ".accordion-wrapper",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".accordion-container",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [section] },
  );

  if (!accordion.items?.length) return null;

  return (
    <section ref={containerRef} className="relative w-full bg-[#050507]">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 z-0 h-screen w-full overflow-hidden"
      >
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="slider-bg h-full w-full object-cover"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full pt-[15vh] pb-[30vh] text-white">
        <div className="intro-container flex min-h-screen items-center px-[6%] md:px-[10%]">
          <div className="intro-content flex w-full flex-col items-start justify-between gap-12 lg:flex-row lg:items-center lg:gap-24">
            <div className="intro-item w-full lg:w-1/2">
              {intro.label ? (
                <div className="mb-6 flex items-center gap-3 text-gray-400">
                  <Info size={18} />
                  <span className="text-sm font-medium tracking-wider uppercase">
                    {intro.label}
                  </span>
                </div>
              ) : null}
              {intro.title ? (
                <h1 className="text-2xl leading-tight font-normal tracking-wide drop-shadow-lg md:text-5xl">
                  {intro.title}
                </h1>
              ) : null}
            </div>

            {intro.description ? (
              <div className="intro-item w-full lg:w-[40%]">
                <p className="text-lg leading-relaxed font-light text-gray-300 md:text-xl">
                  {intro.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="accordion-container flex min-h-screen items-start px-[6%] pt-[10vh] md:px-[10%]">
          <div className="accordion-wrapper flex w-full flex-col border border-white/10 bg-white/[0.03] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl md:w-[60%] md:p-10 lg:w-[35%]">
            <div className="mb-2 border-b border-white/10 pb-6">
              {accordion.eyebrow ? (
                <p className="mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
                  {accordion.eyebrow}
                </p>
              ) : null}
              {accordion.title ? (
                <h2 className="text-xl font-medium tracking-wide text-white md:text-2xl">
                  {accordion.title}
                </h2>
              ) : null}
            </div>

            {accordion.items.map((item) => {
              const isOpen = openAccordion === item.id;

              return (
                <div
                  key={item.id}
                  className="border-b border-white/10 last:border-none"
                >
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(isOpen ? "" : item.id)}
                    className="group flex w-full flex-col gap-4 py-8 text-left"
                  >
                    <div className="flex w-full items-center justify-between">
                      {item.label ? (
                        <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                          {item.label}
                        </span>
                      ) : (
                        <span />
                      )}
                      <div className="flex h-8 w-8 items-center justify-center border border-white/5 bg-white/5 transition-colors duration-300 group-hover:bg-white/10">
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-500 ease-in-out ${
                            isOpen
                              ? "rotate-180 text-white"
                              : "group-hover:text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-medium tracking-wide transition-colors duration-300 md:text-xl ${
                        isOpen
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] pb-8 opacity-100"
                        : "grid-rows-[0fr] pb-0 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {item.description ? (
                        <p className="text-[14px] leading-8 font-light text-gray-300 md:text-[15px]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
