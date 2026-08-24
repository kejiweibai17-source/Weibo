/**
 * 正規化 WordPress / Jetpack 媒體 URL。
 * WP content.rendered 常把 & 寫成 &#038;，若直接丟給 next/image 會變成死圖。
 */
export function normalizeMediaUrl(raw?: string | null): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;

  let url = raw.trim();
  if (!url) return undefined;

  url = url
    .replace(/&amp;/gi, "&")
    .replace(/&#0*38;/g, "&")
    .replace(/&#x0*26;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'");

  // 去掉因實體殘留造成的 fragment（例如 #038;ssl=1）
  const hashIdx = url.indexOf("#");
  if (hashIdx >= 0 && /#0*38;/i.test(url.slice(hashIdx))) {
    url = url.slice(0, hashIdx);
  }

  return url || undefined;
}

/** 取原圖路徑（去掉 resize 等 query），仍保留可解析的絕對 URL */
export function mediaUrlWithoutQuery(raw?: string | null): string | undefined {
  const url = normalizeMediaUrl(raw);
  if (!url) return undefined;
  return url.split("?")[0] || undefined;
}
