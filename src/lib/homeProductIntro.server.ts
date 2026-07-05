import "server-only";
import {
  HOME_PRODUCT_INTRO_FALLBACK,
  type HomeProductIntroSection,
  type HomeProductIntroSpec,
} from "@/data/home-product-intro-fallback";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeSpecs(raw: unknown): HomeProductIntroSpec[] {
  if (!Array.isArray(raw)) return [];

  const specs: HomeProductIntroSpec[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const value = typeof item.value === "string" ? item.value.trim() : "";
    if (!value) continue;
    specs.push({ label: label || "規格", value });
    if (specs.length >= 4) break;
  }
  return specs;
}

function normalizeSection(raw: unknown): HomeProductIntroSection | null {
  if (!raw || typeof raw !== "object") return null;

  const row = raw as Record<string, unknown>;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!title) return null;

  const specs = normalizeSpecs(row.specs);
  if (!specs.length) return null;

  return {
    backgroundImage:
      typeof row.backgroundImage === "string" ? row.backgroundImage.trim() : "",
    subtitle: typeof row.subtitle === "string" ? row.subtitle : "",
    title,
    description: typeof row.description === "string" ? row.description : "",
    specs,
  };
}

function getHomeFetchInit(): RequestInit {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" };
  }
  return { next: { revalidate: 60 } };
}

/** 從 WordPress REST 取得首頁產品介紹區塊 */
export async function getHomeProductIntroSection(): Promise<HomeProductIntroSection | null> {
  const base = getWpBase();
  if (!base) return HOME_PRODUCT_INTRO_FALLBACK;

  try {
    const res = await fetch(
      `${base}/wp-json/smasmall/v1/home-product-intro`,
      getHomeFetchInit(),
    );
    if (!res.ok) return HOME_PRODUCT_INTRO_FALLBACK;

    const data = await res.json();
    const section = normalizeSection(data?.section);
    if (!section) return null;

    return section;
  } catch {
    return HOME_PRODUCT_INTRO_FALLBACK;
  }
}
