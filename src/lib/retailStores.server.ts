import "server-only";
import {
  RETAIL_STORES,
  type RetailStore,
} from "@/data/retailStores";

function getWpBase(): string | null {
  const base = process.env.WC_API_BASE?.replace(/\/$/, "");
  return base || null;
}

function normalizeStores(raw: unknown): RetailStore[] {
  if (!Array.isArray(raw)) return [];

  const stores: RetailStore[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;

    const row = item as Record<string, unknown>;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const brand = typeof row.brand === "string" ? row.brand.trim() : "";
    const city = typeof row.city === "string" ? row.city.trim() : "";
    const address = typeof row.address === "string" ? row.address.trim() : "";
    const phone = typeof row.phone === "string" ? row.phone.trim() : "";
    const hours = typeof row.hours === "string" ? row.hours.trim() : "";

    if (!name || !brand || !city || !address || !phone || !hours) continue;

    const region =
      row.region === "北部" ||
      row.region === "中部" ||
      row.region === "南部" ||
      row.region === "東部" ||
      row.region === "離島"
        ? row.region
        : "中部";

    const store: RetailStore = {
      id: typeof row.id === "string" && row.id.trim() ? row.id.trim() : name,
      name,
      brand,
      region,
      city,
      address,
      phone,
      hours,
    };

    if (typeof row.note === "string" && row.note.trim()) {
      store.note = row.note.trim();
    }
    if (typeof row.mapsUrl === "string" && row.mapsUrl.trim()) {
      store.mapsUrl = row.mapsUrl.trim();
    }

    stores.push(store);
  }

  return stores;
}

/** 從 WordPress REST 取得全台門市；失敗時回傳內建預設 */
export async function getRetailStores(): Promise<RetailStore[]> {
  const base = getWpBase();
  if (!base) return [...RETAIL_STORES];

  try {
    const res = await fetch(`${base}/wp-json/smasmall/v1/retail-stores`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [...RETAIL_STORES];

    const data = await res.json();
    const stores = normalizeStores(data?.stores);
    return stores.length > 0 ? stores : [...RETAIL_STORES];
  } catch {
    return [...RETAIL_STORES];
  }
}
