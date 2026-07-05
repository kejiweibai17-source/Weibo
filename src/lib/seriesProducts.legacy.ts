/** 舊版 /product01～07 路徑對應 WordPress 系列 slug */
export const LEGACY_PRODUCT_SLUGS = {
  product01: "defender-set",
  product02: "s1-dark-knight",
  product03: "youth-edition",
  product04: "constellation",
  product05: "tri-blade",
  product06: "nose-trimmer",
  product07: "matebox-3in1",
} as const;

export type LegacyProductPath = keyof typeof LEGACY_PRODUCT_SLUGS;
