"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { SUPPORT_NAV } from "@/data/supportContent";
import { SERIES_NAV_FALLBACK } from "@/lib/seriesProducts.constants";
// 🌟 引入 GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// ============================================================================
// 子組件區塊 (漢堡選單、購物車、會員)
// ============================================================================
function MenuToggleButton({ open, onClick, className = "", buttonRef }) {
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={open ? "關閉選單" : "開啟選單"}
      aria-expanded={open}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center focus:outline-none transition-colors z-[2100] relative w-10 h-10 text-white hover:text-gray-300 ${className}`}
    >
      {open ? (
        <X size={22} strokeWidth={1.5} aria-hidden />
      ) : (
        <Menu size={22} strokeWidth={1.5} aria-hidden />
      )}
    </motion.button>
  );
}

function CartButton({ count = 0, onClick }) {
  return (
    <Link
      href="https://www.weiz.com.tw/"
      target="_blank"
      onClick={onClick}
      className="relative flex items-center justify-center text-white hover:text-gray-300 transition-colors"
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -right-2 -top-1.5 min-w-[16px] rounded-full bg-[#00B4D8] px-1 text-center text-[10px] font-bold leading-4 text-white"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

const WEIBO_MEMBER_URL = "https://www.weiboltd.com/landing";

function UserMenu() {
  return (
    <div className="relative flex items-center h-full group cursor-pointer">
      <button
        type="button"
        className="flex items-center text-white group-hover:text-gray-300 transition-colors py-6"
        aria-label="會員專區"
      >
        <User size={20} strokeWidth={1.5} />
      </button>
      <div className="absolute top-[80%] left-0 w-full h-8 bg-transparent z-[1499]"></div>
      <div className="absolute right-0 top-[100%] pt-0 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[1500]">
        <div className="w-40 rounded-b-xl bg-white shadow-2xl py-3 relative text-black border border-gray-100 flex flex-col">
          <a
            href={WEIBO_MEMBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-5 py-2.5 text-[13px] text-gray-500 hover:text-black hover:bg-slate-50 font-medium transition-all duration-300"
          >
            登入 / 註冊
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 主組件：雙層獨立 Header
// ============================================================================

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openerRef = useRef(null);
  const overlayRef = useRef(null);
  const tl = useRef(null);

  const cartItems = useCartStore((state) => state.items) || [];
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.qty || 0),
    0,
  );

  const [accessoryNavItems, setAccessoryNavItems] = useState([]);
  const [seriesNavItems, setSeriesNavItems] = useState([]);

  const { scrollYProgress } = useScroll();

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useGSAP(
    () => {
      gsap.set(".nav-line", { y: "100%" });

      tl.current = gsap
        .timeline({ paused: true })
        .to(".nav-bg", {
          scaleY: 1,
          duration: 0.42,
          stagger: 0.05,
          ease: "power3.inOut",
        })
        .to(
          ".nav-items",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.38,
            ease: "power3.inOut",
          },
          "-=0.3",
        )
        .to(
          ".nav-line",
          {
            y: "0%",
            duration: 0.42,
            stagger: 0.028,
            ease: "power3.out",
          },
          "-=0.12",
        );
    },
    { scope: overlayRef },
  );

  useEffect(() => {
    if (tl.current) {
      if (menuOpen) {
        tl.current.play();
        // 🌟 打開選單時鎖定背景滾動
        document.body.style.overflow = "hidden";
      } else {
        tl.current.reverse();
        document.body.style.overflow = "unset";
      }
    }
    // 元件卸載時恢復滾動
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/accessories/nav")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) {
          setAccessoryNavItems(data.items);
        }
      })
      .catch(() => {
        if (!cancelled) setAccessoryNavItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/series/nav")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) {
          setSeriesNavItems(data.items);
        }
      })
      .catch(() => {
        if (!cancelled) setSeriesNavItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const globalLinks = useMemo(
    () => [
      { label: "品牌介紹", href: "/brand" },
      {
        label: "系列商品",
        href: "/series",
        dropdown:
          seriesNavItems.length > 0 ? seriesNavItems : SERIES_NAV_FALLBACK,
      },
      {
        label: "產品列表",
        href: "/accessories",
        dropdown:
          accessoryNavItems.length > 0
            ? accessoryNavItems
            : [{ label: "查看全部產品", href: "/accessories" }],
      },
      { label: "精選文章", href: "/blog" },
      SUPPORT_NAV,
      { label: "全台門市", href: "/stores" },
      { label: "聯絡我們", href: "/contact" },
    ],
    [accessoryNavItems, seriesNavItems],
  );

  const headerVariants = {
    visible: {
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <>
      {/* 1. 全域導覽列 (Global Navbar) */}
      <motion.header
        variants={headerVariants}
        initial="visible"
        animate="visible"
        className="fixed top-0 left-0 w-full h-[72px] z-[1000] bg-black/50 backdrop-blur-md transition-colors duration-300"
      >
        <div className="mx-auto flex w-full h-full max-w-[1600px] items-center justify-between px-4 md:px-6 lg:px-10">
          <div className="w-[30%] md:w-[20%]">
            <div className="flex items-center">
              <Link
                href="/"
                // 🌟 縮小手機版 Logo 字體
                className="text-[18px] md:text-[22px] font-light tracking-[0.2em] text-white uppercase relative z-[2100]"
              >
                <img
                  src="/images/SMASMALL-logo-white.png"
                  className=" max-w-[130px] md:max-w-[200px]"
                  alt=""
                />
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex w-[60%] justify-center">
            <nav className="mx-auto items-center gap-4 max-w-[780px] flex">
              {globalLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative h-full flex items-center group cursor-pointer"
                >
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-white group-hover:text-gray-300 transition-colors tracking-wide h-full flex items-center px-2 gap-1"
                  >
                    {link.label}
                    {link.dropdown && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                        aria-hidden
                      >
                        <path
                          d="M2 3.5L5 6.5L8 3.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Link>

                  {link.dropdown && (
                    <>
                      <div className="absolute top-[80%] left-0 w-full h-8 bg-transparent z-[1999]"></div>
                      <div className="absolute top-[100%] left-0 pt-2 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[2000]">
                        <div className="bg-white shadow-2xl py-3 min-w-[260px] border border-gray-100 flex flex-col">
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="group/item flex items-center px-6 py-3.5 text-[13px] font-medium text-gray-500 hover:bg-slate-50 transition-colors duration-300 overflow-hidden"
                            >
                              <span className="transform transition-all duration-300 group-hover/item:translate-x-1.5 group-hover/item:text-black">
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6 w-[70%] md:w-[20%] justify-end h-full">
            <div className="hidden md:block h-full">
              <UserMenu />
            </div>
            <a
              href={WEIBO_MEMBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex md:hidden items-center text-white hover:text-gray-300 transition-colors"
              aria-label="登入 / 註冊"
            >
              <User size={20} strokeWidth={1.5} />
            </a>
            <CartButton count={cartCount} />
            <div className="lg:hidden">
              <MenuToggleButton
                open={menuOpen}
                onClick={toggleMenu}
                buttonRef={openerRef}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gray-300 origin-left z-[2100] w-full"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.header>

      {/* =======================================================
          3. 🌟 新版：手機版全螢幕選單 (3C Tech 科技感)
          ======================================================= */}
      {/* 🌟 修正：確保 z-[3000] 高於 Navbar，且 h-[100dvh] 解決 iOS 底部列問題 */}
      <div
        ref={overlayRef}
        className={`fixed top-0 left-0 w-full h-[100dvh] z-[3000] lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* 多層次科技感背景動畫區塊 */}
        <div className="nav-bg absolute inset-0 w-full h-full bg-[#1A1A2E] origin-top scale-y-0" />
        <div className="nav-bg absolute inset-0 w-full h-full bg-[#16213E] origin-top scale-y-0" />
        <div className="nav-bg absolute inset-0 w-full h-full bg-[#0F3460] origin-top scale-y-0" />
        <div className="nav-bg absolute inset-0 w-full h-full bg-[#00B4D8] origin-top scale-y-0" />

        {/* 內容區塊 */}
        <div
          className="nav-items relative z-10 flex flex-col justify-between h-full px-6 md:px-8 bg-[#050505] overflow-hidden"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
        >
          {/* HUD 風格背景裝飾線 */}
          <div className="absolute left-6 top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-[#00B4D8]/30 to-transparent pointer-events-none hidden sm:block" />

          {/* 頂部 Header：Logo 與關閉按鈕 */}
          <div className="relative z-20 w-full h-[72px] flex justify-between items-center mt-2 shrink-0">
            <span className="text-[18px] md:text-[20px] font-light tracking-[0.2em] text-white uppercase">
              SMASMALL
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="關閉選單"
              className="inline-flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-colors"
            >
              <X size={22} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          {/* 主要內容區，使用 flex-1 自動推擠，並確保在小螢幕不被截斷 */}
          <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 pl-0 sm:pl-4 mt-8 pb-8">
            {/* 主要導覽連結 */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {globalLinks.map((link) => (
                <div key={link.label} className="block">
                  <div className="overflow-hidden">
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block group"
                    >
                      <span className="nav-line block text-[0.85rem] sm:text-[0.9rem] text-gray-400 font-light tracking-wide group-hover:text-[#00B4D8] transition-colors py-0.5 will-change-transform">
                        {link.label}
                      </span>
                    </Link>
                  </div>
                  {link.dropdown && (
                    <div className="mt-2 ml-8 sm:ml-10 flex flex-col gap-1.5 border-l border-[#00B4D8]/20 pl-4">
                      {link.dropdown.map((sub) => (
                        <div key={sub.href} className="overflow-hidden">
                          <Link
                            href={sub.href}
                            onClick={closeMenu}
                            className="block group"
                          >
                            <span className="nav-line block text-[0.85rem] sm:text-[0.9rem] text-gray-400 font-light tracking-wide group-hover:text-[#00B4D8] transition-colors py-0.5 will-change-transform">
                              {sub.label}
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 次要連結區 */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4 relative">
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#00B4D8]"></div>

              <a
                href={WEIBO_MEMBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="block overflow-hidden group cursor-pointer"
              >
                <div className="nav-line text-[0.8rem] sm:text-[0.875rem] text-gray-400 font-normal tracking-[0.1em] group-hover:text-white transition-colors flex items-center gap-3 will-change-transform">
                  <span>登入 / 註冊</span>
                </div>
              </a>

              <Link
                href="https://www.weiz.com.tw/"
                target="_blank"
                onClick={closeMenu}
                className="block overflow-hidden group cursor-pointer"
              >
                <div className="nav-line text-[0.8rem] sm:text-[0.875rem] text-gray-400 font-normal tracking-[0.1em] group-hover:text-white transition-colors flex items-center gap-3 will-change-transform">
                  <span>前往威柏科技選購</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
