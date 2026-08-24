import "server-only";
import {
  COMPATIBILITY_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/data/accessories";
import {
  buildAccessoryProducts,
  getAccessoryDetailFromCatalog,
} from "@/data/accessories.server";

export type AccessoryFilterOption = { label: string; value: string };
export const ACCESSORY_PAGE_REVALIDATE = 3600;

export type AccessoryListItem = {
  id: string;
  slug?: string;
  name?: string;
  title?: string;
  image?: string;
  price?: string;
  [k: string]: any;
};

/** 精簡版：回傳本地 catalog（進階 Woo 串接另議） */
export async function fetchAccessoriesPageData(): Promise<{
  products: AccessoryListItem[];
  productFilters: AccessoryFilterOption[];
  accessoryFilters: AccessoryFilterOption[];
}> {
  return {
    products: buildAccessoryProducts() as unknown as AccessoryListItem[],
    productFilters: COMPATIBILITY_OPTIONS as AccessoryFilterOption[],
    accessoryFilters: CATEGORY_OPTIONS as AccessoryFilterOption[],
  };
}

export async function mapWooToAccessoryDetail(_product: unknown) {
  return null;
}

export async function fetchAccessoriesFromWoo() {
  return [] as AccessoryListItem[];
}

export async function fetchAccessoryDetailBySlug(slug: string): Promise<any> {
  return getAccessoryDetailFromCatalog(slug) ?? null;
}
