/** 本次瀏覽工作階段是否已播放過首頁 Preloader（站內切回首頁時略過） */
export const PRELOADER_SESSION_KEY = "smasmall_preloader_seen";

/** SPA 存活期間的備援（無痕／sessionStorage 不可用時仍有效） */
let playedInMemory = false;

/**
 * 搜尋引擎／預覽爬蟲（不執行點擊、應直接看到完整首頁內容）
 * @see https://developers.google.com/search/docs/crawling-indexing/googlebot
 */
const SEO_CRAWLER_UA =
  /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|pinterest|redditbot|applebot|semrushbot|ahrefsbot|dotbot|petalbot|bytespider|gptbot|claudebot|perplexitybot|amazonbot|ia_archiver/i;

export function isSeoCrawlerUserAgent(
  ua = typeof navigator !== "undefined" ? navigator.userAgent : "",
): boolean {
  if (!ua) return false;
  return SEO_CRAWLER_UA.test(ua);
}

/** 使用者偏好減少動態 → 略過進場動畫 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function syncPlayedFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1") {
      playedInMemory = true;
    }
  } catch {
    /* 無痕或隱私模式可能拒絕 storage */
  }
}

function hasPlayedThisSession(): boolean {
  syncPlayedFromStorage();
  if (playedInMemory) return true;
  try {
    return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
  } catch {
    return playedInMemory;
  }
}

function isPageReload(): boolean {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload";
}

/**
 * 是否顯示首頁 Preloader：
 * - SEO 爬蟲／減少動態 → 永不顯示（避免點擊牆擋收錄）
 * - 重新整理（F5）→ 顯示
 * - 站內切回首頁且本次已播過 → 略過
 * - SSR 階段回傳 false（HTML 先輸出完整內容給爬蟲）
 */
export function shouldShowHomePreloader(): boolean {
  if (typeof window === "undefined") return false;
  if (isSeoCrawlerUserAgent()) return false;
  if (prefersReducedMotion()) return false;
  if (isPageReload()) return true;
  return !hasPlayedThisSession();
}

export function markPreloaderPlayedThisSession(): void {
  if (typeof window === "undefined") return;
  playedInMemory = true;
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
  } catch {
    /* 無痕模式：僅依賴 playedInMemory，站內導覽仍會略過 */
  }
}
