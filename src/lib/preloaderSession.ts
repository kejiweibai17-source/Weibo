/** 本次瀏覽工作階段是否已播放過首頁 Preloader（站內切回首頁時略過） */
export const PRELOADER_SESSION_KEY = "smasmall_preloader_seen";

/** SPA 存活期間的備援（無痕／sessionStorage 不可用時仍有效） */
let playedInMemory = false;

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
 * - 重新整理（F5）→ 一律顯示（含無痕視窗）
 * - 站內切回首頁且本次已播過 → 略過
 */
export function shouldShowHomePreloader(): boolean {
  if (typeof window === "undefined") return true;
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
