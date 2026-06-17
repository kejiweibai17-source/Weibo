/** 修復 Woo / WordPress 常見的換行遺失（\n 變成 n） */
export function normalizeAccordionContent(text = "") {
  return String(text ?? "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/([^\n])n(?=•)/g, "$1\n")
    .replace(/n(\s{2,})/g, "\n$1")
    .trim();
}

/** 將文字解析為條列項目（•、換行、HTML li） */
export function parseContentBullets(input = "") {
  const html = String(input ?? "").trim();
  if (!html) return [];

  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length > 0) {
    return liMatches
      .map((m) =>
        m[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/gi, " ")
          .trim(),
      )
      .filter(Boolean);
  }

  const normalized = normalizeAccordionContent(
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "),
  );

  if (normalized.includes("•")) {
    return normalized
      .split(/•+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const lines = normalized
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (lines.length > 1) return lines;

  return normalized ? [normalized] : [];
}

export function getContentBullets(content) {
  const bullets = parseContentBullets(content);
  if (bullets.length > 1) return bullets;
  const normalized = normalizeAccordionContent(content ?? "");
  if (normalized.includes("•") && bullets.length >= 1) return bullets;
  return null;
}
