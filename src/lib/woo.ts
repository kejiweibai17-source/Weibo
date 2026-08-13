import "server-only";
import { toPublicProductSlug } from "@/lib/productPublicSlug";
import { normalizeRouteSlug, productFetchCacheTag } from "@/lib/utils";

export type WooImage = { id: number; src: string; alt?: string };
export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count?: number;
};
export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  permalink: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  images: WooImage[];
  short_description?: string;
  description?: string;
  attributes?: Array<{ name: string; options: string[] }>;
  categories?: Array<{ id: number; name: string; slug: string }>;
  average_rating?: string;
  rating_count?: number;
  meta_data?: Array<{ id?: number; key: string; value: any }>;
  yoast_seo?: {
    title?: string;
    description?: string;
    focus_keyword?: string;
  };
  [key: string]: any;
};

const getEnv = () => {
  const base = process.env.WC_API_BASE || "";
  const key = process.env.WC_CONSUMER_KEY || "";
  const secret = process.env.WC_CONSUMER_SECRET || "";
  if (!base || !key || !secret) {
    throw new Error(
      "WooCommerce 環境變數缺失：請在 .env.local 設定 WC_API_BASE/KEY/SECRET"
    );
  }
  return { base, key, secret };
};

const withAuth = (url: string) => {
  const { key, secret } = getEnv();
  const u = new URL(url);
  u.searchParams.set("consumer_key", key);
  u.searchParams.set("consumer_secret", secret);
  return u.toString();
};

const mapWoo = (p: any): WooProduct => {
  const images: WooImage[] = Array.isArray(p?.images)
    ? p.images.map((im: any) => ({
        id: im.id,
        src: im.src,
        alt: im.alt || p?.name || "",
      }))
    : [];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: typeof p.sku === "string" ? p.sku : "",
    permalink: p.permalink,
    price: p.price || p.regular_price || "0",
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    images,
    short_description: p.short_description,
    description: p.description,
    attributes: p.attributes || [],
    categories: p.categories || [],
    average_rating: p.average_rating || "0",
    rating_count: Number(p.rating_count || 0),
    meta_data: p.meta_data || [],
    yoast_seo: p.yoast_seo || undefined,
  } as WooProduct;
};

// 1. 基礎列表抓取 (支援分頁)
export async function fetchProducts({
  page = 1,
  perPage = 24,
}: { page?: number; perPage?: number } = {}) {
  const { base } = getEnv();
  const url = withAuth(
    `${base}/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&status=publish`
  );

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: ["products-all", "sitemap"],
    },
  });

  if (!res.ok) throw new Error("取得商品列表失敗");
  const data = await res.json();
  return (data as any[]).map(mapWoo) as WooProduct[];
}

// 2. [新增] 抓取所有產品 (用於列表頁)
// 這裡預設抓取 100 筆，直接複用 fetchProducts 的邏輯
export async function fetchAllProducts() {
  return fetchProducts({ page: 1, perPage: 100 });
}

/** Sitemap 專用：slug + 最後修改時間（ISR / on-demand revalidate） */
export async function fetchProductsForSitemap(): Promise<
  Array<{ slug: string; dateModified?: string }>
> {
  const { base } = getEnv();
  const url = withAuth(
    `${base}/wp-json/wc/v3/products?per_page=100&status=publish&_fields=slug,date_modified`,
  );
  const res = await fetch(url, {
    next: {
      revalidate: 3600,
      tags: ["products-all", "sitemap"],
    },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as any[];
  return (data || [])
    .map((p) => ({
      slug: typeof p?.slug === "string" ? p.slug : "",
      dateModified:
        typeof p?.date_modified === "string" ? p.date_modified : undefined,
    }))
    .filter((p) => Boolean(p.slug));
}

export async function fetchAllProductCategories() {
  const { base } = getEnv();
  const url = withAuth(
    `${base}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=false`,
  );
  const res = await fetch(url, {
    next: { revalidate: 300, tags: ["products-all"] },
  });
  if (!res.ok) return [] as WooCategory[];
  const data = (await res.json()) as any[];
  return (data || []).map(
    (c) =>
      ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parent: Number(c.parent || 0),
        count: Number(c.count || 0),
      }) as WooCategory,
  );
}

// 3. 單一產品抓取 (透過 Slug)
export async function fetchProductBySlug(slug: string) {
  const normalizedSlug = normalizeRouteSlug(slug);
  const { base } = getEnv();
  const url = withAuth(
    `${base}/wp-json/wc/v3/products?slug=${encodeURIComponent(
      normalizedSlug
    )}&status=publish`
  );
  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [
        "products-all",
        productFetchCacheTag(toPublicProductSlug(normalizedSlug)),
        "sitemap",
      ],
    },
  });
  if (!res.ok) return null;
  const arr = (await res.json()) as any[];
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return mapWoo(arr[0]) as WooProduct;
}

// 4. 抓取所有 Slugs (用於 generateStaticParams)
export async function fetchAllProductSlugs({
  perPage = 100,
}: { perPage?: number } = {}) {
  const { base } = getEnv();
  const url = withAuth(
    `${base}/wp-json/wc/v3/products?per_page=${perPage}&status=publish`
  );
  const res = await fetch(url, {
    next: { revalidate: 300, tags: ["products-all", "sitemap"] },
  });
  if (!res.ok) return [] as string[];
  const data = (await res.json()) as any[];
  return (data || []).map((p: any) => p.slug as string).filter(Boolean);
}