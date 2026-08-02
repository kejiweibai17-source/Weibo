import {
  BLOG_PAGE_FALLBACK,
  type BlogListPageData,
  type BlogMomentItem,
  type BlogPostCard,
} from "@/data/blogPageFallback";
import { blogPostPath } from "@/lib/utils";
import { mediaUrlWithoutQuery } from "@/lib/wordpress/normalizeMediaUrl";

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&hellip;/gi, "…")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'");
}

function stripHtml(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ""))
    .replace(/\[\s*&hellip;\s*\]/gi, "…")
    .replace(/\[\.\.\.\]/g, "…")
    .trim();
}

export function getPostImage(post: {
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
  // 優先使用 full 原圖，避免 large 被 Next/Image 二次壓縮後模糊
  let rawUrl =
    post.jetpack_featured_media_url ||
    featuredMedia?.media_details?.sizes?.full?.source_url ||
    featuredMedia?.source_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url;

  if (!rawUrl && post.content?.rendered) {
    const imgMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch?.[1]) rawUrl = imgMatch[1];
  }

  return mediaUrlWithoutQuery(rawUrl) || "/images/003-01.png";
}

function truncateText(text: string, max: number) {
  const clean = stripHtml(text).replace(/…+$/, "").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

function getPostExcerpt(post: {
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
}) {
  if (post.excerpt?.rendered) {
    const excerpt = stripHtml(post.excerpt.rendered);
    if (excerpt) return excerpt;
  }
  if (post.content?.rendered) {
    return stripHtml(post.content.rendered);
  }
  return "";
}

function mapWpPost(post: {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered?: string };
  date: string;
  jetpack_featured_media_url?: string;
  _embedded?: Parameters<typeof getPostImage>[0]["_embedded"] & {
    "wp:term"?: Array<Array<{ name: string }>>;
  };
  content?: { rendered?: string };
}): BlogPostCard {
  const categories =
    post._embedded?.["wp:term"]?.[0]?.map((t) => t.name) ?? [];
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: truncateText(getPostExcerpt(post), 160),
    image: getPostImage(post),
    date: post.date,
    category: categories[0] || "理容知識",
  };
}

function mergePostsWithFallback(
  realPosts: BlogPostCard[],
  mockPosts: BlogPostCard[],
  max: number,
): BlogPostCard[] {
  const merged: BlogPostCard[] = realPosts
    .slice(0, max)
    .map((post) => ({ ...post, isMock: false }));
  const usedSlugs = new Set(merged.map((post) => post.slug));

  for (const mock of mockPosts) {
    if (merged.length >= max) break;
    if (usedSlugs.has(mock.slug)) continue;
    merged.push({ ...mock, isMock: true });
    usedSlugs.add(mock.slug);
  }

  return merged;
}

function postHref(post: BlogPostCard) {
  return post.isMock ? "/blog" : blogPostPath(post.slug);
}

export const BLOG_LIST_PAGE_SIZE = 9;

export function mapWordPressPostsToBlogPage(
  wpPosts: Array<Parameters<typeof mapWpPost>[0]> | null | undefined,
  options?: {
    /** 上方 Moments 用的文章來源（通常為最新一頁） */
    momentWpPosts?: Array<Parameters<typeof mapWpPost>[0]> | null;
    pageSize?: number;
  },
): BlogListPageData {
  const fallback = structuredClone(BLOG_PAGE_FALLBACK);
  const pageSize = options?.pageSize ?? BLOG_LIST_PAGE_SIZE;
  const realPosts = wpPosts?.length ? wpPosts.map(mapWpPost) : [];
  const momentSource = options?.momentWpPosts?.length
    ? options.momentWpPosts.map(mapWpPost)
    : realPosts;

  // 上方 Moments：最新 5 篇
  const momentPosts = mergePostsWithFallback(
    momentSource,
    fallback.mockPosts,
    5,
  );

  // 下方列表：有真實文章時不補假資料（讓分頁頁數正確）
  const posts = realPosts.length
    ? realPosts.slice(0, pageSize).map((post) => ({ ...post, isMock: false }))
    : mergePostsWithFallback([], fallback.mockPosts, pageSize);

  const featuredPost = momentSource[0] ?? posts[0];

  const momentsItems: BlogMomentItem[] = momentPosts.map((post, i) => ({
    image: post.image,
    href: postHref(post),
    title: post.title,
    subtitle: truncateText(post.excerpt || post.title, 80),
    featured: i === 0,
    isMock: post.isMock,
  }));

  return {
    moments: {
      ...fallback.moments,
      items: momentsItems,
    },
    selections: fallback.selections,
    confidence: fallback.confidence,
    posts,
    featuredPost,
  };
}
