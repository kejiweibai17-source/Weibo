import "server-only";
import {
  HOME_BLADE_INTRO_FALLBACK,
  type HomeBladeIntroItem,
  type HomeBladeIntroSection,
} from "@/data/home-blade-intro-fallback";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeItems(raw: unknown): HomeBladeIntroItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const title = typeof row.title === "string" ? row.title.trim() : "";
      if (!title) return null;
      const id =
        typeof row.id === "string" && row.id.trim()
          ? row.id.trim()
          : `blade-${title}`;
      return {
        id,
        label: typeof row.label === "string" ? row.label : "",
        title,
        description: typeof row.description === "string" ? row.description : "",
      } satisfies HomeBladeIntroItem;
    })
    .filter((item): item is HomeBladeIntroItem => item !== null);
}

function normalizeSection(raw: unknown): HomeBladeIntroSection | null {
  if (!raw || typeof raw !== "object") return null;

  const row = raw as Record<string, unknown>;
  const introRaw = row.intro;
  const accordionRaw = row.accordion;
  if (!introRaw || typeof introRaw !== "object") return null;
  if (!accordionRaw || typeof accordionRaw !== "object") return null;

  const intro = introRaw as Record<string, unknown>;
  const accordion = accordionRaw as Record<string, unknown>;
  const items = normalizeItems(accordion.items);
  if (items.length === 0) return null;

  return {
    intro: {
      label: typeof intro.label === "string" ? intro.label : "",
      title: typeof intro.title === "string" ? intro.title : "",
      description: typeof intro.description === "string" ? intro.description : "",
      backgroundImage:
        typeof intro.backgroundImage === "string" ? intro.backgroundImage.trim() : "",
    },
    accordion: {
      eyebrow: typeof accordion.eyebrow === "string" ? accordion.eyebrow : "Blade System",
      title: typeof accordion.title === "string" ? accordion.title : "刀頭介紹",
      items,
    },
  };
}

function withFallbackAssets(section: HomeBladeIntroSection): HomeBladeIntroSection {
  return {
    ...section,
    intro: {
      ...section.intro,
      backgroundImage:
        section.intro.backgroundImage || HOME_BLADE_INTRO_FALLBACK.intro.backgroundImage,
    },
  };
}

function getHomeFetchInit(): RequestInit {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" };
  }
  return { next: { revalidate: 60 } };
}

export async function getHomeBladeIntroSection(): Promise<HomeBladeIntroSection | null> {
  const base = getWpBase();
  if (!base) return withFallbackAssets(HOME_BLADE_INTRO_FALLBACK);

  try {
    const res = await fetch(
      `${base}/wp-json/smasmall/v1/home-blade-intro`,
      getHomeFetchInit(),
    );
    if (!res.ok) return withFallbackAssets(HOME_BLADE_INTRO_FALLBACK);

    const data = await res.json();
    const section = normalizeSection(data?.section);
    if (!section) return null;

    return withFallbackAssets(section);
  } catch {
    return withFallbackAssets(HOME_BLADE_INTRO_FALLBACK);
  }
}
