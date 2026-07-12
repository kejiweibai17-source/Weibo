"use client";

import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import {
  WARRANTY_HIGHLIGHTS,
  WARRANTY_STEPS,
  WARRANTY_COVERAGE,
} from "@/data/supportContent";

/** 將 **強調** 轉成粗體紅字 */
function EmphasisText({ text, className = "" }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-[#c0392b]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function WarrantyClient() {
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
          <li className="text-gray-900">產品保固與註冊</li>
        </ol>
      </nav>

      <header className="mx-auto max-w-[960px] px-6 pt-6 pb-12 md:pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00B4D8] mb-4">
          Warranty &amp; Registration
        </p>
        <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-tight mb-5">
          產品保固與註冊
        </h1>
        <p className="text-[15px] md:text-base text-gray-600 leading-relaxed max-w-2xl">
          凡透過台灣授權通路購買的 SMASMALL 昔馬產品，享有 12
          個月原廠保固。威柏科技作為台灣總代理，提供完善的售後服務與保固申請協助。
        </p>
      </header>

      <section className="mx-auto max-w-[960px] px-6 pb-14 md:pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 border-t border-gray-300 pt-10">
          {WARRANTY_HIGHLIGHTS.map((item, idx) => (
            <div
              key={item.label}
              className={[
                "text-center md:text-left",
                idx > 0 ? "md:border-l md:border-gray-300 md:pl-6" : "",
              ].join(" ")}
            >
              <div className="flex items-baseline justify-center md:justify-start gap-1 mb-1">
                <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {item.value}
                </span>
                {item.unit && (
                  <span className="text-sm font-semibold text-[#00B4D8]">
                    {item.unit}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 保固申請流程 */}
      <section className="mx-auto max-w-[960px] px-6 pb-16 md:pb-24">
        <h2 className="text-center text-[1.15rem] md:text-[1.35rem] font-bold text-gray-900 tracking-tight mb-12 md:mb-14">
          {" "}
          保固申請流程{" "}
        </h2>
        <ol className="space-y-10 md:space-y-12">
          {WARRANTY_STEPS.map((step) => (
            <li key={step.step} className="max-w-2xl">
              <h3 className="text-[1.05rem] md:text-[1.2rem] font-bold text-gray-900 tracking-tight mb-3">
                {" "}
                <span className="font-mono tracking-[0.1em] text-[#00B4D8]">
                  STEP {step.step}
                </span>
                <span className="mx-1.5 text-gray-300">　</span>
                {step.title}{" "}
              </h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed">
                <EmphasisText text={step.description} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 保固範圍說明 */}
      <section className="mx-auto max-w-[960px] px-6 pb-16 md:pb-24">
        <h2 className="text-center text-[1.15rem] md:text-[1.35rem] font-bold text-gray-900 tracking-tight mb-10 md:mb-12">
          {" "}
          保固範圍說明{" "}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="text-[15px] font-bold text-[#00B4D8] mb-5 pb-3 border-b border-gray-300">
              【保固涵蓋】
            </h3>
            <ul className="space-y-3">
              {WARRANTY_COVERAGE.covered.map((item, i) => (
                <li
                  key={item}
                  className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed"
                >
                  <span className="font-bold text-gray-900">{i + 1}.</span>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#c0392b] mb-5 pb-3 border-b border-gray-300">
              【不在保固範圍】
            </h3>
            <ul className="space-y-3">
              {WARRANTY_COVERAGE.notCovered.map((item, i) => (
                <li
                  key={item}
                  className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed"
                >
                  <span className="font-bold text-gray-900">{i + 1}.</span>{" "}
                  <EmphasisText text={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 註冊說明 */}
      <section className="border-t border-gray-300 bg-white">
        <div className="mx-auto max-w-[960px] px-6 py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8] mb-3">
            Registration
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
            保固以購買憑證為準
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed max-w-2xl mb-8">
            請保留發票或訂單編號，並建議拍攝包裝上的雷雕序號。如需保固協助，請直接聯繫客服
            。
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#00B4D8] hover:bg-[#0096B4] text-white px-7 py-3 text-[14px] font-semibold transition-colors"
          >
            聯絡客服申請保固
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 底部聯絡 */}
      <section className="border-t border-gray-300">
        <div className="mx-auto max-w-[960px] px-6 py-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="text-[14px] text-gray-600 leading-relaxed space-y-1">
            <p>
              <span className="text-gray-500">客服專線</span>
              <span className="mx-2 text-gray-300">|</span>
              <a
                href="tel:+886-5-320-9919"
                className="font-semibold  hover:underline"
              >
                +886-5-320-9919
              </a>
            </p>
            <p>
              <span className="text-gray-500">服務時間</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold ">週一至週五 09:00–18:00</span>
            </p>
            <p className="text-[13px] ">（例假日及國定假日暫停服務）</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/support/manuals"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              使用與保養指南
            </Link>
            <Link
              href="/support/faq"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              常見問題 FAQ
            </Link>
            <Link
              href="/support/policies"
              className="text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              使用條款與政策
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
