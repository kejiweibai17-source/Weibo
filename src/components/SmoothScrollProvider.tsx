"use client";

import { useEffect, type ReactNode } from "react";

/** 手機／觸控：強制原生滾動，避免平滑滾動造成卡頓 */
const NATIVE_SCROLL_MQ =
  "(max-width: 1023px), (hover: none) and (pointer: coarse)";

export function preferNativeScroll(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(NATIVE_SCROLL_MQ).matches;
}

/**
 * 手機版關閉平滑滾動（Lenis / CSS scroll-behavior）
 * 桌機維持既有行為，不額外啟用 Lenis
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const mq = window.matchMedia(NATIVE_SCROLL_MQ);

    const applyNativeScroll = () => {
      if (!mq.matches) return;
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      document.documentElement.classList.remove(
        "lenis",
        "lenis-smooth",
        "lenis-scrolling",
        "lenis-stopped",
      );
    };

    applyNativeScroll();
    mq.addEventListener("change", applyNativeScroll);
    return () => mq.removeEventListener("change", applyNativeScroll);
  }, []);

  return <>{children}</>;
}
