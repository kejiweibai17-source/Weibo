"use client";

import { useState } from "react";
import Copy from "@/components/Copy";

export default function SeriesYoutubeEmbed({
  eyebrow,
  title,
  description,
  youtubeId,
  thumbnail,
}) {
  const [open, setOpen] = useState(false);
  const poster =
    thumbnail || `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <section className="bg-[#111] px-6 py-24 text-white md:px-10">
      <div className="mx-auto max-w-[1200px]">
        {(eyebrow || title) && (
          <div className="mb-10 text-center">
            {eyebrow ? (
              <Copy>
                <p className="mb-3 text-xs tracking-[0.35em] text-white/60 uppercase">
                  {eyebrow}
                </p>
              </Copy>
            ) : null}
            {title ? (
              <Copy>
                <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
              </Copy>
            ) : null}
            {description ? (
              <Copy>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 md:text-base">
                  {description}
                </p>
              </Copy>
            ) : null}
          </div>
        )}

        <div className="relative mx-auto aspect-video max-w-[960px] overflow-hidden rounded-2xl bg-black shadow-2xl">
          {open ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title || "YouTube 影片"}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label="播放影片"
            >
              <img
                src={poster}
                alt={title || "YouTube 影片縮圖"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/25" />
              <span className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black">
                ▶
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
