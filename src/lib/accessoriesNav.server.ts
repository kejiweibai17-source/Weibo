import "server-only";

import { fetchAccessoriesFromWoo } from "@/lib/accessoriesWoo.server";
import { accessoryDetailPath } from "@/lib/utils";

export type AccessoryNavItem = {
  label: string;
  href: string;
};

/** Navbar「產品內容」下拉：WooCommerce 商品列表，失敗時 fallback 本地 catalog */
export async function fetchAccessoriesNavItems(): Promise<AccessoryNavItem[]> {
  try {
    const products = await fetchAccessoriesFromWoo();
    if (products.length > 0) {
      return products.map((product) => ({
        label: product.title,
        href: accessoryDetailPath(product.id),
      }));
    }
  } catch {
    /* fallback below */
  }

  try {
    const { buildAccessoryCatalog } = await import("@/data/accessories.server");
    return buildAccessoryCatalog().map((product) => ({
      label: product.title,
      href: accessoryDetailPath(product.id),
    }));
  } catch {
    return [];
  }
}
