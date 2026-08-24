import "server-only";
export type AccessoryNavItem = { label: string; href: string; slug?: string };
export async function fetchAccessoriesNavItems(): Promise<AccessoryNavItem[]> {
  return [];
}
