/** 本次瀏覽工作階段是否已播放過首頁 Preloader（關閉分頁／無痕新開會清除） */
export const PRELOADER_SESSION_KEY = "smasmall_preloader_seen";

export function hasPreloaderPlayedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPreloaderPlayedThisSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
  } catch {
    /* private mode quota 等情況略過 */
  }
}
