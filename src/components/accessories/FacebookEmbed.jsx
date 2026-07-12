"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  isFacebookVideoUrl,
  resolveSocialEmbedSrc,
} from "@/lib/socialEmbed";

const EMBED_WIDTH = 350;

/** Facebook embed：固定 max 350 寬，影片 16:9、無圓角 */
export default function FacebookEmbed({ embed }) {
  const containerRef = useRef(null);
  const [columnWidth, setColumnWidth] = useState(
    Math.min(embed.embedWidth ?? EMBED_WIDTH, EMBED_WIDTH),
  );

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

  const src = resolveSocialEmbedSrc(embed.platform, embed.url, {
    embedWidth: columnWidth,
  });

  if (!src) {
    return (
      <div
        ref={containerRef}
        className="w-full max-w-[350px] min-h-[200px] flex items-center justify-center text-center px-4 py-8 text-[13px] text-gray-400"
      >
        請填入 Facebook 貼文網址或 embed src
      </div>
    );
  }

  const isVideo =
    embed.isVideo === true || isFacebookVideoUrl(embed.url || src);

  let height;
  if (embed.height && !isVideo) {
    height = embed.height;
  } else if (isVideo) {
    height = Math.max(220, Math.round(columnWidth * (9 / 16) + 48));
  } else {
    height = Math.max(360, Math.round(columnWidth * 1.25));
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[350px] leading-[0] bg-black/5"
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
