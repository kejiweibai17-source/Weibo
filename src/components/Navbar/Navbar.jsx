"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { Globe, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
// 🌟 引入 GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ============================================================================
// 子組件區塊 (漢堡選單、購物車、會員)
// ============================================================================
function MenuToggleButton({ open, onClick, className = "", buttonRef }) {
  const spring = { type: "spring", stiffness: 260, damping: 20 };
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={open ? "關閉選單" : "開啟選單"}
      aria-expanded={open}
      whileTap={{ scale: 0.95 }}
      // 🌟 確保按鈕有足夠高的 z-index，且大小固定
      className={`inline-flex items-center justify-center focus:outline-none transition-colors z-[2100] relative w-10 h-10 ${className}`}
    >
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        initial={false}
        animate={open ? "open" : "closed"}
        className="text-white"
      >
        <motion.line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          variants={{
            closed: { translateY: 0, rotate: 0, x1: 3, x2: 21 },
            open: { translateY: 6, rotate: 45, x1: 5, x2: 19 },
          }}
          transition={spring}
          style={{ originX: "50%", originY: "50%" }}
        />
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          variants={{
            closed: { opacity: 1, x1: 3, x2: 21 },
            open: { opacity: 0, x1: 12, x2: 12 },
          }}
          transition={{ duration: 0.18 }}
        />
        <motion.line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          variants={{
            closed: { translateY: 0, rotate: 0, x1: 3, x2: 21 },
            open: { translateY: -6, rotate: -45, x1: 5, x2: 19 },
          }}
          transition={spring}
          style={{ originX: "50%", originY: "50%" }}
        />
      </motion.svg>
    </motion.button>
  );
}

