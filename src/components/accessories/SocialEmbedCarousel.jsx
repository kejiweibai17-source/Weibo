"use client";

import { useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import FacebookEmbed from "@/components/accessories/FacebookEmbed";
import InstagramEmbed from "@/components/accessories/InstagramEmbed";

/**
 * iframe 會吃掉指標事件，預設擋掉拖曳。
 * 覆蓋層負責 drag；點一下後才讓 iframe 可互動。
 */
function DragSafeSlide({ children }) {
  const [interactive, setInteractive] = useState(false);

  return (
    <div
      className="relative h-full"
      onMouseLeave={() => setInteractive(false)}
    >
      <div
        className={
          interactive ? undefined : "pointer-events-none select-none"
        }
      >
        {children}
      </div>
      {!interactive ? (
        <button
          type="button"
          aria-label="拖曳切換貼文，點擊後可互動"
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing bg-transparent"
          onClick={() => setInteractive(true)}
        />
      ) : null}
    </div>
  );
}

function Slide({ embed, Embed }) {
  return (
    <div className="min-w-0 flex-[0_0_calc(50%-6px)] max-w-[350px] pl-3 first:pl-0">
      <DragSafeSlide>
        <Embed embed={{ ...embed, embedWidth: 350 }} />
      </DragSafeSlide>
    </div>
  );
}

/**
 * Instagram / Facebook 輪播規則（同行可視約 2 則）：
 * - ≤2 則：不輪播，靜態並排
 * - 3 則：可拖曳／自動向左，到底停住、不回頭
 * - ≥4 則：無限循環向左輪播
 */
export default function SocialEmbedCarousel({ items, platform }) {
  const count = items?.length ?? 0;
  const canScroll = count > 2;
  const infinite = count >= 4;

  const autoplay = useRef(
    Autoplay({
      delay: 4500,
      playOnInit: canScroll,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      // 3 則：到最後一則停止，不往回跳
      stopOnLastSnap: !infinite,
    }),
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: infinite,
      align: "start",
      skipSnaps: false,
      dragFree: false,
      // 3 則到底後不可再拖過去；無限模式不 contain
      containScroll: infinite ? false : "trimSnaps",
      watchDrag: canScroll,
    },
    canScroll ? [autoplay.current] : [],
  );

  if (!count) return null;

  const Embed = platform === "instagram" ? InstagramEmbed : FacebookEmbed;

  // ≤2 則：靜態一行，不啟用輪播
  if (!canScroll) {
    return (
      <div className="flex touch-pan-y">
        {items.map((embed, index) => (
          <Slide
            key={embed.id ?? index}
            embed={embed}
            Embed={Embed}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((embed, index) => (
            <Slide
              key={embed.id ?? index}
              embed={embed}
              Embed={Embed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
