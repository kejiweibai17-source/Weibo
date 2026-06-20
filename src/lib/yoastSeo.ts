import type { WooProduct } from "@/lib/woo";

export type YoastSeoFields = {
  title: string | null;
  description: string | null;
  focusKeyword: string | null;
};

const YOAST_TITLE_KEYS = ["_yoast_wpseo_title", "yoast_wpseo_title"];
const YOAST_DESC_KEYS = ["_yoast_wpseo_metadesc", "yoast_wpseo_metadesc"];
const YOAST_FOCUS_KEYS = ["_yoast_wpseo_focuskw", "yoast_wpseo_focuskw"];

function pickYoastMeta(
  product: WooProduct,
  keys: string[],
): string | undefined {
  const block = product.yoast_seo;
  if (block && typeof block === "object") {
    if (keys.some((k) => k.includes("title")) && block.title) {
      return String(block.title).trim();
    }
    if (keys.some((k) => k.includes("metadesc")) && block.description) {
      return String(block.description).trim();
    }
    if (keys.some((k) => k.includes("focuskw")) && block.focus_keyword) {
      return String(block.focus_keyword).trim();
    }
  }

  for (const key of keys) {
    const top = product[key];
    if (typeof top === "string" && top.trim()) return top.trim();

    const fromMeta = product.meta_data?.find((m) => m.key === key)?.value;
    if (typeof fromMeta === "string" && fromMeta.trim()) return fromMeta.trim();
  }

  return undefined;
}

/** 解析 Yoast 範本變數（%%title%%、%%sep%%、%%sitename%% 等） */
export function resolveYoastTemplate(
  template: string,
  context: { title: string; siteName?: string },
): string {
  return template
    .replace(/%%title%%/gi, context.title)
    .replace(/%%sep%%/gi, "-")
    .replace(/%%sitename%%/gi, context.siteName || "威柏科技")
    .replace(/%%page%%/gi, "")
    .replace(/%%primary_category%%/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .trim();
}

function stripHtml(input = "") {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 從 WooCommerce 商品讀取 Yoast SEO（REST yoast_seo 或 meta_data）
 */
export function extractYoastSeoFromProduct(
  product: WooProduct,
  options: { siteName?: string } = {},
): YoastSeoFields {
  const siteName = options.siteName || "威柏科技";
  const rawTitle = pickYoastMeta(product, YOAST_TITLE_KEYS);
  const rawDesc = pickYoastMeta(product, YOAST_DESC_KEYS);
  const rawFocus = pickYoastMeta(product, YOAST_FOCUS_KEYS);

  const title = rawTitle
    ? resolveYoastTemplate(rawTitle, { title: product.name, siteName })
    : null;
  const description = rawDesc ? stripHtml(rawDesc) : null;
  const focusKeyword = rawFocus ? stripHtml(rawFocus) : null;

  return {
    title: title || null,
    description: description || null,
    focusKeyword: focusKeyword || null,
  };
}