function CartButton({ count = 0, onClick }) {
  return (
    <Link
      href="/cart"
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

function UserMenu({ isLoggedIn, user, onLogin, onLogout }) {
  return (
    <div className="relative flex items-center h-full group cursor-pointer">
      <button
        type="button"
        className="flex items-center text-white group-hover:text-gray-300 transition-colors py-6"
      >
        <User size={20} strokeWidth={1.5} />
      </button>
      <div className="absolute top-[80%] left-0 w-full h-8 bg-transparent z-[1499]"></div>
      <div className="absolute right-0 top-[100%] pt-2 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[1500]">
        <div className="w-40 rounded-b-xl bg-white shadow-2xl py-3 relative text-black border border-gray-100 flex flex-col">
          {!isLoggedIn ? (
            <button
              onClick={onLogin}
              className="block w-full text-left px-5 py-2.5 text-[13px] text-gray-500 hover:text-black hover:bg-slate-50 font-medium transition-all duration-300"
            >
              登入 / 註冊
            </button>
          ) : (
            <>
              <Link
                href="/account"
                className="block px-5 py-2.5 text-[13px] text-gray-500 hover:text-black hover:bg-slate-50 font-medium transition-all duration-300"
              >
                我的帳戶
              </Link>
              <button
                onClick={onLogout}
                className="block w-full text-left px-5 py-2.5 text-[13px] text-red-500 hover:text-red-700 hover:bg-slate-50 font-medium transition-all duration-300"
              >
                登出
              </button>
            </>
          )}
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  const cartItems = useCartStore((state) => state.items) || [];
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.qty || 0),
    0,
  );

  const [navState, setNavState] = useState("global");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useGSAP(
    () => {
      gsap.set(".line", { y: "100%" });

      tl.current = gsap
        .timeline({ paused: true })
        // 1. 科技感背景層次展開
        .to(".nav-bg", {
          scaleY: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        // 2. 主選單區塊遮罩滑入
        .to(
          ".nav-items",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
            ease: "power3.inOut",
          },
          "-=0.6",
        )
        // 3. 連結文字滑入
        .to(
          ".line",
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
            ease: "power3.out",
          },
          0.85,
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

  const refreshAuth = useCallback(async () => {
    try {
      const r = await fetch("/api/account/profile", {
        cache: "no-store",
        credentials: "include",
      });
      const js = await r.json();
      if (js.loggedIn && js.customer) {
        setIsLoggedIn(true);
        setUser({
          name: js.customer.first_name || "會員",
          email: js.customer.email,
        });
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [pathname, refreshAuth]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY <= 50) {
        setNavState("global");
      } else if (currentScrollY > lastScrollY + 5) {
        setNavState("product");
      } else if (currentScrollY < lastScrollY - 5) {
        setNavState("global");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const globalLinks = [
    {
      label: "產品資訊",
      href: "/product01",
      dropdown: [
        { label: "青春版電動刮鬍刀 (S1系列)", href: "/product01" },
        { label: "黑夜騎士電動刮鬍刀 (S1-DK)", href: "/product01" },
        { label: "小金剛旗艦三刀頭 (S3系列)", href: "/product01" },
        { label: "星座系列 (CQ系列)", href: "/product01" },
        { label: "多功能組合禮盒", href: "/product01" },
      ],
    },
    { label: "關於我們", href: "/about" },
    { label: "產品配件", href: "/accessories" },
    { label: "昔馬SMSMALL", href: "/brand" },
    { label: "聯絡我們", href: "/support" },
    { label: "Gallery", href: "/gallery" },
  ];

  const headerVariants = {
    visible: {
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    hidden: {
      y: "-100%",
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <>
      {/* 1. 全域導覽列 (Global Navbar) */}
      <motion.header
        variants={headerVariants}
        initial="visible"
        animate={navState === "global" ? "visible" : "hidden"}
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
                SMASMALL
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
                    className="text-[13px] font-medium text-white group-hover:text-gray-300 transition-colors tracking-wide h-full flex items-center px-2"
                  >
                    {link.label}
                  </Link>

                  {link.dropdown && (
                    <>
                      <div className="absolute top-[80%] left-0 w-full h-8 bg-transparent z-[1999]"></div>
                      <div className="absolute top-[100%] left-0 pt-2 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[2000]">
                        <div className="bg-white shadow-2xl py-3 min-w-[260px] border border-gray-100 flex flex-col">
                          {link.dropdown.map((sub, idx) => (
                            <Link
                              key={idx}
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
            <div className="hidden md:flex items-center gap-2 text-white hover:text-gray-300 transition-colors cursor-pointer text-[13px] font-medium">
              <Globe size={16} strokeWidth={1.5} /> En
            </div>
            <div className="w-[1px] h-4 bg-white/30 hidden md:block"></div>
            <div className="hidden md:block h-full">
              <UserMenu
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={() => {}}
                onLogout={() => {}}
              />
            </div>
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

      {/* 2. 產品導覽列 (Product Sub-Navbar) */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate={navState === "product" ? "visible" : "hidden"}
        className="fixed top-0 left-0 w-full h-[64px] bg-black/50 backdrop-blur-md z-[990]"
      >
        <div className="mx-auto flex w-full h-full max-w-[1600px] items-center justify-between px-4 md:px-6 lg:px-10">
          <div className="flex items-center">
            <a href="https://www.weiboltd.com" target="_blank" rel="noreferrer">
              <Image
                src="/images/logo-white.png"
                width={300}
                height={150}
                className="w-[100px] md:w-[120px]"
                priority
                alt="Logo"
              />
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="https://www.weiz.com.tw"
              className="bg-white text-black text-[12px] md:text-[13px] font-medium px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-gray-200 transition-colors tracking-wide"
            >
              購物商城
            </Link>

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

          {/* 🌟 頂部 Header：Logo 與關閉按鈕 */}
          <div className="w-full h-[72px] flex justify-between items-center mt-2 shrink-0">
            <span className="text-[18px] md:text-[20px] font-light tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              SMASMALL
            </span>
            <div className="pointer-events-auto">
              <MenuToggleButton open={true} onClick={closeMenu} />
            </div>
          </div>

          {/* 主要內容區，使用 flex-1 自動推擠，並確保在小螢幕不被截斷 */}
          <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 pl-0 sm:pl-4 mt-8 pb-8">
            {/* 主要導覽連結 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {globalLinks.map((link, idx) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="block overflow-hidden group"
                >
                  <div className="line flex items-center gap-4 transform translate-y-[100%] transition-transform duration-300 group-hover:translate-x-2">
                    {/* 數字 */}
                    <span className="text-[#00B4D8] text-[0.7rem] sm:text-[0.75rem] font-mono tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
                      0{idx + 1}
                    </span>
                    {/* 🌟 修改：字體響應式縮小 text-[1.25rem] */}
                    <span className="text-[1.25rem] sm:text-[1.5rem] leading-tight text-gray-200 font-light tracking-[0.15em] group-hover:text-[#00B4D8] transition-colors drop-shadow-md">
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* 次要連結區 (會員 / 語言) */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4 relative">
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#00B4D8]"></div>

              <Link
                href="https://www.weiz.com.tw/"
                target="_blank"
                className="block overflow-hidden group cursor-pointer"
              >
                <div className="line text-[0.8rem]  sm:text-[0.875rem] text-gray-400 font-normal tracking-[0.1em] transform translate-y-[100%] group-hover:text-white transition-all flex items-center gap-3">
                  <span> 前往威柏科技選購 </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
