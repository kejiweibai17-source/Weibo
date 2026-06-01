import "server-only";
import {
  HOME_CAROUSEL_FALLBACK_SLIDES,
  type HomeCarouselSlide,
} from "@/data/home-carousel-fallback";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeSlides(raw: unknown): HomeCarouselSlide[] {
  if (!Array.isArray(raw)) return [];

  const slides: HomeCarouselSlide[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;

    const image =
      typeof (item as { image?: unknown }).image === "string"
        ? (item as { image: string }).image.trim()
        : "";
    if (!image) continue;

    const title =
      typeof (item as { title?: unknown }).title === "string"
        ? (item as { title: string }).title.trim()
        : "";

    slides.push(title ? { image, title } : { image });
  }

  return slides;
}

/** 從 WordPress REST 取得首頁底部輪播圖；失敗時回傳內建預設 */
export async function getHomeCarouselSlides(): Promise<HomeCarouselSlide[]> {
  const base = getWpBase();
  if (!base) return [...HOME_CAROUSEL_FALLBACK_SLIDES];

  try {
    const res = await fetch(`${base}/wp-json/smasmall/v1/home-carousel`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [...HOME_CAROUSEL_FALLBACK_SLIDES];

    const data = await res.json();
    const slides = normalizeSlides(data?.slides);
    return slides.length > 0 ? slides : [...HOME_CAROUSEL_FALLBACK_SLIDES];
  } catch {
    return [...HOME_CAROUSEL_FALLBACK_SLIDES];
  }
}
