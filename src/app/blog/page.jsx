// app/blog/page.jsx
import BlogListPageView from "@/components/blog/list/BlogListPageView";
import { blogPostPath } from "@/lib/utils";
import {
  BLOG_LIST_PAGE_SIZE,
  mapWordPressPostsToBlogPage,
} from "@/lib/wordpress/mapBlogPosts";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";
import { buildBreadcrumbList, buildCoreEntityGraph } from "@/lib/seo/schemas";

const SITE_URL = getSiteUrl();

export const revalidate = 60;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "理容知識與男士修容指南｜SMASMALL 昔馬電動刮鬍刀",
  description:
    "昔馬 SMASMALL 電動刮鬍刀理容知識專欄，包含乾剃濕剃比較、刀頭清潔教學、送禮指南與男士修容技巧。由威柏科技台灣總代理提供。",
  keywords: [
    "電動刮鬍刀",
    "男士理容",
    "刮鬍刀推薦",
    "乾剃濕剃",
    "刀頭清潔",
    "昔馬",
    "SMASMALL",
    "威柏科技",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "理容知識與男士修容指南｜SMASMALL 昔馬",
    description:
      "昔馬 SMASMALL 電動刮鬍刀理容知識，乾剃濕剃比較、刀頭清潔教學與送禮指南。",
    url: `${SITE_URL}/blog`,
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: `${SITE_URL}${SEO_CONFIG.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬理容知識專欄",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "理容知識與男士修容指南｜SMASMALL 昔馬",
    description: "昔馬 SMASMALL 電動刮鬍刀理容知識與男士修容技巧。",
    images: [`${SITE_URL}${SEO_CONFIG.defaultOgImage}`],
  },
};

function getWpBase() {
  const rawBase =
    process.env.WORDPRESS_API_URL ||
    "https://inf.fjg.mybluehost.me/website_b45d1e40";
  return rawBase.split("/wp-json")[0].replace(/\/$/, "");
}

async function getPostsPage(page = 1) {
  const pageNum = Math.max(1, Number(page) || 1);
  const fetchUrl = `${getWpBase()}/wp-json/wp/v2/posts?_embed&per_page=${BLOG_LIST_PAGE_SIZE}&page=${pageNum}`;

  try {
    const res = await fetch(fetchUrl, {
      next: {
        revalidate: 60,
        tags: ["blog-all", "sitemap"],
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return { posts: [], total: 0, totalPages: 1, page: pageNum };
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { posts: [], total: 0, totalPages: 1, page: pageNum };
    }

    const posts = await res.json();
    const list = Array.isArray(posts) ? posts : [];

    // Next cache 有時拿不到自訂 header，大小寫也要相容
    let total = Number(
      res.headers.get("X-WP-Total") || res.headers.get("x-wp-total") || 0,
    );
    let totalPages = Number(
      res.headers.get("X-WP-TotalPages") ||
        res.headers.get("x-wp-totalpages") ||
        0,
    );

    if (!total) {
      const countRes = await fetch(
        `${getWpBase()}/wp-json/wp/v2/posts?per_page=1`,
        {
          next: { revalidate: 60, tags: ["blog-all", "sitemap"] },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json",
          },
        },
      );
      total = Number(
        countRes.headers.get("X-WP-Total") ||
          countRes.headers.get("x-wp-total") ||
          list.length,
      );
    }

    if (!totalPages && total > 0) {
      totalPages = Math.ceil(total / BLOG_LIST_PAGE_SIZE);
    }
    if (!totalPages) {
      totalPages = list.length ? 1 : 1;
    }

    return {
      posts: list,
      total,
      totalPages: Math.max(1, totalPages),
      page: pageNum,
    };
  } catch {
    return { posts: [], total: 0, totalPages: 1, page: pageNum };
  }
}

export default async function BlogPage({ searchParams }) {
  const requestedPage = Math.max(1, Number(searchParams?.page) || 1);
  const { posts, totalPages, page } = await getPostsPage(requestedPage);

  // Moments 一律用最新文章；分頁第 2 頁起另取第一頁
  const momentWpPosts =
    page === 1 ? posts : (await getPostsPage(1)).posts;

  const blogData = mapWordPressPostsToBlogPage(posts, {
    momentWpPosts,
    pageSize: BLOG_LIST_PAGE_SIZE,
  });

  const core = buildCoreEntityGraph(SITE_URL);
  const breadcrumb = buildBreadcrumbList(SITE_URL, [
    { name: "首頁", path: "/" },
    { name: "理容知識", path: "/blog" },
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#blog`,
    name: "SMASMALL 昔馬理容知識專欄",
    description:
      "昔馬 SMASMALL 電動刮鬍刀理容知識，乾剃濕剃比較、刀頭清潔教學與送禮指南。",
    url: `${SITE_URL}/blog`,
    inLanguage: "zh-TW",
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.organization.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${SEO_CONFIG.organization.logoPath}`,
      },
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/blog/#itemlist`,
    name: "昔馬 SMASMALL 理容知識文章列表",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: (page - 1) * BLOG_LIST_PAGE_SIZE + index + 1,
      url: `${SITE_URL}${blogPostPath(post.slug)}`,
      name: post.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(core) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BlogListPageView
        data={blogData}
        pagination={{ page, totalPages }}
      />
    </main>
  );
}
