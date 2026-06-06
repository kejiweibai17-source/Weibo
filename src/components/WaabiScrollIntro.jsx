"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
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
  const { heroImgRef, heroHeaderRef, heroCopyRef, splitRef } = refs;
  let isHeroCopyHidden = false;

  return ScrollTrigger.create({
    trigger: heroEl,
    start: "top top",
    end: () => `+=${window.innerHeight * scrollMultiplier}`,
    pin: true,
    pinSpacing: false,
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;

      const headerProg = Math.min(p / 0.29, 1);
      gsap.set(heroHeaderRef.current, { yPercent: -headerProg * 100 });

      const wordsProg = Math.max(0, Math.min((p - 0.29) / 0.21, 1));
      const words = splitRef.current?.words ?? [];
      words.forEach((w, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        const opacity = Math.max(
          0.08,
          Math.min((wordsProg - start) / (end - start), 1),
        );
        gsap.set(w, { opacity });
      });

      if (p > 0.64 && !isHeroCopyHidden) {
        isHeroCopyHidden = true;
        gsap.to(heroCopyRef.current, { opacity: 0, duration: 0.2 });
      } else if (p <= 0.64 && isHeroCopyHidden) {
        isHeroCopyHidden = false;
        gsap.to(heroCopyRef.current, { opacity: 1, duration: 0.2 });
      }

      const imgProg = Math.max(0, Math.min((p - 0.71) / 0.29, 1));
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

function MobileHeroBanner({
  heroImage,
  heroTitle,
  heroCopy,
  imageAlt,
}) {
  return (
    <div className="waabi-root font-sans">
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
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h1 className="text-[1.75rem] font-light leading-snug tracking-[-0.04em] mb-4">
              {heroTitle}
            </h1>
            <p className="text-[1.1rem] font-light leading-[1.15] tracking-[-0.03em] opacity-90">
              {heroCopy}
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .waabi-root h1 {
          font-weight: 300;
        }
      `}</style>
    </div>
  );
}

function DesktopScrollIntro({
  heroImage,
  heroTitle,
  heroCopy,
  aboutText,
  imageAlt,
}) {
  const containerRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const heroCopyRef = useRef(null);
  const aboutRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);
  const splitRef = useRef(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(
    () => {
      const heroEl = containerRef.current.querySelector(".waabi-hero");
      const aboutEl = aboutRef.current;
      const refs = { heroImgRef, heroHeaderRef, heroCopyRef, splitRef };

      splitRef.current = new SplitType(heroCopyRef.current, {
        types: "words",
        wordClass: "st-word",
      });
      gsap.set(".st-word", { opacity: 0.08 });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const heroST = setupHeroPin(heroEl, refs, 3.5, 160);

        const cols = [
          { ref: col1Ref, startY: 500, endY: -500, startX: 0 },
          { ref: col2Ref, startY: 250, endY: -250, startX: -120 },
          { ref: col3Ref, startY: 250, endY: -250, startX: 120 },
          { ref: col4Ref, startY: 500, endY: -500, startX: 0 },
        ];
        const colTweens = cols.map((c) =>
          setupColParallax(aboutEl, c.ref, c.startY, c.endY, c.startX),
        );

        return () => {
          heroST.kill();
          colTweens.forEach((t) => t.scrollTrigger?.kill());
        };
      });

      return () => {
        mm.revert();
        splitRef.current?.revert?.();
      };
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
          <h1 className="text-[1.75rem] md:text-[2.5rem] lg:text-[3.5rem] font-light leading-snug tracking-[-0.04em] w-full md:w-2/3 xl:w-1/2">
            {heroTitle}
          </h1>
        </div>

        <div
          ref={heroCopyRef}
          className="absolute inset-0 flex items-end justify-end p-6 md:p-10 lg:p-16 will-change-[opacity] text-white"
        >
          <h3 className="text-[1.1rem] md:text-[1.5rem] lg:text-[2.5rem] font-light leading-[1.15] w-[55%] md:w-1/2 text-right tracking-[-0.03em]">
            {heroCopy}
          </h3>
        </div>
      </section>

      <div className="h-[350vh]" aria-hidden="true" />

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
                  className="relative overflow-hidden rounded-xl mx-auto w-full max-w-[180px] aspect-square opacity-100"
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

        <div className="relative z-10 px-5 md:px-6 max-w-2xl">
          <h3 className="text-[1.6rem] md:text-[2.2rem] lg:text-[2.75rem] text-gray-900 leading-[1.2] tracking-[-0.03em]">
            {aboutText}
          </h3>
        </div>
      </section>

      <style jsx global>{`
        .waabi-root h1,
        .waabi-root h3 {
          font-weight: 300;
        }
        .st-word {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default function WaabiScrollIntro({
  heroImage = "/images/953b6625-1fbc-4927-8b1c-bc709d4299e4.png",
  heroTitle = "探索昔馬系列，為品味男士打造的理容藝術品",
  heroCopy = "復古未來主義，全合金工藝的極致體驗",
  aboutText = "每個昔馬產品，都是值得被細心對待",
  outroText = "Ignite Possibilities Through Ultimate Innovation.",
  imageAlt = "SMASMALL 昔馬電動刮鬍刀",
}) {
  const isMobile = useIsMobileLayout();

  if (isMobile !== false) {
    return (
      <MobileHeroBanner
        heroImage={heroImage}
        heroTitle={heroTitle}
        heroCopy={heroCopy}
        imageAlt={imageAlt}
      />
    );
  }

  return (
    <DesktopScrollIntro
      heroImage={heroImage}
      heroTitle={heroTitle}
      heroCopy={heroCopy}
      aboutText={aboutText}
      imageAlt={imageAlt}
    />
  );
}
