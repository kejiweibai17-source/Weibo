// app/layout.tsx
import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css"; // CSS 在這裡引入
import ClientLayout from "./ClientLayout"; // 引入剛剛拆分出去的組件
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const SITE_URL = getSiteUrl();

// ✨ 全域 SEO 預設（各頁面可覆寫）
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  formatDetection: { telephone: true, email: true },
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
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/smasmall-logo.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" }],
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
