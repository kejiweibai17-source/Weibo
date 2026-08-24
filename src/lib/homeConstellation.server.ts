import "server-only";
import {
  HOME_CONSTELLATION_FALLBACK,
  type HomeConstellationSection,
} from "@/data/home-constellation-fallback";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeSection(raw: unknown): HomeConstellationSection | null {
  if (!raw || typeof raw !== "object") return null;

  const row = raw as Record<string, unknown>;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!title) return null;

  const hrefRaw = typeof row.ctaHref === "string" ? row.ctaHref.trim() : "";
  const ctaHref =
    hrefRaw.startsWith("/") ? hrefRaw : hrefRaw ? `/${hrefRaw}` : "/series/constellation";

  return {
    eyebrow: typeof row.eyebrow === "string" ? row.eyebrow : "",
    title,
    description: typeof row.description === "string" ? row.description : "",
    ctaLabel: typeof row.ctaLabel === "string" ? row.ctaLabel : "",
    ctaHref,
    image: typeof row.image === "string" ? row.image.trim() : "",
    imageAlt: typeof row.imageAlt === "string" ? row.imageAlt : "",
  };
}

function withFallbackImage(section: HomeConstellationSection): HomeConstellationSection {
  if (section.image) return section;
  return {
    ...section,
    image: HOME_CONSTELLATION_FALLBACK.image,
    imageAlt: section.imageAlt || HOME_CONSTELLATION_FALLBACK.imageAlt,
  };
}

function getHomeFetchInit(): RequestInit {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" };
  }
  return { next: { revalidate: 60 } };
}

/** 從 WordPress REST 取得首頁星座系列區塊 */
export async function getHomeConstellationSection(): Promise<HomeConstellationSection | null> {
  const base = getWpBase();
  if (!base) return withFallbackImage(HOME_CONSTELLATION_FALLBACK);

  try {
    const res = await fetch(
      `${base}/wp-json/smasmall/v1/home-constellation`,
      getHomeFetchInit(),
    );
    if (!res.ok) return withFallbackImage(HOME_CONSTELLATION_FALLBACK);

    const data = await res.json();
    const section = normalizeSection(data?.section);
    if (!section) return null;

    return withFallbackImage(section);
  } catch {
    return withFallbackImage(HOME_CONSTELLATION_FALLBACK);
  }
}
