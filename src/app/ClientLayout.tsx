// app/ClientLayout.tsx
"use client";

import { ViewTransitions } from "next-view-transitions";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer1";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/cart/CartDrawer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AOS from "aos";
import "aos/dist/aos.css";

function ScrollToTopOnNav() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 初始化 AOS（手機停用，避免滾動卡頓）
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      disable: () =>
        window.matchMedia(
          "(max-width: 1023px), (hover: none) and (pointer: coarse)",
        ).matches,
    });
  }, []);

  return (
    <ViewTransitions>
      <style jsx global>{`
        :root {
          view-transition-name: app-root;
        }

        /* 手機／觸控：強制原生滾動，關閉平滑滾動 */
        @media (max-width: 1023px), (hover: none) and (pointer: coarse) {
          html,
          body {
            scroll-behavior: auto !important;
          }
        }

        /* 🌟 統一設定 3C 科技感的阻尼過渡時間與曲線 */
        ::view-transition-new(app-root),
        ::view-transition-old(app-root) {
          animation-duration: 0.6s;
          /* 這是極具科技感的貝茲曲線：起步極快，收尾極其滑順 */
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }

        /* 舊畫面退場：微微縮小並模糊消失 */
        ::view-transition-old(app-root) {
          animation-name: tech-scale-out;
        }

        /* 新畫面進場：從微微放大且模糊的狀態，清晰縮放歸位 */
        ::view-transition-new(app-root) {
          animation-name: tech-scale-in;
        }

        @keyframes tech-scale-out {
          from {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
          to {
            opacity: 0;
            transform: scale(0.98);
            filter: blur(4px);
          }
        }

        @keyframes tech-scale-in {
          from {
            opacity: 0;
            transform: scale(1.03);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
        }

        /* 尊重使用者的減弱動態設定 */
        @media (prefers-reduced-motion: reduce) {
          ::view-transition-new(app-root),
          ::view-transition-old(app-root) {
            animation: none !important;
          }
        }
      `}</style>

      <SmoothScrollProvider>
        <ScrollToTopOnNav />

        {/* 導覽列排除在換頁動畫之外，保持固定不動 */}
        <div
          className="fixed left-0 top-0 z-[999999999999999] w-screen"
          style={{ viewTransitionName: "none" }}
        >
          <Navbar />
        </div>

        <main className="min-h-screen">{children}</main>

        <CartDrawer />
        <Footer />
      </SmoothScrollProvider>
    </ViewTransitions>
  );
}
