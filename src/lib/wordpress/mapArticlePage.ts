import {
  ARTICLE_PAGE_FALLBACK,
  type ArticlePageData,
} from "@/data/articlePageFallback";
import {
  mediaUrlWithoutQuery,
  normalizeMediaUrl,
} from "@/lib/wordpress/normalizeMediaUrl";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&hellip;/gi, "…")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\[\s*(?:…|\.\.\.)\s*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** 清理文章主體 HTML：移除 &nbsp;、修正 img src 的 &#038; 實體 */
function cleanBodyHtml(html: string) {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(
      /(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])/gi,
      (_, pre, src, post) => `${pre}${normalizeMediaUrl(src) || src}${post}`,
    )
    .replace(
      /(<img\b[^>]*?\bsrcset=["'])([^"']+)(["'])/gi,
      (_, pre, srcset, post) => {
        const cleaned = srcset
          .split(",")
          .map((part: string) => {
            const trimmed = part.trim();
            if (!trimmed) return trimmed;
            const [u, ...rest] = trimmed.split(/\s+/);
            const fixed = normalizeMediaUrl(u) || u;
            return [fixed, ...rest].join(" ");
          })
          .join(", ");
        return `${pre}${cleaned}${post}`;
      },
    );
}

function getPostImage(post: {
  jetpack_featured_media_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      media_details?: { sizes?: Record<string, { source_url?: string }> };
      source_url?: string;
    }>;
  };
  content?: { rendered?: string };
}) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  let rawUrl =
    post.jetpack_featured_media_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url ||
    featuredMedia?.media_details?.sizes?.full?.source_url ||
    featuredMedia?.source_url;

  if (!rawUrl && post.content?.rendered) {
    const imgMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch?.[1]) rawUrl = imgMatch[1];
  }

  return mediaUrlWithoutQuery(rawUrl);
}

/** 從 WordPress post 合併區塊資料；ACF 尚未設定時以假資料補齊 */
export function mapWordPressPostToArticlePage(
  post: {
    title: { rendered: string };
    excerpt?: { rendered?: string };
    content?: { rendered?: string };
    slug: string;
    date: string;
    acf?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    jetpack_featured_media_url?: string;
    _embedded?: {
      "wp:featuredmedia"?: Array<{
        media_details?: { sizes?: Record<string, { source_url?: string }> };
        source_url?: string;
      }>;
    };
  } | null,
): ArticlePageData {
  const fallback = structuredClone(ARTICLE_PAGE_FALLBACK);
  const featuredImage = post ? getPostImage(post) : undefined;

  if (!post) {
    return {
      ...fallback,
      wpTitle: fallback.hero.title,
      wpExcerpt: fallback.hero.description,
    };
  }

  const wpTitle = stripHtml(post.title.rendered);
  const wpExcerpt = post.excerpt?.rendered
    ? stripHtml(post.excerpt.rendered)
    : "";
  const acf = (post.acf ?? post.meta ?? {}) as Record<string, unknown>;

  return {
    ...fallback,
    wpTitle,
    wpExcerpt,
    wpBodyHtml: post.content?.rendered
      ? cleanBodyHtml(post.content.rendered)
      : undefined,
    featuredImage,
    slug: post.slug,
    date: post.date,
    stickyBar: {
      ...fallback.stickyBar,
      productLine:
        (acf.sticky_product_line as string) || fallback.stickyBar.productLine,
      priceLabel:
        (acf.sticky_price as string) || fallback.stickyBar.priceLabel,
      ctaLabel: (acf.sticky_cta_label as string) || fallback.stickyBar.ctaLabel,
      ctaHref: (acf.sticky_cta_href as string) || fallback.stickyBar.ctaHref,
    },
    hero: {
      ...fallback.hero,
      title: (acf.hero_title as string) || wpTitle || fallback.hero.title,
      description:
        (acf.hero_description as string) ||
        wpExcerpt ||
        fallback.hero.description,
      footnote: (acf.hero_footnote as string) || fallback.hero.footnote,
      image:
        normalizeMediaUrl(acf.hero_image as string) ||
        featuredImage ||
        fallback.hero.image,
    },
    
  };
}
