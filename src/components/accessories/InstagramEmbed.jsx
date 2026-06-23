"use client";

import React, { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import {
  isInstagramReelUrl,
  resolveSocialEmbedSrc,
} from "@/lib/socialEmbed";

function defaultEmbedHeight(columnWidth, isReel) {
  if (isReel) {
    return Math.max(480, Math.round(columnWidth * 1.78));
  }
  return Math.max(400, Math.round(columnWidth * 2.05));
}

/** 與 FacebookEmbed 相同邏輯：依欄寬 iframe + 固定高度裁切 */
export default function InstagramEmbed({ embed }) {
  const containerRef = useRef(null);
  const [columnWidth, setColumnWidth] = useState(embed.embedWidth ?? 350);
  const isReel = embed?.isReel === true || isInstagramReelUrl(embed?.url);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setColumnWidth(w);
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
        className="w-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-8 text-[13px] text-gray-400 rounded-2xl border-2 border-dashed border-gray-200"
      >
        <Instagram size={36} className="text-gray-300 mb-3" />
        請填入 Instagram 貼文或 Reels 網址
      </div>
    );
  }

  const height = embed.height ?? defaultEmbedHeight(columnWidth, isReel);

  return (
    <div
      ref={containerRef}
      className={`w-full leading-[0] overflow-hidden ${
        isReel ? "mx-auto max-w-[360px]" : ""
      }`}
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
