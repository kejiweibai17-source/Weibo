"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";

import HomeHero from "../components/HomeHero";
import Parallax from "../components/ParallaxPage";
import EmblaCarousel from "@/components/EmblaCarousel/index";
import TextParallaxContentExample02 from "../components/TextParallaxContent02/page";
import Slider from "../components/Slider/Slider";
import TextScrollSequence from "../components/TextScrollSequence";
import S3 from "../components/S3GroomingPrecision";
const OPTIONS = { dragFree: true, loop: true };
const SLIDES = [
  {
    image: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png",
    title: "Slide 1",
  },
  {
    image: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
    title: "Slide 2",
  },
  {
    image: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png",
    title: "Slide 3",
  },
  {
    image: "/images/c27b8987-cfae-45a5-b9b1-9390b866a0d6.png",
    title: "Slide 4",
  },
];

export default function Home() {
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
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>
    </main>
  );
}
