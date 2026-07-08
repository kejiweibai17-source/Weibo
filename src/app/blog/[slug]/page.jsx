import { getAllPostSlugs, getAllPosts } from "@/lib/wordpress";
import { mapWordPressPostToArticlePage } from "@/lib/wordpress/mapArticlePage";
import { notFound } from "next/navigation";
import ArticleJsonLd from "./ArticleJsonLd";
import ArticlePageView from "@/components/blog/article/ArticlePageView";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";

const SITE_URL = getSiteUrl();

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

async function getPostBySlugWithDebug(slug) {
  const rawBase =
    process.env.WORDPRESS_API_URL ||
    "https://inf.fjg.mybluehost.me/website_b45d1e40";
  const cleanBase = rawBase.split("/wp-json")[0].replace(/\/$/, "");
  const fetchUrl = `${cleanBase}/wp-json/wp/v2/posts?slug=${slug}&_embed`;

  try {
    const res = await fetch(fetchUrl, {
      next: { revalidate: 3600 },
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
  const post = await getPostBySlugWithDebug(params.slug);
  if (!post) return {};

  const imageUrl = getPostImage(post);
  const cleanDescription =
    post.excerpt?.rendered.replace(/<[^>]+>/g, "").substring(0, 160) ||
    "SMASMALL 昔馬電動刮鬍刀理容知識與男士修容專欄";

  return {
    title: `${post.title.rendered}｜SMASMALL 昔馬理容知識`,
    description: cleanDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title.rendered,
      description: cleanDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.modified).toISOString(),
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: post.title.rendered },
      ],
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
  const post = await getPostBySlugWithDebug(params.slug);

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
