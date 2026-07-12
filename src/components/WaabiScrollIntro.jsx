"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX_WIDTH = 767;

const COLS = [
  [
    "/images/no-background/1731575318_6ddbd86976c9b624412a.png",
    "/images/no-background/1731575318_e5721d95d4208fd0501b.png",
    "/images/no-background/傳奇灰.png",
    "/images/no-background/5.png",
    "/images/no-background/截圖-2026-05-17-晚上7.35.34.png",
  ],
  [
    "/images/no-background/2.png",
    "/images/no-background/星座.png",
    "/images/no-background/6.png",
    "/images/no-background/1731575318_e5721d95d4208fd0501b.png",
  ],
  [
    "/images/no-background/1731575318_6ddbd86976c9b624412a.png",
    "/images/no-background/1731575318_e5721d95d4208fd0501b.png",
    "/images/no-background/傳奇灰.png",
    "/images/no-background/5.png",
    "/images/no-background/截圖-2026-05-17-晚上7.35.34.png",
  ],
  [
    "/images/no-background/2.png",
    "/images/no-background/星座.png",
    "/images/no-background/6.png",
    "/images/no-background/1731575318_e5721d95d4208fd0501b.png",
  ],
];

function setupHeroPin(heroEl, refs, scrollMultiplier, shrinkSize) {
  const { heroImgRef, heroHeaderRef } = refs;

  return ScrollTrigger.create({
    trigger: heroEl,
    start: "top top",
    end: () => `+=${window.innerHeight * scrollMultiplier}`,
    pin: true,
    pinSpacing: false,
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;

      const headerProg = Math.min(p / 0.45, 1);
      gsap.set(heroHeaderRef.current, { yPercent: -headerProg * 100 });

      const imgProg = Math.max(0, Math.min((p - 0.5) / 0.5, 1));
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      gsap.set(heroImgRef.current, {
        width: gsap.utils.interpolate(vw, shrinkSize, imgProg),
        height: gsap.utils.interpolate(vh, shrinkSize, imgProg),
        borderRadius: gsap.utils.interpolate(0, 12, imgProg),
      });
    },
  });
}

