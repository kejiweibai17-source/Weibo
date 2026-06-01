"use client";
import Parallax from "@/components/ParallaxPage";
import Parallax01 from "@/components/ParallaxPage-product-02";
import { useRef } from "react";
import TimelineSlider from "@/components/TimelineSlider-02";
import gsap from "gsap";
import ProductShow from "@/components/ProductShow-dark";
import { CustomEase } from "gsap/CustomEase";
import Slider from "@/components/Slider02";
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
