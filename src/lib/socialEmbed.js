/**
 * 將貼文／影片網址轉成 iframe src（也可直接貼官方 embed 的 src）
 * @param {"instagram"|"facebook"|"youtube"} platform
 * @param {string} url 貼文網址、影片網址或 iframe src
 */
function extractIframeSrc(input) {
  if (!input.includes("<iframe")) return input;
  const match = input.match(/\bsrc=["']([^"']+)["']/i);
  return match?.[1] ?? input;
}

function applyFacebookWidth(src, width) {
  if (!width || !src.includes("facebook.com/plugins/")) return src;
  if (/[?&]width=\d+/.test(src)) {
    return src.replace(/([?&])width=\d+/, `$1width=${width}`);
  }
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}width=${width}`;
}

/** Facebook 手機分享短網址（/share/v/、/share/r/）無法直接 embed，需先展開 */
export function isFacebookShareUrl(url = "") {
  return /facebook\.com\/share\/[vr]\//i.test(String(url));
}

/** Reel / 影片／watch／share/v — 應用 video.php，不是 post.php */
export function isFacebookVideoUrl(url = "") {
  const u = String(url);
  return (
    /facebook\.com\/share\/v\//i.test(u) ||
    /facebook\.com\/reel\//i.test(u) ||
    /facebook\.com\/watch\/?/i.test(u) ||
    /facebook\.com\/[^/]+\/videos\//i.test(u) ||
    /fb\.watch\//i.test(u) ||
    /facebook\.com\/plugins\/video\.php/i.test(u)
  );
}

/** 去掉追蹤參數，留下可給 embed 的 permalink */
export function cleanFacebookPermalink(url = "") {
  const raw = String(url || "").trim();
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/+$/, "") || "/";
    if (
      /\/reel\/\d+/i.test(path) ||
      /\/videos\/\d+/i.test(path) ||
      /\/posts\//i.test(path) ||
      /\/share\/[vr]\//i.test(path)
    ) {
      return `${u.origin}${path}/`;
    }
    return `${u.origin}${path}${u.search}`;
  } catch {
    return raw.split("?")[0];
  }
}

/**
 * 將 /share/v/xxx 展開成 /reel/ID 等正式網址（server-side）。
 * Facebook embed 不吃 share 短連結，會顯示「貼文已無法取得」。
 */
export async function resolveFacebookShareUrl(url = "") {
  const trimmed = String(url || "").trim();
  if (!trimmed) return trimmed;
  if (!isFacebookShareUrl(trimmed)) return cleanFacebookPermalink(trimmed);

  try {
    const res = await fetch(trimmed, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SMASMALLBot/1.0; +https://www.smasmall.com.tw)",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
    });

    const location = res.headers.get("location");
    if (location) {
      const absolute = location.startsWith("http")
        ? location
        : `https://www.facebook.com${location.startsWith("/") ? "" : "/"}${location}`;
      return cleanFacebookPermalink(absolute);
    }
  } catch {
    // fall through
  }

  return cleanFacebookPermalink(trimmed);
}

function buildFacebookPluginSrc(permalink, width) {
  const w = width ?? 500;
  const href = cleanFacebookPermalink(permalink);
  const isVideo = isFacebookVideoUrl(href);
  const plugin = isVideo ? "video.php" : "post.php";
  const showText = isVideo ? "false" : "true";
  return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(href)}&show_text=${showText}&width=${w}`;
}

export function resolveSocialEmbedSrc(platform, url, options = {}) {
  if (!url?.trim()) return null;

  let trimmed = extractIframeSrc(url.trim());
  const { embedWidth } = options;

  // youtube.com → www.youtube.com（與後台 sanitize 一致）
  trimmed = trimmed.replace(/^https:\/\/youtube\.com/i, "https://www.youtube.com");

  if (
    trimmed.startsWith("https://") &&
    (trimmed.includes("/plugins/") || trimmed.includes("/embed"))
  ) {
    if (platform === "facebook" && embedWidth) {
      return applyFacebookWidth(trimmed, embedWidth);
    }
    return trimmed;
  }

  if (platform === "instagram") {
    const match = trimmed.match(
      /instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/,
    );
    if (match) {
      return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
    }
    return null;
  }

  if (platform === "facebook") {
    const w = embedWidth ?? 500;
    if (trimmed.includes("facebook.com/plugins/")) {
      return applyFacebookWidth(trimmed, w);
    }
    return buildFacebookPluginSrc(trimmed, w);
  }

  if (platform === "youtube") {
    const idMatch = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    if (idMatch) {
      return `https://www.youtube.com/embed/${idMatch[1]}?rel=0`;
    }
    return null;
  }

  return trimmed;
}

/** 從 YouTube 網址取出 11 碼 video ID */
export function extractYoutubeVideoId(url = "") {
  const trimmed = String(url)
    .trim()
    .replace(/^https:\/\/youtube\.com/i, "https://www.youtube.com");
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

/** YouTube 縮圖（Shorts / 一般影片通用） */
export function youtubeThumbnailUrl(videoId, quality = "hqdefault") {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/** 從 Instagram 網址取出官方 embed 用的 permalink */
export function extractInstagramPermalink(url = "") {
  const match = String(url)
    .trim()
    .match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  if (!match) return null;
  return `https://www.instagram.com/${match[1]}/${match[2]}/`;
}

export function isInstagramReelUrl(url = "") {
  return /instagram\.com\/reel\//i.test(String(url));
}
