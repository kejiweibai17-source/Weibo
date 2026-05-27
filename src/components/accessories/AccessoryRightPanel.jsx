"use client";

import React from "react";
import {
  Truck,
  Shield,
  Package,
  CreditCard,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { resolveSocialEmbedSrc } from "@/lib/socialEmbed";
import FacebookEmbed from "@/components/accessories/FacebookEmbed";

const ICON_MAP = {
  truck: Truck,
  shield: Shield,
  package: Package,
  creditCard: CreditCard,
};

const PLATFORM_META = {
  youtube: { Icon: Youtube, fallbackLabel: "YouTube" },
  facebook: { Icon: Facebook, fallbackLabel: "Facebook" },
  instagram: { Icon: Instagram, fallbackLabel: "Instagram" },
};

const EMBED_GROUPS = [
  { platform: "youtube", titleKey: "youtubeSectionTitle" },
  { platform: "facebook", titleKey: "facebookSectionTitle" },
];

function defaultEmbedHeight(platform) {
  if (platform === "youtube") return 400;
  if (platform === "facebook") return 720;
  if (platform === "instagram") return 520;
  return 420;
}

function FeatureVisual({ icon }) {
  const Icon = ICON_MAP[icon] ?? Package;
  return (
    <div className="flex items-center justify-center py-8 lg:py-12">
      <div className="relative">
        <div className="absolute inset-0 bg-[#00B4D8]/10 rounded-full blur-2xl scale-150" />
        <Icon
          className="relative w-16 h-16 lg:w-20 lg:h-20 text-[#00B4D8]"
          strokeWidth={1.25}
        />
      </div>
    </div>
  );
}

function SocialEmbedCard({ embed }) {
  if (embed.platform === "facebook") {
    return <FacebookEmbed embed={embed} />;
  }

  const src = resolveSocialEmbedSrc(embed.platform, embed.url, {
    embedWidth: embed.embedWidth,
  });
  const meta = PLATFORM_META[embed.platform] ?? PLATFORM_META.facebook;
  const PlatformIcon = meta.Icon;

  if (!src) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <PlatformIcon size={18} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-500">
            {embed.label || meta.fallbackLabel}
          </span>
        </div>
        <div className="min-h-[240px] flex flex-col items-center justify-center px-6 py-10 text-center">
          <PlatformIcon size={40} className="text-gray-300 mb-4" />
          <p className="text-[14px] text-gray-500 leading-relaxed max-w-xs">
            請在 <strong>socialEmbeds</strong> 填入{" "}
            {embed.platform === "youtube" ? "YouTube 影片" : "貼文"}網址或 embed
            src
          </p>
        </div>
      </div>
    );
  }

  const height = embed.height ?? defaultEmbedHeight(embed.platform);
  const iframeAllow =
    embed.platform === "youtube"
      ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      : "encrypted-media; clipboard-write";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
      {embed.label && (
        <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
          <PlatformIcon size={16} className="text-[#00B4D8]" />
          <span className="text-[13px] font-semibold text-gray-700 line-clamp-2">
            {embed.label}
          </span>
        </div>
      )}
      <iframe
        src={src}
        title={embed.label || embed.platform}
        className="w-full border-0 block bg-black"
        style={{ height }}
        loading="lazy"
        allowFullScreen
        allow={iframeAllow}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 lg:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex gap-0.5 text-[#00B4D8]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm">
              {i < (review.rating ?? 5) ? "★" : "☆"}
            </span>
          ))}
        </div>
        {review.date && (
          <time className="text-[12px] text-gray-400 shrink-0">
            {review.date}
          </time>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[14px] font-bold text-[#007aff]">
          {review.author}
        </span>
        {review.verified && (
          <span className="text-[10px] font-bold uppercase tracking-wide bg-[#007aff] text-white px-2 py-0.5 rounded-full">
            Verified
          </span>
        )}
      </div>
      {review.photos?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.photos.map((src) => (
            <div
              key={src}
              className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      {review.title && (
        <h4 className="font-bold text-gray-900 text-[15px] mb-2">
          {review.title}
        </h4>
      )}
      <p className="text-[14px] text-gray-600 leading-relaxed">{review.body}</p>
    </article>
  );
}

export default function AccessoryRightPanel({ panel }) {
  if (!panel) return null;

  const {
    storeTitle,
    featureCards,
    socialEmbeds,
    customerReviews,
    socialSectionTitle,
    reviewsSectionTitle,
    youtubeSectionTitle,
    facebookSectionTitle,
  } = panel;

  const sectionTitles = {
    youtubeSectionTitle: youtubeSectionTitle || "YouTube",
    facebookSectionTitle: facebookSectionTitle || "Facebook",
  };

  return (
    <div className="mt-10 lg:mt-14 space-y-10 lg:space-y-12 border-t border-gray-100 pt-10 lg:pt-14">
      {featureCards?.length > 0 && (
        <section>
          <h2 className="text-2xl lg:text-[2rem] font-bold text-gray-900 tracking-tight mb-8 lg:mb-10">
            {storeTitle || "昔馬官方購物體驗"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-[#f7f7f8] overflow-hidden flex flex-col"
              >
                <p className="text-center text-[15px] lg:text-[16px] font-semibold text-gray-800 pt-6 px-4">
                  {card.title}
                </p>
                <FeatureVisual icon={card.icon} />
              </div>
            ))}
          </div>
        </section>
      )}

      {socialEmbeds?.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            {socialSectionTitle || "影片與社群"}
          </h3>

          {EMBED_GROUPS.map(({ platform, titleKey }) => {
            const items = socialEmbeds.filter((e) => e.platform === platform);
            if (items.length === 0) return null;

            const isFacebook = platform === "facebook";

            return (
              <div
                key={platform}
                className={isFacebook ? "space-y-3" : "space-y-4"}
              >
                <h4 className="text-[15px] font-semibold text-gray-500 uppercase tracking-wider">
                  {sectionTitles[titleKey]}
                </h4>
                <div
                  className={`grid items-start ${
                    isFacebook
                      ? "grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2"
                      : "grid-cols-1 gap-4 lg:gap-6"
                  }`}
                >
                  {items.map((embed) => (
                    <SocialEmbedCard key={embed.id} embed={embed} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {customerReviews?.length > 0 && (
        <section className="pt-2">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight mb-5">
            {reviewsSectionTitle || "顧客評價"}
          </h3>
          <div className="space-y-4">
            {customerReviews.map((review, idx) => (
              <ReviewCard key={review.id ?? idx} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
