import "server-only";
export type HeroSliderSlide = { image?: string; title?: string; [k: string]: unknown };
export async function getHeroSliderSlides(): Promise<HeroSliderSlide[]> {
  return [];
}
