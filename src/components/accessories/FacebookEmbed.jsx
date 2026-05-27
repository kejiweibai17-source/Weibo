"use client";

import React, { useEffect, useRef, useState } from "react";
import { resolveSocialEmbedSrc } from "@/lib/socialEmbed";

/** 依欄寬套用 FB 官方 embed 寬度，高度可覆寫或依寬度比例估算 */
export default function FacebookEmbed({ embed }) {
  const containerRef = useRef(null);
  const [columnWidth, setColumnWidth] = useState(embed.embedWidth ?? 350);

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

  const src = resolveSocialEmbedSrc(embed.platform, embed.url, {
    embedWidth: columnWidth,
  });

  if (!src) {
    return (
      <div
        ref={containerRef}
        className="w-full min-h-[200px] flex items-center justify-center text-center px-4 py-8 text-[13px] text-gray-400"
      >
        請填入 Facebook 貼文網址或 embed src
      </div>
    );
  }

  const height =
    embed.height ?? Math.max(400, Math.round(columnWidth * 2.05));

  return (
    <div
      ref={containerRef}
      className="w-full leading-[0] overflow-hidden"
      style={{ height }}
    >
      <iframe
        src={src}
        title={embed.label || "Facebook 貼文"}
        width={columnWidth}
        height={height}
        className="w-full border-0 block bg-transparent"
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
