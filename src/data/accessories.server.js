import {
  ACCESSORY_CATALOG,
  toListItem,
  defaultAccessoryDetail,
} from "@/data/accessories";

export function buildAccessoryCatalog() {
  return ACCESSORY_CATALOG || [];
}
export function buildAccessoryProducts() {
  const catalog = buildAccessoryCatalog();
  return Array.isArray(catalog) ? catalog.map(toListItem).filter(Boolean) : [];
}
export function getAccessoryCatalogItem(id) {
  const catalog = buildAccessoryCatalog();
  return (catalog || []).find((item) => item?.id === id) || null;
}
export function getAccessoryDetailFromCatalog(id) {
  const item = getAccessoryCatalogItem(id);
  return item ? defaultAccessoryDetail(item) : null;
}
