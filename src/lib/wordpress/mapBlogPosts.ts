import {
  BLOG_PAGE_FALLBACK,
  type BlogListPageData,
  type BlogMomentItem,
  type BlogPostCard,
} from "@/data/blogPageFallback";

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

  return rawUrl ? rawUrl.split("?")[0] : "/images/003-01.png";
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
  const merged: BlogPostCard[] = realPosts.map((post) => ({ ...post, isMock: false }));
  const usedSlugs = new Set(realPosts.map((post) => post.slug));

  for (const mock of mockPosts) {
    if (merged.length >= max) break;
    if (usedSlugs.has(mock.slug)) continue;
    merged.push({ ...mock, isMock: true });
    usedSlugs.add(mock.slug);
  }

  return merged;
}

function postHref(post: BlogPostCard) {
  return post.isMock ? "/blog" : `/blog/${post.slug}`;
}

export function mapWordPressPostsToBlogPage(
  wpPosts: Array<Parameters<typeof mapWpPost>[0]> | null | undefined,
): BlogListPageData {
  const fallback = structuredClone(BLOG_PAGE_FALLBACK);
  const realPosts = wpPosts?.length ? wpPosts.map(mapWpPost) : [];

  // 真實文章優先，不足時用假資料補滿（後台新增後會逐步替換）
  const momentPosts = mergePostsWithFallback(
    realPosts,
    fallback.mockPosts,
    5,
  );
  const posts = mergePostsWithFallback(realPosts, fallback.mockPosts, 12);

  const featuredPost = realPosts[0] ?? posts[0];

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
