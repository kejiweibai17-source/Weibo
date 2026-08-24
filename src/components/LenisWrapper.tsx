"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import { preferNativeScroll } from "./SmoothScrollProvider";

/**
 * 僅桌機啟用 Lenis；手機／觸控改走原生滾動，避免卡頓
 */
export default function LenisWrapper({ children }: { children: ReactNode }) {
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const sync = () => setEnableLenis(!preferNativeScroll());
    sync();
    const mq = window.matchMedia(
      "(max-width: 1023px), (hover: none) and (pointer: coarse)",
    );
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enableLenis) {
    return <>{children}</>;
  }

  return <ReactLenis root>{children}</ReactLenis>;
}
