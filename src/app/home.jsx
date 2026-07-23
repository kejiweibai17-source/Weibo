"use client";

import React, { useRef } from "react";
import HomeHero from "../components/HomeHero";
import Parallax from "../components/ParallaxPage";
import EmblaCarousel, { OPTIONS } from "@/components/EmblaCarousel/index";
import TextParallaxContentExample02 from "../components/TextParallaxContent02/page";
import Slider from "../components/Slider/Slider";
import ConstellationProductScroll from "../components/ConstellationProductScroll";
import HomeConstellationSection from "@/components/home/HomeConstellationSection";

export default function Home({
  carouselSlides = [],
  heroSlides = [],
  constellationSection = null,
  bladeIntroSection = null,
  productIntroSection = null,
}) {
  const containerRef = useRef(null);
  const pageContentRef = useRef(null);

  return (
    <main ref={containerRef} className="relative" data-seo-speakable>
      <HomeHero pageContentRef={pageContentRef} />

      {/*
        主內容始終留在 DOM（不 display:none），供搜尋引擎解析。
        Preloader 僅為視覺覆蓋層，結束後淡入動畫由 HomeHero 控制。
      */}
      <div
        ref={pageContentRef}
        className="page-content relative z-10"
        id="main-content"
      >
        <ConstellationProductScroll />
        <HomeConstellationSection section={constellationSection} />
        <EmblaCarousel slides={carouselSlides} options={OPTIONS} />

        <Slider slides={heroSlides} />

        <Parallax productIntroSection={productIntroSection} />
        <TextParallaxContentExample02 section={bladeIntroSection} />
      </div>
    </main>
  );
}
