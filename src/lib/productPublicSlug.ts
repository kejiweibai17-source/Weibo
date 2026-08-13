/**
 * 前台公開商品 slug：ASCII only（SSG / ISR / middleware 可用）
 * WooCommerce 後台可維持中文代稱，不必手動改。
 */

import { pinyin } from "pinyin-pro";

const PHRASE_MAP: Array<[string, string]> = [
  ["小金剛旗艦三刀頭電動刮鬍刀", "s3"],
  ["小金剛旗艦三刀頭", "s3"],
  ["小金剛", "s3"],
  ["冰鈦銀", "ice-titanium"],
  ["捍衛者全合金戰損刮鬍刀", "defender"],
  ["捍衛者", "defender"],
  ["黑夜騎士", "dark-knight"],
  ["青春版電動刮鬍刀禮盒", "youth"],
  ["青春版", "youth"],
  ["星座系列電動刮鬍刀禮盒", "constellation"],
  ["星座系列", "constellation"],
  ["電動鼻毛修剪器", "nose-trimmer"],
  ["鼻毛修剪器", "nose-trimmer"],
  ["完美紳士", "matebox"],
  ["玩美紳士", "matebox"],
  ["月光銀", "moonlight-silver"],
  ["幻影黑", "phantom-black"],
  ["元素灰", "element-gray"],
  ["專屬紙袋", "gift-bag"],
  ["紙袋", "gift-bag"],
  ["電動刮鬍刀", "shaver"],
  ["刮鬍刀", "shaver"],
  ["三刀頭", "triple-blade"],
  ["禮盒", "gift-set"],
  ["三色", "three-color"],
];
PHRASE_MAP.sort((a, b) => b[0].length - a[0].length);

const ASCII_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isAsciiSlug(value: string): boolean {
  return ASCII_SLUG_RE.test(String(value || "").trim().toLowerCase());
}

function hasCjk(value: string): boolean {
  return /[\u3400-\u9fff]/.test(value);
}

function fallbackHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return `p-${Math.abs(hash).toString(36)}`;
}

function applyPhraseMap(input: string): string {
  let text = input;
  for (const [phrase, english] of PHRASE_MAP) {
    if (!text.includes(phrase)) continue;
    text = text.split(phrase).join(english ? `-${english}-` : "-");
  }
  return text;
}

function cjkToPinyin(chunk: string): string {
  try {
    const parts = pinyin(chunk, { toneType: "none", type: "array" });
    const list = Array.isArray(parts) ? parts : [String(parts || "")];
    const words = list
      .map((part) => String(part || "").toLowerCase().replace(/[^a-z0-9]+/g, ""))
      .filter(Boolean);
    return words.length ? words.join("-") : fallbackHash(chunk);
  } catch {
    return fallbackHash(chunk);
  }
}

/**
 * 將 Woo / 舊中文 slug 轉成穩定的英文公開 slug。
 * 必須可從「同一個中文 slug 字串」單獨推導（middleware 301 用）。
 */
export function toPublicProductSlug(raw: string): string {
  const source = String(raw || "").trim();
  if (!source) return source;

  let decoded = source;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  const lowered = decoded.trim().toLowerCase().replace(/_/g, "-");
  if (isAsciiSlug(lowered)) return lowered;

  let text = applyPhraseMap(decoded);
  text = text.replace(/[\u3400-\u9fff]+/g, (chunk) => {
    const pinyin = cjkToPinyin(chunk);
    return pinyin ? `-${pinyin}-` : "-";
  });

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    unique.push(token);
  }

  if (unique.length) return unique.join("-");
  return isAsciiSlug(lowered) ? lowered : fallbackHash(decoded);
}

export function needsProductSlugRedirect(requestSlug: string, publicSlug: string): boolean {
  const from = String(requestSlug || "").trim().toLowerCase();
  const to = String(publicSlug || "").trim().toLowerCase();
  if (!from || !to) return false;
  return from !== to || hasCjk(requestSlug);
}
