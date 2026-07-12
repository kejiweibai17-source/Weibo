"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import FaqAccordion from "@/components/support/FaqAccordion";
import { getAllSupportFaqs } from "@/data/supportContent";

const SUPPORT_HIGHLIGHTS = [
  "台灣總代理威柏科技提供 12 個月原廠保固",
  "完整使用與保養指南，延長產品最佳性能",
  "週一至週五 09:00–18:00 客服支援",
];

export default function FaqClient() {
  const faqs = getAllSupportFaqs();

  return (
    <div className="w-full min-h-screen bg-[#EDEEEF] font-sans antialiased pt-[60px] lg:pt-[72px]">
      {/* 麵包屑 */}
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
          <li className="text-gray-900">常見問題</li>
        </ol>
      </nav>

      {/* Anker 風格：上方支援卡片 */}
      <section className="mx-auto max-w-[960px] px-6 py-8 md:py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-[42%] min-h-[220px] md:min-h-[280px] bg-gray-100">
              <Image
                src="/images/a547d145-6bc1-4dd4-9653-81ee1945b2b8.png"
                alt="SMASMALL 昔馬電動刮鬍刀"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>

            <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-10 md:py-10">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-5">
                SMASMALL 客戶支援
              </h1>
              <ul className="space-y-3 mb-6">
                {SUPPORT_HIGHLIGHTS.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[14px] md:text-[15px] text-gray-700 leading-relaxed"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="text-[12px] text-gray-400 leading-relaxed mb-6">
                * 保固以購買憑證為準。刮鬍刀屬個人衛生用品，
                <span className="font-semibold ">
                  若無瑕疵商品一旦拆封，即無法做退換貨服務
                </span>
                。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B4D8] hover:bg-[#0096B4] text-white px-7 py-3 text-[14px] font-semibold transition-colors"
                >
                  聯絡客服
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/support/warranty"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-7 py-3 text-[14px] font-medium text-gray-800 hover:border-gray-400 transition-colors"
                >
                  保固說明
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anker 風格：置中標題 + 手風琴列表 */}
      <section className="mx-auto max-w-[960px] px-6 pb-20 md:pb-28">
        <FaqAccordion items={faqs} title="常見問題" />
      </section>

      {/* 底部快速連結 */}
      <section className="border-t border-gray-300 bg-white">
        <div className="mx-auto max-w-[960px] px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[14px] text-gray-500">
            找不到答案？我們隨時為您協助。
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
              href="/support/policies"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              使用條款與政策
            </Link>
            <Link
              href="/contact"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              聯絡我們
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
