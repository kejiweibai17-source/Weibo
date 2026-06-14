"use client";

import React, { useRef } from "react";
import Image from "next/image";
import HomeHero from "../components/HomeHero";
import Parallax from "../components/ParallaxPage";
import EmblaCarousel, { OPTIONS } from "@/components/EmblaCarousel/index";
import TextParallaxContentExample02 from "../components/TextParallaxContent02/page";
import Slider from "../components/Slider/Slider";
import TextScrollSequence from "../components/TextScrollSequence";
import ContactSection from "../components/ContactSection";
import S3 from "../components/S3GroomingPrecision";
import Copy from "@/components/Copy";

export default function Home({ carouselSlides = [], heroSlides = [] }) {
  const containerRef = useRef(null);
  const pageContentRef = useRef(null);

  return (
    <main ref={containerRef} className="relative    ">
      <HomeHero pageContentRef={pageContentRef} />

      {/* 僅移除 opacity-0，讓底下的 GSAP 能夠正常鎖定背景 */}
      <div ref={pageContentRef} className="page-content z-10 relative">
        <TextScrollSequence />
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <Copy>
              <p className="mb-4 text-sm tracking-wide text-gray-500 md:text-base">
                昔馬 SMASMALL 星座系列
              </p>
            </Copy>
            <Copy delay={0.08}>
              <h2 className="mb-6 text-3xl font-semibold leading-[1.12] tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                你的星座。你的風格
              </h2>
            </Copy>
            <Copy delay={0.16}>
              <p className="mx-auto max-w-xl text-base font-normal leading-relaxed text-gray-500 md:text-xl">
                火、土、風、水四象主題配色，專屬星座圖騰與質感禮盒。
                <br className="hidden sm:inline" />
                獻給懂品味的你。
              </p>
            </Copy>

            <div className="mt-10 flex justify-center md:mt-12">
              <a
                href="https://www.weiz.com.tw/products/h040137"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-gray-900/10 bg-white/55 px-8 py-3.5 text-sm font-medium tracking-wide text-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:border-gray-900/20 hover:bg-white/75 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] md:px-10 md:py-4 md:text-base"
              >
                星座系列禮盒
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>
          <Image
            src="/images/d1f3c865-6383-4b3c-b00d-4c9f028d6c3c.png"
            className="mx-auto w-full max-w-[900px]"
            alt="昔馬 SMASMALL 星座系列電動刮鬍刀禮盒 四象配色展示 威柏科技-昔馬電動刮鬍刀總代理"
            placeholder="empty"
            loading="lazy"
            width={1920}
            height={800}
          />
        </section>
        <EmblaCarousel slides={carouselSlides} options={OPTIONS} />

        <Slider slides={heroSlides} />
        <S3 />

        <Parallax />
        <TextParallaxContentExample02 />
        <ContactSection />
      </div>
    </main>
  );
}
