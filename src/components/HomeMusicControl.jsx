"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  getHomeMusicVolume,
  HOME_MUSIC_DEFAULT_VOLUME,
  isHomeMusicMuted,
  setHomeMusicVolume,
  startHomeMusic,
  subscribeHomeMusic,
  toggleHomeMusicPlayback,
} from "@/lib/homeMusic";

/**
 * 固定右下角：喇叭 + 音量 bar
 * 首屏深色 hero → 淺色；捲到淺色內容 → 深色
 */
export default function HomeMusicControl() {
  const [volume, setVolume] = useState(HOME_MUSIC_DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [onLightBg, setOnLightBg] = useState(false);

  useEffect(() => {
    startHomeMusic();

    const sync = () => {
      setVolume(getHomeMusicVolume());
      setMuted(isHomeMusicMuted());
    };
    sync();
    return subscribeHomeMusic(sync);
  }, []);

  useEffect(() => {
    const update = () => {
      const threshold = Math.min(window.innerHeight * 0.75, 640);
      setOnLightBg(window.scrollY > threshold);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const displayVolume = muted ? 0 : volume;

  return (
    <div
      className={`home-music-control pointer-events-auto fixed bottom-5 right-5 z-[90] flex items-center gap-1.5 bg-transparent transition-colors duration-300 md:bottom-8 md:right-8 md:gap-2 ${
        onLightBg ? "is-on-light" : "is-on-dark"
      }`}
      role="group"
      aria-label="背景音樂控制"
      style={{ "--music-vol": `${displayVolume * 100}%` }}
    >
      <button
        type="button"
        onClick={toggleHomeMusicPlayback}
        className={`flex h-4 w-4 shrink-0 items-center justify-center transition-colors hover:opacity-80 md:h-[18px] md:w-[18px] ${
          onLightBg ? "text-neutral-900" : "text-white/90"
        }`}
        aria-label={muted ? "開啟音樂" : "關閉音樂"}
        aria-pressed={!muted}
      >
        {muted ? (
          <VolumeX className="h-3.5 w-3.5 md:h-[15px] md:w-[15px]" strokeWidth={1.6} />
        ) : (
          <Volume2 className="h-3.5 w-3.5 md:h-[15px] md:w-[15px]" strokeWidth={1.6} />
        )}
      </button>

      <label className="sr-only" htmlFor="home-music-volume">
        音量
      </label>
      <input
        id="home-music-volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={displayVolume}
        onChange={(e) => setHomeMusicVolume(Number(e.target.value))}
        className="home-music-slider w-11 cursor-pointer appearance-none bg-transparent md:w-14"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayVolume * 100)}
        aria-label="音樂音量"
      />

      <style jsx>{`
        .home-music-slider {
          height: 10px;
        }
        .is-on-dark .home-music-slider::-webkit-slider-runnable-track {
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.9) var(--music-vol),
            rgba(255, 255, 255, 0.3) var(--music-vol),
            rgba(255, 255, 255, 0.3) 100%
          );
        }
        .is-on-light .home-music-slider::-webkit-slider-runnable-track {
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            rgba(23, 23, 23, 0.92) 0%,
            rgba(23, 23, 23, 0.92) var(--music-vol),
            rgba(23, 23, 23, 0.28) var(--music-vol),
            rgba(23, 23, 23, 0.28) 100%
          );
        }
        .is-on-dark .home-music-slider::-moz-range-track {
          height: 1px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.3);
        }
        .is-on-light .home-music-slider::-moz-range-track {
          height: 1px;
          border-radius: 9999px;
          background: rgba(23, 23, 23, 0.28);
        }
        .is-on-dark .home-music-slider::-moz-range-progress {
          height: 1px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
        }
        .is-on-light .home-music-slider::-moz-range-progress {
          height: 1px;
          border-radius: 9999px;
          background: rgba(23, 23, 23, 0.92);
        }
        .home-music-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 6px;
          height: 6px;
          margin-top: -2.5px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
        }
        .is-on-dark .home-music-slider::-webkit-slider-thumb {
          background: #fff;
        }
        .is-on-light .home-music-slider::-webkit-slider-thumb {
          background: #171717;
        }
        .home-music-slider::-moz-range-thumb {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
        }
        .is-on-dark .home-music-slider::-moz-range-thumb {
          background: #fff;
        }
        .is-on-light .home-music-slider::-moz-range-thumb {
          background: #171717;
        }
      `}</style>
    </div>
  );
}
