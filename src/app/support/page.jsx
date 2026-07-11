import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SEO_CONFIG, ogImageUrl } from "@/lib/seo/config";
import {
  buildBreadcrumbList,
  buildCoreEntityGraph,
  buildSiteNavigationSchema,
  buildSupportCollectionSchema,
} from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const PATH = "/support";

const TITLE = "昔馬 SMASMALL 客戶支援中心｜FAQ・保養・保固・政策";
const DESCRIPTION =
  "昔馬 SMASMALL 客戶支援中心：常見問題、使用與保養指南、12 個月原廠保固申請，以及服務條款與隱私權政策一次找齊。";

const SUPPORT_LINKS = [
  {
    href: "/support/faq",
    title: "常見問題 FAQ",
    summary: "產品技術、購買配送、保固售後與使用保養問答",
  },
  {
    href: "/support/manuals",
    title: "使用與保養指南",
    summary: "日常清潔、刀頭保養、防水使用與收納充電步驟",
  },
  {
    href: "/support/warranty",
    title: "產品保固與註冊",
    summary: "12 個月原廠保固、申請流程與保固範圍說明",
  },
  {
    href: "/support/policies",
    title: "使用條款與政策",
    summary: "服務條款、隱私權、運送退換貨與防詐騙宣導",
  },
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "昔馬客服",
    "SMASMALL 支援",
    "電動刮鬍刀 FAQ",
    "保固",
    "保養指南",
    "威柏科技",
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
        url: ogImageUrl("/images/og-4.jpg"),
        width: 1200,
        height: 630,
        alt: "SMASMALL 昔馬客戶支援中心",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl("/images/og-4.jpg")],
  },
};

export default function SupportHubPage() {
  const schemas = [
    buildCoreEntityGraph(SITE_URL),
    buildSiteNavigationSchema(SITE_URL),
    buildSupportCollectionSchema(SITE_URL),
    buildBreadcrumbList(SITE_URL, [
      { name: "首頁", path: "/" },
      { name: "客戶支援", path: PATH },
    ]),
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
            <li className="text-gray-900">客戶支援</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-[960px] px-6 pt-6 pb-10 md:pb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00B4D8] mb-4">
            Customer Support
          </p>
          <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-tight mb-5">
            客戶支援中心
          </h1>
          <p className="text-[15px] md:text-base text-gray-600 leading-relaxed max-w-2xl">
            {DESCRIPTION}
          </p>
        </header>

        <section className="mx-auto max-w-[960px] px-6 pb-20 md:pb-28">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORT_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#00B4D8] transition-colors mb-2">
                      {item.title}
                    </h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-[#00B4D8]">
                    前往查看
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
