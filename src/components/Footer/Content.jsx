"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

const LINE_OFFICIAL_URL =
  "https://page.line.me/157yqtwl?oat_content=url&openQrModal=true";
const Icons = {
  ArrowRight: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
};

export default function Content() {
  useEffect(() => {
    document.body.classList.remove("page-transition");
    sessionStorage.removeItem("transitioning");
  }, []);

  return (
    <div className="relative w-full bg-white text-slate-800">
      <Section2 />
    </div>
  );
}

// ============================================================================
// Footer 內容區塊
// ============================================================================
const Section2 = () => {
  return (
    <footer className="w-full bg-white pt-24 pb-12 px-6 sm:px-10 lg:px-20 xl:px-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        {/* 頂部 Logo (置中) */}
        <div className="flex justify-center mb-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-light tracking-[0.25em] text-black uppercase">
              SMASMALL
            </span>
          </Link>
        </div>

        {/* 主要欄位區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-16">
          {/* 第一欄：關於我們 */}
          <div className="lg:col-span-1">
            <h4 className="text-[13px] font-medium text-gray-400 mb-6 tracking-wide">
              About us
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  威柏科技介紹
                </Link>
              </li>
              <li>
                <Link
                  href="/brand"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  昔馬品牌故事
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  最新消息與專欄
                </Link>
              </li>
            </ul>
          </div>

          {/* 第二欄：創新與工藝 */}
          <div className="lg:col-span-1">
            <h4 className="text-[13px] font-medium text-gray-400 mb-6 tracking-wide">
              Innovation & Craft
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/accessories"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  全合金機身工藝
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  磁吸式刀頭技術
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  德國進口精鋼刀片
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  IPX7 級防水設計
                </Link>
              </li>
            </ul>
          </div>

          {/* 第三欄：支援服務 */}
          <div className="lg:col-span-1">
            <h4 className="text-[13px] font-medium text-gray-400 mb-6 tracking-wide">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/support/manuals"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  使用與保養指南
                </Link>
              </li>
              <li>
                <Link
                  href="/support/warranty"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  產品保固與註冊
                </Link>
              </li>
              <li>
                <Link
                  href="/support/faq"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  常見問題 FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support/policies"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  使用條款與政策
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  全台門市
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* 第四欄：社群平台 (照設計圖，純文字不帶 Icon) */}
          <div className="lg:col-span-1">
            <h4 className="text-[13px] font-medium text-gray-400 mb-6 tracking-wide">
              Social
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.facebook.com/249wzrtv/"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/weiz.3c/?hl=zh-tw"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={LINE_OFFICIAL_URL}
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  LINE 官方帳號
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@weiboltd"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* 第五欄：LINE 聯繫 */}
          <div className="lg:col-span-2 lg:pl-8">
            <h3 className="text-[22px] font-bold text-black mb-4 leading-tight">
              Explore the Craftsmanship <br />
              with SMASMALL
            </h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-8 pr-4">
              想進一步了解昔馬 SMASMALL 產品、保固或購買資訊？歡迎透過 LINE
              官方帳號與威柏科技聯繫，我們將為您提供專人服務與理容建議。
            </p>
            <a
              href={LINE_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#00B4D8] hover:bg-[#0096B4] transition-colors text-white text-[15px] font-medium px-6 py-3 rounded-full items-center gap-2"
            >
              立即聯繫 <Icons.ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 底部副加連結與版權宣告 */}
        <div className="mt-24 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            <Link
              href="/reviews"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              顧客評價
            </Link>
            <Link
              href="/support/policies#shipping"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              運送與退換貨
            </Link>
            <Link
              href="/support/policies#privacy"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              隱私權政策
            </Link>
            <Link
              href="/support/policies#terms"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              服務條款
            </Link>
            <Link
              href="/support/policies#fraud"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              防詐騙宣導
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
            <div className="text-[11px] font-bold text-black tracking-widest uppercase">
              WEIBO TECHNOLOGY
            </div>
            <a
              href="https://www.jeek-webdesign.com.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-400 hover:text-black transition-colors"
            >
              Design by 極客網頁設計
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