function setupColParallax(aboutEl, ref, startY, endY, startX) {
  gsap.set(ref.current, { y: startY, x: startX });
  return gsap.to(ref.current, {
    y: endY,
    ease: "none",
    scrollTrigger: {
      trigger: aboutEl,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function MobileProductSection({ aboutText, aboutSubtext }) {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(leftRef.current, { y: 160 });
      gsap.set(rightRef.current, { y: -160 });
      gsap.to(leftRef.current, {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(rightRef.current, {
        y: 160,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "90svh" }}
    >
      <div className="absolute inset-0 flex justify-between items-center px-3 overflow-hidden">
        <div
          ref={leftRef}
          className="flex flex-col gap-3 will-change-transform"
          style={{ height: "140%", width: "28%" }}
        >
          {COLS[0].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl aspect-square w-full"
            >
              <Image
                src={src}
                alt={`SMASMALL 產品圖 ${i + 1}`}
                fill
                sizes="28vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div
          ref={rightRef}
          className="flex flex-col gap-3 will-change-transform"
          style={{ height: "140%", width: "28%" }}
        >
          {COLS[1].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl aspect-square w-full"
            >
              <Image
                src={src}
                alt={`SMASMALL 產品圖 ${i + 5}`}
                fill
                sizes="28vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 max-w-[38%] text-center">
        <h3 className="text-[1rem] leading-[1.4] font-light text-gray-900 tracking-[-0.02em] mb-3">
          {aboutText}
        </h3>
        {aboutSubtext && (
          <p className="text-[0.72rem] text-gray-500 leading-relaxed font-light mb-6">
            {aboutSubtext}
          </p>
        )}
        <a
          href="/contact"
          className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 text-[0.6rem] font-bold tracking-[0.15em] uppercase px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          CONTACT
        </a>
      </div>
    </section>
  );
}

function MobileHeroBanner({
  heroImage,
  heroLabel,
  heroTitle,
  heroCopy,
  imageAlt,
}) {
  return (
    <section className="relative w-full overflow-hidden pt-[60px]">
      <div className="relative w-full aspect-[4/5] max-h-[85svh] min-h-[420px]">
        <Image
          src={heroImage}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {heroLabel && (
            <p className="text-[0.7rem] font-medium tracking-[0.18em] uppercase opacity-75 mb-3">
              {heroLabel}
            </p>
          )}
          <h1 className="text-[1.9rem] font-light leading-snug tracking-[-0.04em] mb-4">
            {heroTitle}
          </h1>
          <p className="text-[0.95rem] font-light leading-[1.6] tracking-[-0.01em] opacity-85 max-w-[90%]">
            {heroCopy}
          </p>
        </div>
      </div>
    </section>
  );
}

function DesktopScrollIntro({
  heroImage,
  heroLabel,
  heroTitle,
  heroCopy,
  aboutText,
  aboutSubtext,
  imageAlt,
}) {
  const containerRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const aboutRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(
    () => {
      const heroEl = containerRef.current.querySelector(".waabi-hero");
      const aboutEl = aboutRef.current;
      const refs = { heroImgRef, heroHeaderRef };

      const buildAll = (shrinkSize, colConfig) => {
        const heroST = setupHeroPin(heroEl, refs, 2.0, shrinkSize);
        const colTweens = colConfig.map((c) =>
          setupColParallax(aboutEl, c.ref, c.startY, c.endY, c.startX),
        );
        return () => {
          heroST.kill();
          colTweens.forEach((t) => t.scrollTrigger?.kill());
        };
      };

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () =>
        buildAll(110, [
          { ref: col1Ref, startY: 250, endY: -250, startX: 0 },
          { ref: col2Ref, startY: 125, endY: -125, startX: -40 },
          { ref: col3Ref, startY: 125, endY: -125, startX: 40 },
          { ref: col4Ref, startY: 250, endY: -250, startX: 0 },
        ]),
      );

      mm.add("(min-width: 768px)", () =>
        buildAll(160, [
          { ref: col1Ref, startY: 500, endY: -500, startX: 0 },
          { ref: col2Ref, startY: 250, endY: -250, startX: -120 },
          { ref: col3Ref, startY: 250, endY: -250, startX: 120 },
          { ref: col4Ref, startY: 500, endY: -500, startX: 0 },
        ]),
      );

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <div ref={containerRef} className="waabi-root font-sans overflow-x-hidden">
      <section
        className="waabi-hero relative w-full overflow-hidden pt-[72px]"
        style={{ height: "100svh" }}
      >
        <div
          ref={heroImgRef}
          className="absolute top-1/2 left-1/2 overflow-hidden will-change-[transform,width,height]"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <Image
            src={heroImage}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div
          ref={heroHeaderRef}
          className="absolute inset-0 flex items-end p-6 md:p-10 lg:p-16 will-change-transform overflow-hidden text-white"
        >
          <div>
            {heroLabel && (
              <p className="text-[0.7rem] md:text-[0.75rem] font-medium tracking-[0.18em] uppercase opacity-70 mb-3">
                {heroLabel}
              </p>
            )}
            <h1 className="text-[1.75rem] md:text-[2.5rem] lg:text-[3.5rem] font-light leading-snug tracking-[-0.04em] w-full md:w-2/3 xl:w-1/2 mb-4">
              {heroTitle}
            </h1>
            {heroCopy && (
              <p className="text-[0.85rem] md:text-[1rem] font-light leading-relaxed opacity-80 max-w-lg">
                {heroCopy}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-[200vh]" aria-hidden="true" />

      <section
        ref={aboutRef}
        className="relative w-full flex items-center justify-center text-center overflow-hidden h-[100svh] -mt-[75vh]"
      >
        <div className="absolute inset-0 flex justify-between items-center px-6 md:px-16 overflow-hidden">
          {[col1Ref, col2Ref, col3Ref, col4Ref].map((ref, colIdx) => (
            <div
              key={colIdx}
              ref={ref}
              className="relative will-change-transform flex flex-col justify-around gap-3"
              style={{ height: "125%", flex: "0 0 auto", width: "22%" }}
            >
              {COLS[colIdx].map((src, imgIdx) => (
                <div
                  key={imgIdx}
                  className="relative overflow-hidden rounded-xl mx-auto w-full max-w-[72px] md:max-w-[180px] aspect-square"
                >
                  <Image
                    src={src}
                    alt={`SMASMALL 產品圖 ${colIdx * 4 + imgIdx + 1}`}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 px-3 md:px-6 max-w-[36%] md:max-w-xl text-center">
          <h3 className="text-[0.8rem] md:text-[1.8rem] lg:text-[2.2rem] text-gray-900 leading-[1.3] font-light tracking-[-0.02em] mb-2 md:mb-4">
            {aboutText}
          </h3>
          {aboutSubtext && (
            <p className="hidden md:block text-[1rem] text-gray-500 leading-relaxed font-light mb-8">
              {aboutSubtext}
            </p>
          )}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 text-xs font-bold tracking-[0.15em] uppercase px-7 py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            CONTACT
          </a>
        </div>
      </section>

      <style jsx global>{`
        .waabi-root h1,
        .waabi-root h3 {
          font-weight: 300;
        }
      `}</style>
    </div>
  );
}

export default function WaabiScrollIntro({
  heroImage = "/images/海报.jpg",
  heroLabel = "首篇 SMASMALL",
  heroTitle = "小事精做，智見未來。",
  heroCopy = 'SMASMALL 名字源自 "Do small things to smart things"，代表從每一件小事開始，以專注細節的態度，累積卓越品質，創造更美好的生活。',
  aboutText = "我對幸福生活，也相信每一位使用者都是自己生活中的主角。",
  aboutSubtext = "SMASMALL 不只是提供個人護理產品，更希望透過產品品質與設計師的造品，陪伴每一個人享受更舒適、更自在、更有質感的生活方式。",
  imageAlt = "SMASMALL 昔馬電動刮鬍刀",
}) {
  return (
    <DesktopScrollIntro
      heroImage={heroImage}
      heroLabel={heroLabel}
      heroTitle={heroTitle}
      heroCopy={heroCopy}
      aboutText={aboutText}
      aboutSubtext={aboutSubtext}
      imageAlt={imageAlt}
    />
  );
}
