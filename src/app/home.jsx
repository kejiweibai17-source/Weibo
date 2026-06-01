"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import HomeHero from "../components/HomeHero";
import Parallax from "../components/ParallaxPage";
import EmblaCarousel, { OPTIONS } from "@/components/EmblaCarousel/index";
import TextParallaxContentExample02 from "../components/TextParallaxContent02/page";
import Slider from "../components/Slider/Slider";
import TextScrollSequence from "../components/TextScrollSequence";
import ContactSection from "../components/ContactSection";
import S3 from "../components/S3GroomingPrecision";

export default function Home({ carouselSlides = [] }) {
  const containerRef = useRef(null);
  const pageContentRef = useRef(null);

  return (
    <main ref={containerRef} className="relative    ">
      <HomeHero pageContentRef={pageContentRef} />

      {/* 僅移除 opacity-0，讓底下的 GSAP 能夠正常鎖定背景 */}
      <div ref={pageContentRef} className="page-content z-10 relative">
        <TextScrollSequence />
        <Parallax />
        <Slider />
        <S3 />
        <TextParallaxContentExample02 />
        <section>
          <Image
            src="/images/b91b5cc9-729c-4f89-a75e-fe43576c1762.png"
            className="w-full"
            alt=""
            placeholder="empty"
            loading="lazy"
            width={1920}
            height={800}
          ></Image>
        </section>
        <EmblaCarousel slides={carouselSlides} options={OPTIONS} />
        <ContactSection />
      </div>
    </main>
  );
}
