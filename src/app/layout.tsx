// app/layout.tsx
import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css"; // CSS 在這裡引入
import ClientLayout from "./ClientLayout"; // 引入剛剛拆分出去的組件
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const SITE_URL = getSiteUrl();

const verification: Metadata["verification"] = {};
if (SEO_CONFIG.verification.google) {
  verification.google = SEO_CONFIG.verification.google;
}
if (SEO_CONFIG.verification.bing) {
  verification.other = {
    "msvalidate.01": SEO_CONFIG.verification.bing,
  };
}

// ✨ 全域 SEO 預設（各頁面可覆寫；勿改動各頁既有 title / description）
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SEO_CONFIG.siteName,
  title: {
    default: SEO_CONFIG.siteName,
    template: `%s｜${SEO_CONFIG.brand.name}`,
  },
  description: SEO_CONFIG.organization.description,
  keywords: [
    "昔馬",
    "SMASMALL",
    "電動刮鬍刀",
    "威柏科技",
    "全合金",
    "磁吸刀頭",
    "嘉義",
  ],
  authors: [{ name: SEO_CONFIG.organization.name, url: SEO_CONFIG.organization.url }],
  creator: SEO_CONFIG.organization.name,
  publisher: SEO_CONFIG.organization.name,
  formatDetection: { telephone: true, email: true, address: true },
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [SEO_CONFIG.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
  // Google favicon：需為正方形，且尺寸為 48 的倍數（48 / 96 / 192）
  icons: {
    icon: [
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: SEO_CONFIG.brand.name,
    statusBarStyle: "default",
  },
  other: {
    "geo.region": "TW-CYQ",
    "geo.placename": `${SEO_CONFIG.geo.addressLocality}, ${SEO_CONFIG.geo.addressRegion}`,
    "geo.position": `${SEO_CONFIG.geo.latitude};${SEO_CONFIG.geo.longitude}`,
    ICBM: `${SEO_CONFIG.geo.latitude}, ${SEO_CONFIG.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
