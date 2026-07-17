import JsonLd from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  entityIds,
  SEO_CONFIG,
} from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
} from "@/lib/seo/schemas";
import { blogPostPath } from "@/lib/utils";

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostCategories(post) {
  const terms = post._embedded?.["wp:term"];
  if (!Array.isArray(terms)) return [];
  return terms
    .flat()
    .filter((term) => term?.taxonomy === "category" && term?.name)
    .map((term) => term.name);
}

function getPostTags(post) {
  const terms = post._embedded?.["wp:term"];
  if (!Array.isArray(terms)) return [];
  return terms
    .flat()
    .filter((term) => term?.taxonomy === "post_tag" && term?.name)
    .map((term) => term.name);
}

/**
 * 文章頁完整 GEO SEO：BlogPosting + WebPage + Breadcrumb + 核心實體
 */
export default function ArticleJsonLd({ post, siteUrl, imageUrl }) {
  const canonicalUrl = `${siteUrl}${blogPostPath(post.slug)}`;
  const ids = entityIds(siteUrl);
  const cleanTitle = stripHtml(post.title?.rendered);
  const cleanDescription =
    stripHtml(post.excerpt?.rendered).substring(0, 160) ||
    "SMASMALL 昔馬電動刮鬍刀理容知識與男士修容專欄。台灣總代理威柏科技。";
  const categories = getPostCategories(post);
  const tags = getPostTags(post);
  const keywords = [
    "昔馬",
    "SMASMALL",
    "電動刮鬍刀",
    "男士理容",
    "威柏科技",
    "嘉義",
    ...categories,
    ...tags,
  ]
    .filter(Boolean)
    .join(",");

  const core = buildCoreEntityGraph(siteUrl);
  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "理容知識", path: "/blog" },
    { name: cleanTitle, path: blogPostPath(post.slug) },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
    },
    url: canonicalUrl,
    headline: cleanTitle,
    description: cleanDescription,
    image: {
      "@type": "ImageObject",
      url: imageUrl?.startsWith("http")
        ? imageUrl
        : absoluteUrl(siteUrl, imageUrl || SEO_CONFIG.defaultOgImage),
      width: 1200,
      height: 630,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.modified).toISOString(),
    inLanguage: SEO_CONFIG.inLanguage,
    author: {
      "@type": "Organization",
      "@id": ids.organization,
      name: SEO_CONFIG.organization.name,
      url: SEO_CONFIG.organization.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": ids.organization,
      name: SEO_CONFIG.organization.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteUrl, SEO_CONFIG.organization.logoPath),
      },
    },
    about: [{ "@id": ids.brand }, { "@id": ids.localBusiness }],
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteUrl}/blog/#blog`,
      name: "SMASMALL 昔馬理容知識專欄",
      url: `${siteUrl}/blog`,
    },
    keywords,
    ...(categories[0] ? { articleSection: categories[0] } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "article p", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: `${cleanTitle}｜SMASMALL 昔馬理容知識`,
    description: cleanDescription,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: [{ "@id": ids.brand }, { "@id": `${canonicalUrl}#article` }],
    mainEntity: { "@id": `${canonicalUrl}#article` },
    publisher: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl?.startsWith("http")
        ? imageUrl
        : absoluteUrl(siteUrl, imageUrl || SEO_CONFIG.defaultOgImage),
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.modified).toISOString(),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "article p", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
    significantLink: [
      `${siteUrl}/series`,
      `${siteUrl}/accessories`,
      `${siteUrl}/support`,
    ],
  };

  return (
    <JsonLd data={[core, breadcrumb, articleSchema, webPageSchema]} />
  );
}
