/** 後台無資料或 API 失敗時的首頁底部輪播預設圖 */
export const HOME_CAROUSEL_FALLBACK_SLIDES = [
  {
    image: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png",
    title: "專利認可",
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
    image: "/images/001.png",
    title: "Slide 4",
  },
  {
    image: "/images/002.png",
    title: "Slide 5",
  },
  {
    image: "/images/c27b8987-cfae-45a5-b9b1-9390b866a0d6.png",
    title: "Slide 6",
  },
  {
    image: "/images/004.png",
    title: "Slide 7",
  },
] as const;

export type HomeCarouselSlide = {
  image: string;
  title?: string;
};
