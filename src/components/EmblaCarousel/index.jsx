"use client";
import React from "react";
import EmblaCarousel from "./EmblaCarousel";
// import Header from "./Header";
// import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// 這裡的陣列設定完全正確，剛剛的問題出在子組件沒正確讀取它
const SLIDES = [
  {
    image: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png",
    title: "專利認可",
    description: "Description for the first slide.",
  },
  {
    image: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
    title: "Third Slide",
    description: "Description for the second slide.",
  },
  {
    image: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/001.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/002.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/c27b8987-cfae-45a5-b9b1-9390b866a0d6.png",
    title: "Fourth Slide",
    description: "Description for the fourth slide.",
  },
  {
    image: "/images/004.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png",
    title: "Fifth Slide",
    description: "Description for the fifth slide.",
  },
];

const App = () => (
  <>
    {/* <Header /> */}
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    {/* <Footer /> */}
  </>
);

export default App;
