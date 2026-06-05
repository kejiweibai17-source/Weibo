import "server-only";
import {
  fetchAllProductCategories,
  fetchAllProducts,
  fetchProductBySlug,
  type WooCategory,
  type WooProduct,
} from "@/lib/woo";

const DEFAULT_SHIPPING =
  "全館消費滿 NT$1,500 即享免運優惠。台灣本島地區約 1-3 個工作天送達。";

const PRODUCT_ROOT_NAMES = ["產品", "产品"];
const PRODUCT_ROOT_SLUGS = ["product"];
const ACCESSORY_ROOT_NAMES = ["配件"];
const ACCESSORY_ROOT_SLUGS = ["accessories"];

export type AccessoryFilterOption = { label: string; value: string };

export type AccessoryListItem = {
  id: string;
  title: string;
  price: number;
  compatibility: string[];
  category: string;
  series: string;
  images: string[];
  productGroup: string;
  accessoryGroup: string;
  wooCategorySlugs: string[];
};

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

/** 修復 u7522u54c1… 這類被 strip 反斜線的 Unicode 亂碼 */
function repairUnicodeText(input = "") {
  const text = String(input ?? "");
  if (!text || !/(?:\\u|u)[0-9a-fA-F]{4}/.test(text)) return text;
  return text.replace(/\\u([0-9a-fA-F]{4})|u([0-9a-fA-F]{4})/g, (_, hex1, hex2) => {
    const code = parseInt(hex1 || hex2, 16);
    return Number.isFinite(code) ? String.fromCharCode(code) : _;
  });
}

/** WooCommerce 常會同時存 smasmall_xxx 與 _smasmall_xxx（後者常為空 []） */
function isEmptyMetaValue(value: unknown): boolean {
  if (value === undefined || value === null || value === false || value === "") {
    return true;
  }
  if (value === "[]" || value === "{}") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function pickMetaValue(product: WooProduct | null, keys: string[]) {
  if (!product) return undefined;

  // 依 keys 優先順序查找，避免 meta_data.find 先命中空的 _smasmall_xxx
  for (const key of keys) {
    const topLevel = product[key];
    if (!isEmptyMetaValue(topLevel)) {
      return topLevel;
    }

    const fromMeta = product.meta_data?.find((m) => m.key === key)?.value;
    if (!isEmptyMetaValue(fromMeta)) {
      return fromMeta;
    }
  }

  return undefined;
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
    .trim()
    .replace(/^https:\/\/youtube\.com/i, "https://www.youtube.com");
}

function normalizeUrlList(value: any): string[] {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => {
        if (typeof item === "string") return normalizeSocialUrl(item);
        if (item?.url) return normalizeSocialUrl(String(item.url));
        return null;
      })
      .filter((url): url is string => {
        if (!url) return false;
        return !/^https:\/\/\[\]/.test(url);
      });
  }
  if (typeof value === "string" && value.trim()) {
    const asJson = parseMaybeJson(value.trim());
    if (Array.isArray(asJson)) {
      return normalizeUrlList(asJson);
    }
    const single = normalizeSocialUrl(value);
    return single && !/^https:\/\/\[\]/.test(single) ? [single] : [];
  }
  return [];
}

function isYoutubeShortsUrl(url: string) {
  return /youtube\.com\/shorts\//i.test(url);
}

