"use client";

import React, { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import {
  isInstagramReelUrl,
  resolveSocialEmbedSrc,
} from "@/lib/socialEmbed";

const EMBED_WIDTH = 350;

/** Instagram 官方 embed：固定 350 寬，高度依內容估算、不裁切 */
export default function InstagramEmbed({ embed }) {
  const containerRef = useRef(null);
  const [columnWidth, setColumnWidth] = useState(
    Math.min(embed.embedWidth ?? EMBED_WIDTH, EMBED_WIDTH),
  );
  const isReel = embed?.isReel === true || isInstagramReelUrl(embed?.url);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setColumnWidth(Math.min(w, EMBED_WIDTH));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [embed.embedWidth]);

  const src = resolveSocialEmbedSrc("instagram", embed?.url, {
    embedWidth: columnWidth,
  });

  if (!src) {
    return (
      <div
        ref={containerRef}
        className="w-full max-w-[350px] min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-8 text-[13px] text-gray-400 border border-dashed border-gray-200"
      >
        <Instagram size={36} className="text-gray-300 mb-3" />
        請填入 Instagram 貼文或 Reels 網址
      </div>
    );
  }

  // Reels 約 9:16；一般貼文約正方形圖 + 標題列，避免過高留白與裁切
  const height =
    embed.height ??
    (isReel
      ? Math.round(columnWidth * (16 / 9))
      : Math.round(columnWidth * 1.45 + 72));

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[350px] leading-[0] bg-white"
      style={{ height }}
    >
      <iframe
        src={src}
        title={embed.label || "Instagram 貼文"}
        width={columnWidth}
        height={height}
        className="w-full border-0 block bg-white"
        style={{ width: "100%", height, maxWidth: "100%", margin: 0 }}
        loading="lazy"
        allowFullScreen
        allow="encrypted-media; clipboard-write"
        referrerPolicy="no-referrer-when-downgrade"
        scrolling="no"
      />
    </div>
  );
}
