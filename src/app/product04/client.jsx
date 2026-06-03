"use client";
import Parallax from "@/components/ParallaxPage";
import Parallax01 from "@/components/ParallaxPage-product-04";
import { useRef } from "react";
import TimelineSlider from "@/components/TimelineSlider-04";
import gsap from "gsap";
import ProductShow from "@/components/ProductShow-star";
import { CustomEase } from "gsap/CustomEase";
import Slider from "@/components/Slider04";
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
