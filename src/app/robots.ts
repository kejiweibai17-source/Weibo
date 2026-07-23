import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/config";

/**
 * robots.txt
 * - 允許主流搜尋與 AI 爬蟲抓取公開頁（GEO / Generative 可見性）
 * - 封鎖後台與 API
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const disallow = ["/api/", "/_next/", "/admin/", "/cart", "/checkout"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      // Generative / AI 搜尋引擎（允許公開內容被引用）
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
