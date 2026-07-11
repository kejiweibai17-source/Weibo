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
    <main ref={containerRef} className="relative    ">
      <HomeHero pageContentRef={pageContentRef} />

      {/* 僅移除 opacity-0，讓底下的 GSAP 能夠正常鎖定背景 */}
      <div ref={pageContentRef} className="page-content z-10 relative">
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
