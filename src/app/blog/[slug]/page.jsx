import { getAllPostSlugs, getAllPosts } from "@/lib/wordpress";
import { mapWordPressPostToArticlePage } from "@/lib/wordpress/mapArticlePage";
import { notFound } from "next/navigation";
import ArticleJsonLd from "./ArticleJsonLd";
import ArticlePageView from "@/components/blog/article/ArticlePageView";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import { BLOG_CACHE_TAG, SITEMAP_CACHE_TAG } from "@/lib/seo/revalidate.server";

const SITE_URL = getSiteUrl();

/** SSG + ISR：建置預產已知文章；每小時背景更新；後台 webhook 可立刻刷新 */
export const revalidate = 3600;
export const dynamicParams = true;

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostImage(post) {
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
  return rawUrl ? rawUrl.split("?")[0] : SEO_CONFIG.defaultOgImage;
}

function getPostTerms(post, taxonomy) {
  const terms = post._embedded?.["wp:term"];
  if (!Array.isArray(terms)) return [];
  return terms
    .flat()
    .filter((term) => term?.taxonomy === taxonomy && term?.name)
    .map((term) => term.name);
}

async function getPostBySlug(slug) {
  const rawBase =
    process.env.WORDPRESS_API_URL ||
    "https://inf.fjg.mybluehost.me/website_b45d1e40";
  const cleanBase = rawBase.split("/wp-json")[0].replace(/\/$/, "");
  const fetchUrl = `${cleanBase}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;

  try {
    const res = await fetch(fetchUrl, {
      next: {
        revalidate: 3600,
        tags: [BLOG_CACHE_TAG, `blog-${slug}`, SITEMAP_CACHE_TAG],
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "找不到文章" };

  const imageUrl = getPostImage(post);
  const cleanTitle = stripHtml(post.title?.rendered);
  const cleanDescription =
    stripHtml(post.excerpt?.rendered).substring(0, 160) ||
    "SMASMALL 昔馬電動刮鬍刀理容知識與男士修容專欄。台灣總代理威柏科技，嘉義縣太保市。";
  const categories = getPostTerms(post, "category");
  const tags = getPostTerms(post, "post_tag");
  const pageUrl = `/blog/${post.slug}`;
  const title = `${cleanTitle}｜SMASMALL 昔馬理容知識`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description: cleanDescription,
    keywords: [
      "昔馬",
      "SMASMALL",
      "電動刮鬍刀",
      "男士理容",
      "威柏科技",
      "嘉義",
      cleanTitle,
      ...categories,
      ...tags,
    ],
    alternates: { canonical: pageUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "article",
      locale: "zh_TW",
      url: pageUrl,
      siteName: SEO_CONFIG.siteName,
      title: cleanTitle,
      description: cleanDescription,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.modified).toISOString(),
      authors: [SEO_CONFIG.organization.name],
      section: categories[0] || "理容知識",
      tags: [...categories, ...tags],
      images: [
        {
          url: imageUrl.startsWith("http") ? imageUrl : ogImageUrl(imageUrl),
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: [imageUrl.startsWith("http") ? imageUrl : ogImageUrl(imageUrl)],
    },
  };
}

function getRelatedPostImage(post) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const rawUrl =
    post.jetpack_featured_media_url ||
    featuredMedia?.media_details?.sizes?.medium?.source_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url ||
    featuredMedia?.source_url ||
    "";
  return rawUrl ? rawUrl.split("?")[0] : "";
}

async function getRelatedPosts(currentSlug) {
  try {
    const posts = await getAllPosts();
    if (!Array.isArray(posts)) return [];
    return posts
      .filter((p) => p.slug !== currentSlug)
      .slice(0, 5)
      .map((p) => ({
        slug: p.slug,
        title: p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
        image: getRelatedPostImage(p),
        date: p.date,
      }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleData = mapWordPressPostToArticlePage(post);
  const mainImageUrl = getPostImage(post);
  const relatedPosts = await getRelatedPosts(params.slug);

  return (
    <>
      <ArticleJsonLd post={post} siteUrl={SITE_URL} imageUrl={mainImageUrl} />
      <div className="mt-[60px] min-h-screen bg-white">
        <ArticlePageView data={articleData} relatedPosts={relatedPosts} />
      </div>
    </>
  );
}
