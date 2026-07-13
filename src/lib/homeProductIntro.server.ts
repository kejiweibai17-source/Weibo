import "server-only";
import {
  HOME_PRODUCT_INTRO_FALLBACK,
  HOME_PRODUCT_INTRO_FEATURES_FALLBACK,
  type HomeProductIntroFeature,
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

function normalizeFeatures(raw: unknown): HomeProductIntroFeature[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...HOME_PRODUCT_INTRO_FEATURES_FALLBACK];
  }

  const features: HomeProductIntroFeature[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    if (!title) continue;

    const idRaw = typeof item.id === "string" ? item.id.trim() : "";
    const id =
      idRaw.replace(/[^a-zA-Z0-9_-]/g, "") ||
      `feature-${features.length + 1}`;

    const description =
      typeof item.description === "string"
        ? item.description.trim()
        : typeof item.desc === "string"
          ? item.desc.trim()
          : "";

    const image = typeof item.image === "string" ? item.image.trim() : "";

    const fallback = HOME_PRODUCT_INTRO_FEATURES_FALLBACK[features.length];
    const top =
      typeof item.top === "string" && item.top.trim()
        ? item.top.trim()
        : (fallback?.top ?? "50%");
    const left =
      typeof item.left === "string" && item.left.trim()
        ? item.left.trim()
        : (fallback?.left ?? "50%");

    let bgScale = fallback?.bgScale ?? 2.4;
    if (typeof item.bgScale === "number" && Number.isFinite(item.bgScale)) {
      bgScale = item.bgScale;
    } else if (typeof item.bgScale === "string" && item.bgScale.trim()) {
      const parsed = Number.parseFloat(item.bgScale);
      if (Number.isFinite(parsed)) bgScale = parsed;
    }

    features.push({
      id,
      title,
      description,
      image: image || fallback?.image || "",
      top,
      left,
      bgScale,
    });

    if (features.length >= 8) break;
  }

  return features.length ? features : [...HOME_PRODUCT_INTRO_FEATURES_FALLBACK];
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
    features: normalizeFeatures(row.features),
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
