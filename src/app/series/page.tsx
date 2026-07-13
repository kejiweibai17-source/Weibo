import { Link } from "next-view-transitions";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildSeriesHubSchemas,
  buildSiteNavigationSchema,
} from "@/lib/seo/schemas";
import {
  fetchSeriesNavItems,
  SERIES_PAGE_REVALIDATE,
} from "@/lib/seriesProducts.server";

export const revalidate = SERIES_PAGE_REVALIDATE;

const SITE_URL = getSiteUrl();
const PATH = "/series";

const TITLE = "昔馬 SMASMALL 系列商品｜鋅合金電動刮鬍刀系列總覽 - 威柏";
const DESCRIPTION =
  "瀏覽昔馬 SMASMALL 全系列商品：星座系列、捍衛者、黑夜騎士、青春版、小金剛與理容配件。台灣總代理威柏科技原廠授權，享 12 個月保固。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "昔馬系列",
    "SMASMALL 系列商品",
    "星座系列",
    "捍衛者",
    "黑夜騎士",
    "青春版",
    "小金剛",
    "電動刮鬍刀",
    "威柏科技",
    "嘉義",
  ],
  alternates: { canonical: PATH },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: PATH,
    siteName: SEO_CONFIG.siteName,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: ogImageUrl("/images/og-1.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬系列商品",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl("/images/og-1.jpg")],
  },
};

export default async function SeriesHubPage() {
  const seriesItems = await fetchSeriesNavItems();

  const schemas = [
    ...buildSeriesHubSchemas(seriesItems, SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="w-full min-h-screen bg-[#EDEEEF] font-sans antialiased pt-[60px] lg:pt-[72px]">
        <nav
          aria-label="breadcrumb"
          className="mx-auto max-w-[960px] px-6 pt-8 pb-2 text-[12px] text-gray-500"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                首頁
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-gray-900">系列商品</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-[960px] px-6 pt-6 pb-10 md:pb-14">
          <h1
            className="text-[2rem] md:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-tight mb-5"
            data-seo-speakable
          >
            系列商品
          </h1>
          <p
            className="text-[15px] md:text-base text-gray-600 leading-relaxed max-w-2xl"
            data-seo-speakable
          >
            {DESCRIPTION}
          </p>
        </header>

        <section className="mx-auto max-w-[960px] px-6 pb-20 md:pb-28">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {seriesItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden   bg-white shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f3f4f6]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        sizes="(max-width:768px) 100vw, 460px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[13px] text-gray-400">
                        尚未設定主圖
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#00B4D8]">
                        {item.label}
                      </h2>
                      <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-500">
                        {item.description?.trim() ||
                          `查看 ${item.label} 系列介紹、規格亮點與購買資訊`}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-[#00B4D8]">
                      前往系列頁
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-[14px] text-gray-500">
            想一次比較全部商品？
            <Link
              href="/accessories"
              className="ml-1 font-semibold text-[#00B4D8] hover:underline"
            >
              前往產品列表
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
