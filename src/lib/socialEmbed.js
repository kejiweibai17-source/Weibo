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

function toAbsoluteFacebookUrl(location, base = "https://www.facebook.com") {
  if (!location) return "";
  if (location.startsWith("http")) return location;
  if (location.startsWith("//")) return `https:${location}`;
  return `${base}${location.startsWith("/") ? "" : "/"}${location}`;
}

/** 從 plugins/post.php?href=... 取出原始貼文網址 */
export function extractFacebookPluginHref(url = "") {
  try {
    const u = new URL(String(url).trim());
    if (!u.pathname.includes("/plugins/")) return "";
    const href = u.searchParams.get("href");
    return href ? decodeURIComponent(href) : "";
  } catch {
    return "";
  }
}

/**
 * Facebook 分享短網址（/share/p|v|r|g/、fb.watch、m.facebook）無法直接 embed，
 * 需先展開成正式 permalink，否則會顯示「貼文已無法取得」。
 */
export function isFacebookShareUrl(url = "") {
  const u = String(url);
  return (
    /facebook\.com\/share\//i.test(u) ||
    /fb\.watch\//i.test(u) ||
    /m\.facebook\.com\//i.test(u) ||
    /fb\.me\//i.test(u)
  );
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
    let normalized = raw
      .replace(/^https?:\/\/m\.facebook\.com/i, "https://www.facebook.com")
      .replace(/^https?:\/\/facebook\.com/i, "https://www.facebook.com")
      .replace(/^https?:\/\/www\.facebook\.com\/+/i, "https://www.facebook.com/");

    const u = new URL(normalized);
    const path = u.pathname.replace(/\/+$/, "") || "/";

    // 故事／相簿等帶 query 的 permalink 需保留 search
    if (
      /permalink\.php$/i.test(path) ||
      /story\.php$/i.test(path) ||
      /photo\.php$/i.test(path) ||
      /watch\/?$/i.test(path)
    ) {
      const keep = new URLSearchParams();
      for (const key of ["story_fbid", "id", "fbid", "v", "multi_permalinks"]) {
        const val = u.searchParams.get(key);
        if (val) keep.set(key, val);
      }
      const qs = keep.toString();
      return qs
        ? `https://www.facebook.com${path}?${qs}`
        : `https://www.facebook.com${path}`;
    }

    if (
      /\/reel\/[^/]+/i.test(path) ||
      /\/videos\/\d+/i.test(path) ||
      /\/posts\//i.test(path) ||
      /\/share\/[pvrg]\//i.test(path) ||
      /\/photo\//i.test(path)
    ) {
      return `https://www.facebook.com${path}/`;
    }

    return `https://www.facebook.com${path}${u.search}`;
  } catch {
    return raw.split("#")[0];
  }
}

