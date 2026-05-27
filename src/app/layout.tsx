// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // CSS 在這裡引入
import ClientLayout from "./ClientLayout"; // 引入剛剛拆分出去的組件
import { getSiteUrl, SEO_CONFIG } from "@/lib/seo/config";

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
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/images/logo-white.png",
    shortcut: "/images/logo-white.png",
    apple: "/images/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 直接回傳 ClientLayout，因為 ViewTransitions 需要包住 html 標籤
    <ClientLayout>{children}</ClientLayout>
  );
}
