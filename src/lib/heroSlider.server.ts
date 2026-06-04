import "server-only";
import {
  HERO_SLIDER_FALLBACK_SLIDES,
  type HeroSliderSlide,
} from "@/data/hero-slider-fallback";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeSlides(raw: unknown): HeroSliderSlide[] {
  if (!Array.isArray(raw)) return [];

  const slides: HeroSliderSlide[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;

    const image =
      typeof (item as { image?: unknown }).image === "string"
        ? (item as { image: string }).image.trim()
        : "";
    const title =
      typeof (item as { title?: unknown }).title === "string"
        ? (item as { title: string }).title.trim()
        : "";
    const description =
      typeof (item as { description?: unknown }).description === "string"
        ? (item as { description: string }).description.trim()
        : "";

    if (!image || !title) continue;

    slides.push({
      image,
      title,
      description: description || title,
    });
  }

  return slides;
}

/** 從 WordPress REST 取得首頁 Hero 滾動 Slider；失敗時回傳內建預設 */
export async function getHeroSliderSlides(): Promise<HeroSliderSlide[]> {
  const base = getWpBase();
  if (!base) return [...HERO_SLIDER_FALLBACK_SLIDES];

  try {
    const res = await fetch(`${base}/wp-json/smasmall/v1/hero-slider`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [...HERO_SLIDER_FALLBACK_SLIDES];

    const data = await res.json();
    const slides = normalizeSlides(data?.slides);
    return slides.length > 0 ? slides : [...HERO_SLIDER_FALLBACK_SLIDES];
  } catch {
    return [...HERO_SLIDER_FALLBACK_SLIDES];
  }
}
