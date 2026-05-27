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

export function resolveSocialEmbedSrc(platform, url, options = {}) {
  if (!url?.trim()) return null;

  let trimmed = extractIframeSrc(url.trim());
  const { embedWidth } = options;

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
      /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/,
    );
    if (match) {
      return `https://www.instagram.com/p/${match[1]}/embed`;
    }
    return null;
  }

  if (platform === "facebook") {
    const w = embedWidth ?? 500;
    if (trimmed.includes("facebook.com/plugins/")) {
      return applyFacebookWidth(trimmed, w);
    }
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(trimmed)}&show_text=true&width=${w}`;
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
