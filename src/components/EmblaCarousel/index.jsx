"use client";
import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import { HOME_CAROUSEL_FALLBACK_SLIDES } from "@/data/home-carousel-fallback";

const OPTIONS = { dragFree: true, loop: true };

const EmblaCarouselSection = ({ slides, options = OPTIONS }) => {
  const resolved =
    Array.isArray(slides) && slides.length > 0
      ? slides
      : HOME_CAROUSEL_FALLBACK_SLIDES;

  return <EmblaCarousel slides={resolved} options={options} />;
};

export default EmblaCarouselSection;
export { OPTIONS };
