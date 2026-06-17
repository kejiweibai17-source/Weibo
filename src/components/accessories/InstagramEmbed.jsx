"use client";

import React, { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import {
  extractInstagramPermalink,
  isInstagramReelUrl,
} from "@/lib/socialEmbed";

function loadInstagramEmbedScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.instgrm?.Embeds) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src*="instagram.com/embed.js"]',
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    document.body.appendChild(script);
  });
}

export default function InstagramEmbed({ embed }) {
  const hostRef = useRef(null);
  const permalink = extractInstagramPermalink(embed?.url);
  const isReel = embed?.isReel === true || isInstagramReelUrl(embed?.url);

  useEffect(() => {
    if (!permalink || !hostRef.current) return undefined;

    let cancelled = false;

    loadInstagramEmbedScript().then(() => {
      if (cancelled || !hostRef.current) return;
      window.instgrm?.Embeds?.process(hostRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [permalink, isReel]);

  if (!permalink) {
    return (
      <div className="w-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-8 text-[13px] text-gray-400 rounded-2xl border-2 border-dashed border-gray-200">
        <Instagram size={36} className="text-gray-300 mb-3" />
        請填入 Instagram 貼文或 Reels 網址
      </div>
    );
  }

  return (
    <div
      className={
        isReel
          ? "instagram-embed-host instagram-embed-host--reel"
          : "instagram-embed-host instagram-embed-host--post"
      }
    >
      <div ref={hostRef} className="instagram-embed-host__inner">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          {...(!isReel ? { "data-instgrm-captioned": "" } : {})}
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: 0,
            boxShadow: "none",
            margin: 0,
            padding: 0,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          <a href={permalink} target="_blank" rel="noopener noreferrer">
            在 Instagram 查看此貼文
          </a>
        </blockquote>
      </div>
    </div>
  );
}
