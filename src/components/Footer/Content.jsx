"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "next-view-transitions";

// ============================================================================
// SVG Icons
// ============================================================================
const Icons = {
  X: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Facebook: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Line: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M20.2 11.5c0-4.6-4.6-8.5-10.2-8.5S0 6.9 0 11.5c0 4.2 3.7 7.7 8.5 8.3v4.1c0 .5.5.7.8.4l4.5-4c2.8-.5 6.4-3 6.4-8.8zM6.5 13.5h-2c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5s.5.2.5.5v2.5h1.5c.3 0 .5.2.5.5s-.2.5-.5.5v3c0 .3-.2.5-.5.5zm1.5-3.5c0-.3.2-.5.5-.5s.5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3zm5.5 1.5c0 .3-.2.5-.5.5h-1.5v1c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5h2c.3 0 .5.2.5.5s-.2.5-.5.5v1h1.5c.3 0 .5.2.5.5z" />
    </svg>
  ),
  Mail: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
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
      <ShareWidget />
    </div>
  );
}

// ============================================================================
// Footer 內容區塊 (完美參照 Vaonis 設計，置換為 SMASMALL / 威柏科技 內容)
// ============================================================================
const Section2 = () => {
  return (
    <footer className="w-full bg-white pt-24 pb-12 px-6 sm:px-10 lg:px-20 xl:px-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        {/* 頂部 Logo (置中) */}
        <div className="flex justify-center mb-20">
          <Link href="/" className="flex items-center gap-2">
            {/* 你可以將這裡替換成 SMASMALL 或 威柏科技 的 SVG Logo */}
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
                  href="/tech/alloy"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  全合金機身工藝
                </Link>
              </li>
              <li>
                <Link
                  href="/tech/magnetic"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  磁吸式刀頭技術
                </Link>
              </li>
              <li>
                <Link
                  href="/tech/blades"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  荷蘭進口精鋼刀片
                </Link>
              </li>
              <li>
                <Link
                  href="/tech/waterproof"
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
                  href="#"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  LINE 官方帳號
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  className="text-[14px] font-normal text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* 第五欄：電子報訂閱 */}
          <div className="lg:col-span-2 lg:pl-8">
            <h3 className="text-[22px] font-bold text-black mb-4 leading-tight">
              Explore the Craftsmanship <br />
              with SMASMALL
            </h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-8 pr-4">
              訂閱威柏科技電子報，搶先獲取昔馬 SMASMALL
              最新產品資訊、獨家專屬優惠，以及男士理容與品味生活的靈感。
            </p>
            <button className="bg-[#00B4D8] hover:bg-[#0096B4] transition-colors text-white text-[15px] font-medium px-6 py-3 rounded-full flex items-center gap-2">
              立即訂閱 <Icons.ArrowRight className="w-4 h-4" />
            </button>
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
              href="/shipping"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              運送與退換貨
            </Link>
            <Link
              href="/privacy"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              隱私權政策
            </Link>
            <Link
              href="/terms"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              服務條款
            </Link>
            <Link
              href="/credits"
              className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              防詐騙宣導
            </Link>
          </div>
          <div className="text-[11px] font-bold text-black tracking-widest uppercase">
            MADE BY WEIBO TECHNOLOGY
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// Share Widget
// ============================================================================
function ShareWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && !e.target.closest("#share-widget-container")) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  const handleShare = (platform) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      "來看看極致工藝的 昔馬 SMASMALL 電動刮鬍刀！",
    );

    if (platform === "facebook")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
        "_blank",
      );
    if (platform === "line")
      window.open(
        `https://line.me/R/msg/text/?${text}%0D%0A${currentUrl}`,
        "_blank",
      );
    if (platform === "x")
      window.open(
        `https://twitter.com/intent/tweet?url=${currentUrl}&text=${text}`,
        "_blank",
      );
    if (platform === "mail")
      window.location.href = `mailto:?subject=${text}&body=${currentUrl}`;

    setIsOpen(false);
  };

  return (
    <div
      id="share-widget-container"
      className="fixed bottom-0 left-0 w-full z-[9999999999999] flex flex-col items-center justify-end pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="share-button"
            className="pointer-events-auto pb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              // 初始的圓角按鈕也加上毛玻璃效果
              className="flex items-center gap-2 bg-black/60 border border-white/20 backdrop-blur-md px-6 py-2.5 rounded-full hover:bg-black/80 hover:scale-105 transition-all duration-300 group shadow-lg"
            >
              <span className="font-serif font-bold text-white tracking-wider text-sm">
                CONTACT
              </span>
              <div className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-white/40">
                <span className="text-white text-xs font-bold leading-none mt-[1px]">
                  +
                </span>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="share-bar"
            // 🌟 這裡修改：加入 bg-black/80, backdrop-blur-md, 以及細微邊框
            className="pointer-events-auto w-full h-[60px] md:h-[70px] grid grid-cols-3 bg-black/80 backdrop-blur-md border-t border-white/10"
            style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.3)" }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 將按鈕底色移除 (bg-transparent)，讓毛玻璃背景透出來 */}
            <ShareBlock
              bg="bg-transparent"
              icon={
                <Icons.Line width={28} height={28} className="text-white" />
              }
              ariaLabel="分享至 LINE"
              onClick={() => handleShare("line")}
              hoverColor="hover:bg-[#00B900]/80" /* Hover 時顯示品牌色 */
            />
            <ShareBlock
              bg="bg-transparent"
              icon={
                <Icons.Facebook width={28} height={28} className="text-white" />
              }
              ariaLabel="分享至 Facebook"
              onClick={() => handleShare("facebook")}
              hoverColor="hover:bg-[#3B5998]/80" /* Hover 時顯示品牌色 */
            />
            <ShareBlock
              bg="bg-transparent"
              icon={
                <Icons.Mail width={28} height={28} className="text-white" />
              }
              ariaLabel="透過 Email 分享"
              onClick={() => handleShare("mail")}
              hoverColor="hover:bg-[#E04F3F]/80" /* Hover 時顯示品牌色 */
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🌟 修改 ShareBlock 支援 hover 變色
function ShareBlock({ bg, icon, onClick, ariaLabel, hoverColor }) {
  return (
    <button
      aria-label={ariaLabel}
      className={`${bg} flex items-center justify-center cursor-pointer ${hoverColor} transition-all duration-300 active:brightness-95 w-full h-full border-none border-r border-white/10 last:border-r-0`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
