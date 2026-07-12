"use client";

import { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import FacebookEmbed from "@/components/accessories/FacebookEmbed";
import InstagramEmbed from "@/components/accessories/InstagramEmbed";

/**
 * Instagram / Facebook 共用輪播：每則 max-w-[350px]、無圓角
 */
export default function SocialEmbedCarousel({ items, platform }) {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: items.length > 1 }),
  );
  const [emblaRef] = useEmblaCarousel(
    {
      loop: items.length > 1,
      align: "start",
      containScroll: "trimSnaps",
    },
    items.length > 1 ? [autoplay.current] : [],
  );

  if (!items?.length) return null;

  const Embed = platform === "instagram" ? InstagramEmbed : FacebookEmbed;

  return (
    <div className="relative max-w-[350px]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((embed, index) => (
            <div
              key={embed.id ?? index}
              className="min-w-0 flex-[0_0_100%] max-w-[350px]"
            >
              <Embed embed={{ ...embed, embedWidth: 350 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
