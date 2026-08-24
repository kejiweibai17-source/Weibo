import "server-only";
import { RETAIL_STORES, type RetailStore } from "@/data/retailStores";
export async function getRetailStores(): Promise<RetailStore[]> {
  return [...RETAIL_STORES];
}
