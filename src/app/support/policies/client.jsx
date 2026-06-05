"use client";

import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import PolicyAccordion from "@/components/support/PolicyAccordion";
import { POLICY_NAV_LINKS, POLICY_SECTIONS } from "@/data/policyContent";
import { SEO_CONFIG } from "@/lib/seo/config";

export default function PoliciesClient() {
  return (
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
          <li>
            <Link
              href="/support/faq"
              className="hover:text-gray-900 transition-colors"
            >
              客戶支援
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-gray-900">使用條款與政策</li>
        </ol>
      </nav>

      <header className="mx-auto max-w-[960px] px-6 pt-6 pb-10 md:pb-14">
        <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-tight mb-5">
          使用條款與政策
        </h1>
        <p className="text-[15px] md:text-base text-gray-600 leading-relaxed max-w-2xl">
          了解 SMASMALL
          昔馬官方網站之服務條款、隱私權保護、運送退換貨規範及消費安全宣導。最後更新：2026
          年 6 月。
        </p>
      </header>

      <section className="mx-auto max-w-[960px] px-6 pb-8">
        <div className="flex flex-wrap gap-2">
          {POLICY_NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 hover:border-[#00B4D8] hover:text-[#00B4D8] transition-colors"
            >
              {link.title}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[960px] px-6 pb-16 md:pb-24">
        <h2 className="sr-only">政策條款全文</h2>
        <PolicyAccordion sections={POLICY_SECTIONS} />
      </section>

      <section className="border-t border-gray-300 bg-white">
        <div className="mx-auto max-w-[960px] px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[14px] text-gray-500">
            如有疑問請聯繫{" "}
            <a
              href={`mailto:${SEO_CONFIG.organization.email}`}
              className="text-gray-900 hover:text-[#00B4D8] transition-colors"
            >
              {SEO_CONFIG.organization.email}
            </a>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/support/manuals"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              使用與保養指南
            </Link>
            <Link
              href="/support/warranty"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              產品保固與註冊
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[#00B4D8] hover:text-[#0096B4] transition-colors"
            >
              聯絡客服
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