function pickCanonicalFromHtml(html = "") {
  const og =
    html.match(
      /property=["']og:url["'][^>]*content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /content=["']([^"']+)["'][^>]*property=["']og:url["']/i,
    );
  if (og?.[1]) return og[1];

  const canon =
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (canon?.[1]) return canon[1];

  // 頁面內常有 data-lynx-uri / 正式 posts 連結
  const post = html.match(
    /https:\/\/www\.facebook\.com\/[^"'<\s]+\/(?:posts|videos|reel)\/[^"'<\s]+/i,
  );
  if (post?.[0]) return post[0].replace(/&amp;/g, "&");

  return "";
}

/**
 * 將分享短連結／手機網址展開成正式 permalink（server-side）。
 * Facebook embed 不吃 share 短連結，會顯示「貼文已無法取得」。
 */
export async function resolveFacebookShareUrl(url = "") {
  let trimmed = String(url || "").trim();
  if (!trimmed) return trimmed;

  // 若後台貼的是 plugins iframe src，先抽出 href 再解析
  const pluginHref = extractFacebookPluginHref(trimmed);
  if (pluginHref) trimmed = pluginHref;

  trimmed = cleanFacebookPermalink(trimmed);

  // 已是正式 posts/videos/reel 網址就不需展開
  if (
    !isFacebookShareUrl(trimmed) &&
    (/\/posts\//i.test(trimmed) ||
      /\/videos\//i.test(trimmed) ||
      /\/reel\//i.test(trimmed) ||
      /permalink\.php/i.test(trimmed) ||
      /story\.php/i.test(trimmed))
  ) {
    return trimmed;
  }

  if (!isFacebookShareUrl(trimmed) && !/share\//i.test(trimmed)) {
    return trimmed;
  }

  const browserHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
  };

  let current = trimmed;

  // 最多跟隨 6 次 redirect（含中間 login / share 跳轉）
  for (let i = 0; i < 6; i += 1) {
    try {
      const res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: browserHeaders,
        next: { revalidate: 3600 },
      });

      const location = res.headers.get("location");
      if (location) {
        const nextUrl = cleanFacebookPermalink(
          toAbsoluteFacebookUrl(location, new URL(current).origin),
        );
        // 避開登入牆，改抓 HTML
        if (/\/login/i.test(nextUrl) || /checkpoint/i.test(nextUrl)) {
          break;
        }
        current = nextUrl;
        if (
          /\/posts\//i.test(current) ||
          /\/videos\//i.test(current) ||
          /\/reel\//i.test(current) ||
          /permalink\.php/i.test(current)
        ) {
          return cleanFacebookPermalink(current);
        }
        continue;
      }

      // 無 Location 時讀 HTML 找 og:url / canonical
      if (res.status >= 200 && res.status < 400) {
        const html = await res.text();
        const canonical = pickCanonicalFromHtml(html);
        if (canonical) {
          return cleanFacebookPermalink(canonical);
        }
      }
    } catch {
      break;
    }
    break;
  }

  // 最後再用 follow 模式試一次（部分環境 manual 拿不到 Location）
  try {
    const res = await fetch(trimmed, {
      method: "GET",
      redirect: "follow",
      headers: browserHeaders,
      next: { revalidate: 3600 },
    });
    if (res.url && res.url !== trimmed) {
      const followed = cleanFacebookPermalink(res.url);
      if (
        /\/posts\//i.test(followed) ||
        /\/videos\//i.test(followed) ||
        /\/reel\//i.test(followed) ||
        /permalink\.php/i.test(followed)
      ) {
        return followed;
      }
    }
    if (res.ok) {
      const html = await res.text();
      const canonical = pickCanonicalFromHtml(html);
      if (canonical) return cleanFacebookPermalink(canonical);
    }
  } catch {
    // fall through
  }

  return cleanFacebookPermalink(current || trimmed);
}

function buildFacebookPluginSrc(permalink, width) {
  const w = width ?? 500;
  const href = cleanFacebookPermalink(permalink);
  const isVideo = isFacebookVideoUrl(href);
  const plugin = isVideo ? "video.php" : "post.php";
  const showText = isVideo ? "false" : "true";
  // lazy=false 減少空白；允許瀏覽器顯示完整貼文
  return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(href)}&show_text=${showText}&width=${w}&lazy=false`;
}

export function resolveSocialEmbedSrc(platform, url, options = {}) {
  if (!url?.trim()) return null;

  let trimmed = extractIframeSrc(url.trim());
  const { embedWidth } = options;

  // youtube.com → www.youtube.com（與後台 sanitize 一致）
  trimmed = trimmed.replace(/^https:\/\/youtube\.com/i, "https://www.youtube.com");

  if (platform === "facebook") {
    const w = embedWidth ?? 500;
    // plugins src 若 href 仍是短連結，改用抽出後的正式網址重建
    const pluginHref = extractFacebookPluginHref(trimmed);
    if (pluginHref) {
      return buildFacebookPluginSrc(pluginHref, w);
    }
    if (trimmed.includes("facebook.com/plugins/")) {
      return applyFacebookWidth(trimmed, w);
    }
    return buildFacebookPluginSrc(trimmed, w);
  }

  if (
    trimmed.startsWith("https://") &&
    (trimmed.includes("/plugins/") || trimmed.includes("/embed"))
  ) {
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
