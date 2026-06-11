import {
  ARTICLE_PAGE_FALLBACK,
  type ArticlePageData,
} from "@/data/articlePageFallback";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
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

  return rawUrl ? rawUrl.split("?")[0] : undefined;
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
    wpBodyHtml: post.content?.rendered,
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
      image: (acf.hero_image as string) || featuredImage || fallback.hero.image,
    },
    
  };
}
