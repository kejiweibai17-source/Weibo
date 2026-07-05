import "server-only";
import type {
  SeriesBlock,
  SeriesFeatureItem,
  SeriesNavItem,
  SeriesPage,
  SeriesShowcaseFeature,
  SeriesShowcaseItem,
  SeriesSummary,
} from "@/lib/seriesProducts.types";
import { SERIES_NAV_FALLBACK } from "@/lib/seriesProducts.constants";

export { SERIES_NAV_FALLBACK };

/** 系列頁 ISR 重新驗證秒數（與 accessories 一致） */
export const SERIES_PAGE_REVALIDATE = 3600;

function getSeriesFetchInit(slug?: string): RequestInit {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" };
  }

  const tags = ["series-all"];
  if (slug) {
    tags.push(`series-${slug}`);
  }

  return {
    next: {
      revalidate: SERIES_PAGE_REVALIDATE,
      tags,
    },
  };
}

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function parseVideoId(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const value = raw.trim();
  if (!value) return "";
  const match = value.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  );
  if (match?.[1]) return match[1];
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function normalizeStringArray(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeBlockType(raw: unknown): SeriesBlock["type"] | null {
  if (raw === "timeline_carousel") return "feature_slider";
  if (raw === "youtube_embed") return "product_video";
  if (raw === "hero_slider") return null;
  if (
    raw === "feature_slider" ||
    raw === "product_showcase" ||
    raw === "specs_panel" ||
    raw === "parallax_hero" ||
    raw === "text_banner" ||
    raw === "product_video"
  ) {
    return raw;
  }
  return null;
}

function normalizeBlock(raw: unknown): SeriesBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const type = normalizeBlockType(row.type);
  if (!type) return null;

  if (type === "feature_slider") {
    const items = Array.isArray(row.items)
      ? row.items
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const i = item as Record<string, unknown>;
            const image = typeof i.image === "string" ? i.image.trim() : "";
            const title = typeof i.title === "string" ? i.title.trim() : "";
            if (!image || !title) return null;
            return {
              number: typeof i.number === "string" ? i.number : "",
              title,
              description: typeof i.description === "string" ? i.description : "",
              image,
            } satisfies SeriesFeatureItem;
          })
          .filter(Boolean)
      : [];
    if (items.length === 0) return null;
    return {
      type,
      sectionEyebrow: typeof row.sectionEyebrow === "string" ? row.sectionEyebrow : "FEATURES",
      sectionTitle: typeof row.sectionTitle === "string" ? row.sectionTitle : "",
      sectionTitleBold: typeof row.sectionTitleBold === "string" ? row.sectionTitleBold : "",
      items: items as SeriesFeatureItem[],
    };
  }

  if (type === "product_showcase") {
    const items = Array.isArray(row.items)
      ? row.items
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const i = item as Record<string, unknown>;
            const mainUrl = typeof i.mainUrl === "string" ? i.mainUrl.trim() : "";
            const name = typeof i.name === "string" ? i.name.trim() : "";
            if (!mainUrl || !name) return null;
            const features = Array.isArray(i.features)
              ? i.features
                  .map((feature) => {
                    if (!feature || typeof feature !== "object") return null;
                    const f = feature as Record<string, unknown>;
                    const title = typeof f.title === "string" ? f.title : "";
                    const bullets = normalizeStringArray(f.bullets);
                    const boxPosition = f.boxPosition;
                    if (!title && bullets.length === 0) return null;
                    return {
                      title,
                      bullets,
                      boxPosition:
                        boxPosition === "bottom_left" ||
                        boxPosition === "bottom_right" ||
                        boxPosition === "top_right"
                          ? boxPosition
                          : "top_left",
                    } satisfies SeriesShowcaseFeature;
                  })
                  .filter(Boolean)
              : [];
            return {
              badge: typeof i.badge === "string" ? i.badge : "",
              name,
              tags: normalizeStringArray(i.tags),
              thumbUrl:
                typeof i.thumbUrl === "string" && i.thumbUrl.trim()
                  ? i.thumbUrl.trim()
                  : mainUrl,
              mainUrl,
              features: features as SeriesShowcaseFeature[],
            } satisfies SeriesShowcaseItem;
          })
          .filter(Boolean)
      : [];
    if (items.length === 0) return null;
    return { type, items: items as SeriesShowcaseItem[] };
  }

  if (type === "specs_panel") {
    const leftImage = typeof row.leftImage === "string" ? row.leftImage.trim() : "";
    const rightImage = typeof row.rightImage === "string" ? row.rightImage.trim() : "";
    if (!leftImage && !rightImage) return null;
    return {
      type,
      title: typeof row.title === "string" ? row.title : "產品規格",
      note: typeof row.note === "string" ? row.note : "",
      leftImage,
      rightImage,
    };
  }

  if (type === "parallax_hero") {
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const backgroundImage =
      typeof row.backgroundImage === "string" ? row.backgroundImage.trim() : "";
    if (!title || !backgroundImage) return null;
    return {
      type,
      title,
      subtitle: typeof row.subtitle === "string" ? row.subtitle : "",
      backgroundImage,
    };
  }

  if (type === "text_banner") {
    const body = typeof row.body === "string" ? row.body.trim() : "";
    if (!body) return null;
    return {
      type,
      backgroundColor:
        typeof row.backgroundColor === "string" ? row.backgroundColor : "#ea580c",
      heading: typeof row.heading === "string" ? row.heading : "",
      body,
    };
  }

  if (type === "product_video") {
    const productImage =
      typeof row.productImage === "string" ? row.productImage.trim() : "";
    const youtubeId = parseVideoId(row.youtubeId ?? row.videoUrl);
    if (!productImage || !youtubeId) return null;
    return {
      type,
      sectionTitle: typeof row.sectionTitle === "string" ? row.sectionTitle : "CALIBRE AMB+",
      sectionSubtitle: typeof row.sectionSubtitle === "string" ? row.sectionSubtitle : "",
      productImage,
      cableImage: typeof row.cableImage === "string" ? row.cableImage : "",
      markerLabel: typeof row.markerLabel === "string" ? row.markerLabel : "A",
      videoUrl: typeof row.videoUrl === "string" ? row.videoUrl : "",
      youtubeId,
      coverImage:
        typeof row.coverImage === "string" && row.coverImage.trim()
          ? row.coverImage.trim()
          : productImage,
    };
  }

  return null;
}

