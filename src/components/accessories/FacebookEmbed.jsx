"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  cleanFacebookPermalink,
  extractFacebookPluginHref,
  isFacebookVideoUrl,
  resolveSocialEmbedSrc,
} from "@/lib/socialEmbed";

const EMBED_WIDTH = 350;

function getOpenUrl(embed) {
  const raw = String(embed?.url || "").trim();
  if (!raw) return "";
  const fromPlugin = extractFacebookPluginHref(raw);
  return cleanFacebookPermalink(fromPlugin || raw);
}

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

  const openUrl = useMemo(() => getOpenUrl(embed), [embed]);
  const src = resolveSocialEmbedSrc(embed.platform, embed.url, {
    embedWidth: columnWidth,
  });

  if (!src) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-[200px] w-full max-w-[350px] items-center justify-center px-4 py-8 text-center text-[13px] text-gray-400"
      >
        請填入 Facebook 貼文網址或 embed src
      </div>
    );
  }

  const isVideo =
    embed.isVideo === true || isFacebookVideoUrl(embed.url || openUrl || src);

  let height;
  if (embed.height && !isVideo) {
    height = embed.height;
  } else if (isVideo) {
    height = Math.max(220, Math.round(columnWidth * (9 / 16) + 48));
  } else {
    height = Math.max(420, Math.round(columnWidth * 1.35));
  }

  return (
    <div ref={containerRef} className="w-full max-w-[350px]">
      <div className="bg-black/5 leading-[0]" style={{ height }}>
        <iframe
          key={src}
          src={src}
          title={embed.label || "Facebook 貼文"}
          width={columnWidth}
          height={height}
          className="block w-full border-0 bg-transparent"
          style={{ width: "100%", height, maxWidth: "100%", margin: 0 }}
          // 不用 lazy：避免 FB plugin 延遲載入後一直顯示無法取得
          loading="eager"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          scrolling="no"
        />
      </div>
      {openUrl ? (
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-[12px] font-medium text-[#1877F2] underline-offset-2 hover:underline"
        >
          若無法顯示，請在 Facebook 開啟
        </a>
      ) : null}
    </div>
  );
}
