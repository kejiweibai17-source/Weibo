// components/ArticleJsonLd.js
import React from "react";
import { SEO_CONFIG, entityIds } from "@/lib/seo/config";

export default function ArticleJsonLd({ post, siteUrl, imageUrl }) {
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ids = entityIds(siteUrl);

  const cleanTitle = post.title?.rendered?.replace(/<[^>]+>/g, "") ?? "";
  const cleanDescription =
    post.excerpt?.rendered?.replace(/<[^>]+>/g, "").substring(0, 160) ||
    "SMASMALL 昔馬電動刮鬍刀理容知識與男士修容專欄";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "理容知識", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: cleanTitle, item: canonicalUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    headline: cleanTitle,
    description: cleanDescription,
    image: [imageUrl],
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.modified).toISOString(),
    inLanguage: "zh-TW",
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
        url: `${siteUrl}${SEO_CONFIG.organization.logoPath}`,
      },
    },
    about: { "@id": ids.brand },
    keywords: "昔馬,SMASMALL,電動刮鬍刀,男士理容,威柏科技",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    url: canonicalUrl,
    name: cleanTitle,
    description: cleanDescription,
    inLanguage: "zh-TW",
    isPartOf: { "@id": ids.website },
    publisher: { "@id": ids.organization },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </>
  );
}
