// lib/wordpress.js

const WP_API_URL =
  process.env.WORDPRESS_API_URL ||
  "https://inf.fjg.mybluehost.me/website_b45d1e40/wp-json/wp/v2";

// 取得文章列表 (包含圖片與分類)
export async function getAllPosts() {
  const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=12`, {
    next: {
      revalidate: 3600,
      tags: ["blog-all", "sitemap"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

// 取得單篇文章 (透過 Slug)
export async function getPostBySlug(slug) {
  const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
    next: {
      revalidate: 3600,
      tags: ["blog-all", `blog-${slug}`, "sitemap"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const posts = await res.json();
  return posts.length > 0 ? posts[0] : null;
}

// 取得所有文章的 Slug (用於 generateStaticParams)
export async function getAllPostSlugs() {
  const res = await fetch(`${WP_API_URL}/posts?per_page=100&_fields=slug`, {
    next: {
      revalidate: 3600,
      tags: ["blog-all", "sitemap"],
    },
  });
  return res.json();
}