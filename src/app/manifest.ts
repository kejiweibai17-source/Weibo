import type { MetadataRoute } from "next";
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: SEO_CONFIG.siteName,
    short_name: "SMASMALL",
    description: SEO_CONFIG.brand.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0c",
    lang: "zh-Hant",
    dir: "ltr",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: absoluteIcon(siteUrl, "/icon-48.png"),
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: absoluteIcon(siteUrl, "/icon-96.png"),
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: absoluteIcon(siteUrl, "/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: absoluteIcon(siteUrl, "/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

function absoluteIcon(siteUrl: string, path: string) {
  // Manifest icons 可用相對路徑；絕對路徑較利於部分爬蟲
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}