function normalizeSummary(raw: unknown): SeriesSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const slug = typeof row.slug === "string" ? row.slug.trim() : "";
  if (!title || !slug) return null;

  const summary: SeriesSummary = {
    id: typeof row.id === "number" ? row.id : 0,
    title,
    slug,
    order: typeof row.order === "number" ? row.order : 0,
    seoTitle:
      typeof row.seoTitle === "string" && row.seoTitle.trim()
        ? row.seoTitle.trim()
        : title,
    seoDescription:
      typeof row.seoDescription === "string" ? row.seoDescription : "",
  };

  if (typeof row.ogImage === "string" && row.ogImage.trim()) {
    summary.ogImage = row.ogImage.trim();
  }
  if (typeof row.featuredImage === "string" && row.featuredImage.trim()) {
    summary.featuredImage = row.featuredImage.trim();
  }
  if (Array.isArray(row.featuredImages)) {
    const images = row.featuredImages
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    if (images.length) {
      summary.featuredImages = images;
      if (!summary.featuredImage) {
        summary.featuredImage = images[0];
      }
    }
  }
  if (typeof row.wcProductId === "number" && row.wcProductId > 0) {
    summary.wcProductId = row.wcProductId;
  }
  if (typeof row.updatedAt === "string") {
    summary.updatedAt = row.updatedAt;
  }

  return summary;
}

function normalizePage(raw: unknown): SeriesPage | null {
  const summary = normalizeSummary(raw);
  if (!summary) return null;

  const row = raw as Record<string, unknown>;
  const blocks = Array.isArray(row.blocks)
    ? row.blocks
        .map(normalizeBlock)
        .filter((block): block is SeriesBlock => block !== null)
    : [];

  return { ...summary, blocks };
}

export async function fetchSeriesNavItems(): Promise<SeriesNavItem[]> {
  const base = getWpBase();
  if (!base) return [...SERIES_NAV_FALLBACK];

  try {
    const res = await fetch(`${base}/wp-json/smasmall/v1/series`, getSeriesFetchInit());
    if (!res.ok) return [...SERIES_NAV_FALLBACK];

    const data = await res.json();
    if (!Array.isArray(data?.items) || data.items.length === 0) {
      return [...SERIES_NAV_FALLBACK];
    }

    return data.items
      .map((item: unknown) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const label = typeof row.label === "string" ? row.label.trim() : "";
        const slug = typeof row.slug === "string" ? row.slug.trim() : "";
        if (!label || !slug) return null;
        const href =
          typeof row.href === "string" && row.href.startsWith("/")
            ? row.href
            : `/series/${encodeURIComponent(slug)}`;
        return { label, slug, href };
      })
      .filter((item: SeriesNavItem | null): item is SeriesNavItem => item !== null);
  } catch {
    return [...SERIES_NAV_FALLBACK];
  }
}

export async function fetchSeriesSlugs(): Promise<string[]> {
  const base = getWpBase();
  if (!base) return SERIES_NAV_FALLBACK.map((item) => item.slug);

  try {
    const res = await fetch(`${base}/wp-json/smasmall/v1/series`, getSeriesFetchInit());
    if (!res.ok) return SERIES_NAV_FALLBACK.map((item) => item.slug);

    const data = await res.json();
    if (!Array.isArray(data?.series)) {
      return SERIES_NAV_FALLBACK.map((item) => item.slug);
    }

    return data.series
      .map((item: unknown) => {
        if (!item || typeof item !== "object") return null;
        const slug = (item as Record<string, unknown>).slug;
        return typeof slug === "string" ? slug : null;
      })
      .filter((slug: string | null): slug is string => Boolean(slug));
  } catch {
    return SERIES_NAV_FALLBACK.map((item) => item.slug);
  }
}

export async function fetchSeriesPage(slug: string): Promise<SeriesPage | null> {
  const base = getWpBase();
  if (!base) return null;

  try {
    const res = await fetch(
      `${base}/wp-json/smasmall/v1/series/${encodeURIComponent(slug)}`,
      getSeriesFetchInit(slug),
    );
    if (!res.ok) return null;

    const data = await res.json();
    return normalizePage(data);
  } catch {
    return null;
  }
}
