"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, Youtube } from "lucide-react";
import {
  extractYoutubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/socialEmbed";

function detectIsShorts(embed) {
  if (embed.isShorts === true) return true;
  const url = embed.url ?? "";
  return url.includes("/shorts/") || url.includes("youtube.com/shorts");
}

/** 載入 YouTube IFrame API（全站 singleton） */
let ytApiPromise = null;
function loadYoutubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  });

  return ytApiPromise;
}

/** 安全卸載 YT Player，避免 React removeChild 與 YT API 衝突 */
function destroyYoutubePlayer(containerRef, playerRef) {
  const player = playerRef.current;
  playerRef.current = null;

  if (player) {
    try {
      player.destroy();
    } catch {
      /* iframe 可能已被 YT API 移除 */
    }
  }

  const el = containerRef.current;
  if (el) {
    el.innerHTML = "";
  }
}

function YoutubeSlideCard({ embed, isPlaying, onPlay, onVideoStop }) {
  const isShorts = detectIsShorts(embed);
  const videoId = extractYoutubeVideoId(embed.url);
  const thumb = videoId ? youtubeThumbnailUrl(videoId) : null;
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const stopHandledRef = useRef(false);

  const handleVideoStop = useCallback(() => {
    if (stopHandledRef.current) return;
    stopHandledRef.current = true;

    destroyYoutubePlayer(containerRef, playerRef);

    requestAnimationFrame(() => {
      onVideoStop?.();
    });
  }, [onVideoStop]);

  useEffect(() => {
    if (!isPlaying || !videoId) {
      destroyYoutubePlayer(containerRef, playerRef);
      return undefined;
    }

    stopHandledRef.current = false;
    let cancelled = false;

    const mountPlayer = () => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          playsinline: 1,
          autoplay: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            const { YT } = window;
            if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {
              handleVideoStop();
            }
          },
        },
      });
    };

    loadYoutubeApi().then(() => {
      if (!cancelled) mountPlayer();
    });

    return () => {
      cancelled = true;
      destroyYoutubePlayer(containerRef, playerRef);
    };
  }, [isPlaying, videoId, handleVideoStop]);

  return (
    <div className="border border-gray-100 bg-white overflow-hidden h-full">
      {embed.label && (
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
          <Youtube size={15} className="text-[#FF0000] shrink-0" />
          <span className="text-[12px] font-semibold text-gray-700 line-clamp-1">
            {embed.label}
          </span>
          {isShorts && (
            <span className="ml-auto text-[10px] font-bold bg-[#FF0000] text-white px-1.5 py-0.5 shrink-0">
              Shorts
            </span>
          )}
        </div>
      )}

      <div
        className={`relative w-full bg-black ${isShorts ? "aspect-[9/16]" : "aspect-video"}`}
      >
        {/* 播放器容器常駐 DOM，避免暫停時 React 卸載節點與 YT API 衝突 */}
        {videoId && (
          <div
            ref={containerRef}
            className={[
              "absolute inset-0 h-full w-full [&>iframe]:h-full [&>iframe]:w-full",
              isPlaying ? "z-10" : "z-0 invisible pointer-events-none",
            ].join(" ")}
            aria-hidden={!isPlaying}
          />
        )}

        {!isPlaying && (
          <button
            type="button"
            aria-label={`播放 ${embed.label || "YouTube 影片"}`}
            onClick={onPlay}
            className="group absolute inset-0 z-20 flex w-full items-center justify-center overflow-hidden"
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900" />
            )}
            <span className="relative z-10 flex h-14 w-14 items-center justify-center bg-[#FF0000] shadow-lg transition-transform group-hover:scale-110">
              <Play size={22} className="ml-1 fill-white text-white" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 多支 YouTube 影片：Embla 無限循環向左輪播
 * 點擊播放 → 停止輪播；影片暫停／播畢 → 恢復輪播
 */
export default function YoutubeEmbedCarousel({ items }) {
  const [playingId, setPlayingId] = useState(null);
  const autoplay = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, playOnInit: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [autoplay.current],
  );

  const resumeCarousel = useCallback(() => {
    setPlayingId(null);
    autoplay.current?.play();
  }, []);

  const handlePlay = useCallback(
    (embedId, index) => {
      autoplay.current?.stop();
      emblaApi?.scrollTo(index, true);
      setPlayingId(embedId);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (playingId) {
      autoplay.current?.stop();
    }
  }, [playingId]);

  if (!items?.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((embed, index) => {
            const isShorts = detectIsShorts(embed);
            return (
              <div
                key={embed.id ?? index}
                className={[
                  "min-w-0 pl-3 first:pl-0",
                  isShorts
                    ? "flex-[0_0_100%] max-w-[350px]"
                    : "flex-[0_0_92%] sm:flex-[0_0_480px]",
                ].join(" ")}
              >
                <YoutubeSlideCard
                  embed={embed}
                  isPlaying={playingId === embed.id}
                  onPlay={() => handlePlay(embed.id, index)}
                  onVideoStop={resumeCarousel}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