function normalizeFeatures(product: WooProduct) {
  const accordionRaw = pickMetaValue(product, [
    "smasmall_accordion_items",
    "_smasmall_accordion_items",
  ]);
  const accordionParsed = parseMaybeJson(accordionRaw);

  if (Array.isArray(accordionParsed) && accordionParsed.length) {
    return accordionParsed
      .map((item, idx) => {
        if (typeof item === "string") {
          return {
            title: `項目 ${idx + 1}`,
            content: repairUnicodeText(item),
          };
        }
        return {
          title:
            repairUnicodeText(String(item?.title ?? "").trim()) ||
            `項目 ${idx + 1}`,
          content: repairUnicodeText(String(item?.content ?? "").trim()),
        };
      })
      .filter((item) => item.title && item.content);
  }

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

  const youtubeUrls = normalizeUrlList(youtubeRaw);
  const facebookUrls = normalizeUrlList(facebookRaw);

  const socialEmbeds = [
    ...youtubeUrls.map((url, idx) => ({
      id: `yt-${idx + 1}`,
      platform: "youtube",
      label: isYoutubeShortsUrl(url) ? `YouTube Shorts ${idx + 1}` : `YouTube ${idx + 1}`,
      url,
      height: isYoutubeShortsUrl(url) ? undefined : 400,
      isShorts: isYoutubeShortsUrl(url),
    })),
    ...facebookUrls.map((url, idx) => ({
      id: `fb-${idx + 1}`,
      platform: "facebook",
      label: `Facebook ${idx + 1}`,
      url,
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

function findRootCategory(
  categories: WooCategory[],
  names: string[],
  slugs: string[] = [],
): WooCategory | undefined {
  return categories.find(
    (cat) =>
      names.some(
        (name) =>
          cat.name === name ||
          cat.slug === name ||
          decodeURIComponent(cat.slug) === name,
      ) || slugs.includes(cat.slug),
  );
}

function isUnderRoot(
  categoryId: number,
  rootId: number | undefined,
  categories: WooCategory[],
): boolean {
  if (!rootId || !categoryId) return false;
  if (categoryId === rootId) return true;

  let current = categories.find((c) => c.id === categoryId);
  const seen = new Set<number>();

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    if (current.id === rootId) return true;
    if (!current.parent) break;
    current = categories.find((c) => c.id === current!.parent);
  }

  return false;
}

function resolveCategoryGroups(
  product: WooProduct,
  productRoot?: WooCategory,
  accessoryRoot?: WooCategory,
  categories: WooCategory[] = [],
) {
  const wooCategorySlugs = (product.categories || []).map((c) => c.slug);
  let productGroup = "";
  let accessoryGroup = "";

  for (const cat of product.categories || []) {
    if (productRoot && isUnderRoot(cat.id, productRoot.id, categories)) {
      productGroup =
        cat.id === productRoot.id ? product.slug : cat.slug;
    }
    if (accessoryRoot && isUnderRoot(cat.id, accessoryRoot.id, categories)) {
      accessoryGroup =
        cat.id === accessoryRoot.id ? product.slug : cat.slug;
    }
  }

  return { productGroup, accessoryGroup, wooCategorySlugs };
}

function buildCategoryFilterOptions(
  root: WooCategory | undefined,
  categories: WooCategory[],
  products: WooProduct[],
  type: "product" | "accessory",
): AccessoryFilterOption[] {
  const options: AccessoryFilterOption[] = [{ label: "All", value: "All" }];
  if (!root) return options;

  const children = categories
    .filter((cat) => cat.parent === root.id)
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));

  if (children.length > 0) {
    for (const child of children) {
      options.push({ label: child.name, value: child.slug });
    }
    return options;
  }

  const matchedProducts = products
    .filter((product) =>
      (product.categories || []).some((cat) =>
        isUnderRoot(cat.id, root.id, categories),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));

  for (const product of matchedProducts) {
    options.push({
      label: product.name,
      value: type === "product" ? product.slug : product.slug,
    });
  }

  return options;
}

export async function fetchAccessoriesPageData(): Promise<{
  products: AccessoryListItem[];
  productFilters: AccessoryFilterOption[];
  accessoryFilters: AccessoryFilterOption[];
}> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllProductCategories(),
  ]);

  const productRoot = findRootCategory(
    categories,
    PRODUCT_ROOT_NAMES,
    PRODUCT_ROOT_SLUGS,
  );
  const accessoryRoot = findRootCategory(
    categories,
    ACCESSORY_ROOT_NAMES,
    ACCESSORY_ROOT_SLUGS,
  );

  const productFilters = buildCategoryFilterOptions(
    productRoot,
    categories,
    products,
    "product",
  );
  const accessoryFilters = buildCategoryFilterOptions(
    accessoryRoot,
    categories,
    products,
    "accessory",
  );

  const items = products
    .map((product) =>
      mapWooToAccessoryListItem(product, categories, productRoot, accessoryRoot),
    )
    .filter((p) => p.images.length > 0);

  return { products: items, productFilters, accessoryFilters };
}

function mapWooToAccessoryListItem(
  product: WooProduct,
  categories: WooCategory[] = [],
  productRoot?: WooCategory,
  accessoryRoot?: WooCategory,
): AccessoryListItem {
  const series = toSeriesKey(product?.name, product?.categories || []);
  const { productGroup, accessoryGroup, wooCategorySlugs } =
    resolveCategoryGroups(product, productRoot, accessoryRoot, categories);

  return {
    id: product.slug,
    title: product.name,
    price: Number(product.price || 0),
    compatibility: productGroup ? [productGroup] : [series],
    category: accessoryGroup || toCategoryKey(product?.name, product?.categories || []),
    series,
    images: product.images?.map((im) => im.src).filter(Boolean) ?? [],
    productGroup,
    accessoryGroup,
    wooCategorySlugs,
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

  // 左側輪播：WooCommerce 商品圖片 + 商品圖庫（REST images 陣列）
  const galleryImages = product.images?.map((im) => im.src).filter(Boolean) ?? [];
  const rightPanel = normalizeSocialEmbeds(product);
  const purchaseUrlRaw = pickMetaValue(product, [
    "smasmall_purchase_url",
    "_smasmall_purchase_url",
    "purchase_url",
  ]);
  const purchaseUrl =
    typeof purchaseUrlRaw === "string" && purchaseUrlRaw.trim()
      ? purchaseUrlRaw.trim()
      : null;

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
    images: galleryImages,
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
    purchaseUrl,
  };
}

export async function fetchAccessoriesFromWoo() {
  const { products } = await fetchAccessoriesPageData();
  return products;
}

export async function fetchAccessoryDetailBySlug(slug: string) {
  const product = await fetchProductBySlug(slug);
  if (!product) return null;
  return mapWooToAccessoryDetail(product);
}
