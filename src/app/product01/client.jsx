"use client";
import Parallax from "@/components/ParallaxPage";
import Parallax01 from "@/components/ParallaxPage-product";
import { useRef } from "react";
import TimelineSlider from "@/components/TimelineSlider";
import gsap from "gsap";
import ProductShow from "@/components/ProductShowcase";
import { CustomEase } from "gsap/CustomEase";
import Slider from "@/components/Slider01";
const QaClient = () => {
  return (
    <>
      <Slider />
      <TimelineSlider />
      <ProductShow />
      <Parallax01 />
    </>
  );
};

export default QaClient;
