/** 精簡版 WooCommerce 型別定義 */
export type WooImage = { id: number; src: string; alt?: string };
export type WooCategory = { id: number; name: string; slug: string; parent: number; count?: number };
export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  permalink: string;
  price: string;
  images: WooImage[];
  [key: string]: any;
};

export async function fetchWooProducts() { return [] as WooProduct[]; }
export async function fetchWooProductBySlug(_slug: string) { return null; }
