import "server-only";
import { HOME_CAROUSEL_FALLBACK_SLIDES, type HomeCarouselSlide } from "@/data/home-carousel-fallback";
export async function getHomeCarouselSlides(): Promise<HomeCarouselSlide[]> {
  return [...HOME_CAROUSEL_FALLBACK_SLIDES];
}
