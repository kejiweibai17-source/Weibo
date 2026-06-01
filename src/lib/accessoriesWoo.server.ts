import "server-only";
import {
  fetchAllProducts,
  fetchProductBySlug,
  type WooProduct,
} from "@/lib/woo";

const DEFAULT_SHIPPING =
  "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。";

function stripHtml(input = "") {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMaybeJson(value: any) {
  if (!value) return null;
  if (Array.isArray(value) || typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function pickMetaValue(product: WooProduct | null, keys: string[]) {
  if (!product) return undefined;

  for (const key of keys) {
    if (product[key] !== undefined && product[key] !== null) {
      return product[key];
    }
  }

  const fromMeta =
    product.meta_data?.find((m) => keys.includes(m.key))?.value ?? undefined;
  return fromMeta;
}

function toSeriesKey(
  name = "",
  categories: Array<{ name?: string }> = [],
) {
  const hay = `${name} ${categories.map((c) => c.name).join(" ")}`;
  if (/青春版|月光銀|幻影黑|元素灰/.test(hay)) return "Youth";
  if (/黑夜騎士/.test(hay)) return "DarkKnight";
  if (/捍衛者/.test(hay)) return "Defender";
  if (/星座/.test(hay)) return "Constellation";
  if (/小金剛|S3/.test(hay)) return "LittleKingKong";
  if (/鼻毛/.test(hay)) return "NoseHair";
  if (/紳士|Gentleman/.test(hay)) return "Gentleman";
  return "Defender";
}

function toCategoryKey(
  name = "",
  categories: Array<{ name?: string }> = [],
) {
  const hay = `${name} ${categories.map((c) => c.name).join(" ")}`;
  if (/刀頭|blade/i.test(hay)) return "Blade";
  if (/收納|旅行盒|case|包/.test(hay)) return "Case";
  return "Misc";
}

function normalizeImageList(value: any): string[] {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.url) return item.url;
        if (item?.src) return item.src;
        return null;
      })
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSocialUrl(url: string) {
  return url
    .replace(/&amp;/g, "&")
    .replace(/^['"]|['"]$/g, "")
    .trim();
}

function normalizeFeatures(product: WooProduct) {
  const custom = pickMetaValue(product, [
    "smasmall_features",
    "scenario_features",
    "_smasmall_features",
  ]);
  const parsed = parseMaybeJson(custom);

  if (Array.isArray(parsed) && parsed.length) {
    return parsed
      .map((f, idx) => {
        if (typeof f === "string") {
          return { title: `特色 ${idx + 1}`, content: f };
        }
        return {
          title: f?.title || `特色 ${idx + 1}`,
          content: f?.content || "",
        };
      })
      .filter((f) => f.content);
  }

  const desc = stripHtml(product?.short_description || product?.description);
  if (!desc) return [{ title: "產品特色", content: "請參考商品說明。" }];

  const lines = desc
    .split(/[。；\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  return lines.length
    ? lines.map((line, idx) => ({ title: `特色 ${idx + 1}`, content: line }))
    : [{ title: "產品特色", content: desc }];
}

function normalizeSocialEmbeds(product: WooProduct) {
  const youtubeRaw = pickMetaValue(product, [
    "smasmall_youtube_urls",
    "_smasmall_youtube_urls",
    "youtube_urls",
  ]);
  const facebookRaw = pickMetaValue(product, [
    "smasmall_facebook_urls",
    "_smasmall_facebook_urls",
    "facebook_urls",
  ]);

  const youtubeUrls = normalizeImageList(youtubeRaw);
  const facebookUrls = normalizeImageList(facebookRaw);

  const socialEmbeds = [
    ...youtubeUrls.map((url, idx) => ({
      id: `yt-${idx + 1}`,
      platform: "youtube",
      label: `YouTube ${idx + 1}`,
      url: normalizeSocialUrl(url),
      height: 400,
    })),
    ...facebookUrls.map((url, idx) => ({
      id: `fb-${idx + 1}`,
      platform: "facebook",
      label: `Facebook ${idx + 1}`,
      url: normalizeSocialUrl(url),
      height: 720,
    })),
  ];

  return socialEmbeds.length > 0
    ? {
        socialSectionTitle: "影片與社群",
        youtubeSectionTitle: "YouTube",
        facebookSectionTitle: "Facebook",
        socialEmbeds,
      }
    : null;
}

export function mapWooToAccessoryListItem(product: WooProduct) {
  const series = toSeriesKey(product?.name, product?.categories || []);
  return {
    id: product.slug,
    title: product.name,
    price: Number(product.price || 0),
    compatibility: [series],
    category: toCategoryKey(product?.name, product?.categories || []),
    series,
    images:
      product.images?.map((im) => im.src).filter(Boolean) ?? [],
  };
}

export function mapWooToAccessoryDetail(product: WooProduct) {
  const features = normalizeFeatures(product);
  const scenarioImages = normalizeImageList(
    pickMetaValue(product, [
      "smasmall_scenario_images",
      "_smasmall_scenario_images",
      "scenario_images",
    ]),
  );

  const manualImageUrl = pickMetaValue(product, [
    "smasmall_manual_image_url",
    "_smasmall_manual_image_url",
    "manual_image_url",
  ]);
  const manualPdfUrl = pickMetaValue(product, [
    "smasmall_manual_pdf_url",
    "_smasmall_manual_pdf_url",
    "manual_pdf_url",
  ]);

  const specs =
    pickMetaValue(product, [
      "smasmall_specs",
      "_smasmall_specs",
      "product_specs",
    ]) || stripHtml(product?.description);

  const allImages = product.images?.map((im) => im.src).filter(Boolean) ?? [];
  const rightPanel = normalizeSocialEmbeds(product);

  return {
    id: product.slug,
    title: product.name,
    price: Number(product.price || 0),
    rating: Number(product.average_rating || 4.7),
    reviews: Number(product.rating_count || 0),
    shortDesc:
      stripHtml(product.short_description) ||
      stripHtml(product.description) ||
      product.name,
    features,
    details: typeof specs === "string" ? specs : JSON.stringify(specs),
    shipping:
      pickMetaValue(product, ["smasmall_shipping_note", "_smasmall_shipping_note"]) ||
      DEFAULT_SHIPPING,
    images: allImages,
    boxContentsImages: [],
    scenarioImages,
    manualGuide:
      manualImageUrl && manualPdfUrl
        ? {
            label: "下載產品說明書",
            imageUrl: manualImageUrl,
            pdfUrl: manualPdfUrl,
          }
        : null,
    carouselFromFolders: false,
    mediaFolder: null,
    rightPanel,
  };
}

export async function fetchAccessoriesFromWoo() {
  const products = await fetchAllProducts();
  return products.map(mapWooToAccessoryListItem).filter((p) => p.images.length > 0);
}

export async function fetchAccessoryDetailBySlug(slug: string) {
  const product = await fetchProductBySlug(slug);
  if (!product) return null;
  return mapWooToAccessoryDetail(product);
}
