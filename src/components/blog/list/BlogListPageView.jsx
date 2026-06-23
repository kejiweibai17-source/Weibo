"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion } from "framer-motion";

const ANKER_BLUE = "#1a5cff";

function isRemoteImage(src) {
  return typeof src === "string" && /^https?:\/\//.test(src);
}

function ConfidenceIcon({ type }) {
  const icons = {
    truck: (
      <path d="M3 6h11v8H3V6zm11 2h3l2 2v4h-5V8zM6 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    ),
    shield: (
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V5l8-3zm0 2.2L6 6.3V11c0 3.8 2.6 6.5 6 7 3.4-.5 6-3.2 6-7V6.3l-6-2.1z" />
    ),
    card: (
      <path d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 4h18V7H3v2z" />
    ),
    support: (
      <path d="M12 2a8 8 0 00-8 8c0 1.6.5 3.1 1.3 4.3L4 20l5.7-1.3A8 8 0 1012 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    ),
    bag: <path d="M7 7V5a5 5 0 0110 0v2h3v14H4V7h3zm2 0h6V5a3 3 0 00-6 0v2z" />,
    wrench: (
      <path d="M14.7 6.3a1 1 0 00-1.4 0l-1.3 1.3-2.6-2.6 1.3-1.3a1 1 0 00-1.4-1.4l-1.3 1.3a3.5 3.5 0 104.9 4.9l1.3-1.3a1 1 0 000-1.4l-2.6-2.6 1.3-1.3a1 1 0 000-1.4z" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-[#1d1d1f]"
      aria-hidden
    >
      {icons[type] ?? icons.support}
    </svg>
  );
}

function MomentsSection({ moments }) {
  const items = moments.items ?? [];
  const featuredIdx = items.findIndex((item) => item.featured);
  const defaultIndex = featuredIdx >= 0 ? featuredIdx : 0;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  if (!items.length) return null;

  return (
    <section className="bg-[#f5f5f7] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-[28px] font-bold text-[#1d1d1f] md:text-[36px]">
          {moments.title}
        </h2>

        {/* 手機：橫向捲動 */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 md:hidden">
          {items.map((item, i) => (
            <Link
              key={`${item.href}-mobile-${i}`}
              href={item.href}
              className="group relative aspect-[3/4] min-w-[200px] flex-shrink-0 overflow-hidden rounded-xl bg-[#e8e8ed]"
            >
              <Image
                src={item.image}
                alt={item.title || "理容場景"}
                fill
                unoptimized={isRemoteImage(item.image)}
                quality={95}
                className="object-cover"
                sizes="(max-width: 768px) 85vw, 400px"
              />
              {item.title && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="line-clamp-2 text-[16px] font-bold leading-snug text-white">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/85">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>

        {/* 桌面：hover 展開寬度 */}
        <div
          className="mt-10 hidden h-[420px] gap-3 md:flex"
          onMouseLeave={() => setActiveIndex(defaultIndex)}
        >
          {items.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <Link
                key={`${item.href}-desktop-${i}`}
                href={item.href}
                onMouseEnter={() => setActiveIndex(i)}
                className="relative min-w-0 overflow-hidden rounded-xl bg-[#e8e8ed] transition-[flex] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ flex: isActive ? "3 1 0%" : "1 1 0%" }}
              >
                <Image
                  src={item.image}
                  alt={item.title || "理容場景"}
                  fill
                  unoptimized={isRemoteImage(item.image)}
                  quality={95}
                  priority={i < 2}
                  className="object-cover"
                  sizes="(max-width: 1200px) 70vw, 900px"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div
                  className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 md:p-6 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  {item.title && (
                    <p className="line-clamp-2 text-[16px] font-bold leading-snug text-white md:text-[18px]">
                      {item.title}
                    </p>
                  )}
                  {item.subtitle && (
                    <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-white/85 md:text-[14px]">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectionCard({ post }) {
  const href = post.isMock ? "/blog" : `/blog/${post.slug}`;

  return (
    <Link href={href} className="group block text-left">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:rounded-[24px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized={isRemoteImage(post.image)}
          quality={95}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <h3 className="mt-5 text-[16px] font-semibold leading-snug text-[#1d1d1f] md:mt-6">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-[13px] leading-relaxed text-[#6e6e73] md:text-[14px]">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}

function SelectionsSection({ selections, posts }) {
  const [activeTab, setActiveTab] = useState("new");
  const displayPosts = activeTab === "popular" ? [...posts].reverse() : posts;

  return (
    <section className="bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="text-[32px] font-bold leading-tight text-[#1d1d1f] md:text-[48px]">
          {selections.title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {selections.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-6 py-2.5 text-[14px] font-medium transition-colors md:text-[15px] ${
                activeTab === tab.id
                  ? "border-[#1d1d1f] bg-white text-[#1d1d1f]"
                  : "border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#1d1d1f]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 text-left md:mt-16 md:grid-cols-3 md:gap-6">
          {displayPosts.map((post) => (
            <SelectionCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfidenceSection({ confidence }) {
  return (
    <section
      className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24"
      style={{
        backgroundColor: ANKER_BLUE,
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 80px,
          rgba(255,255,255,0.04) 80px,
          rgba(255,255,255,0.04) 160px
        )`,
      }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        <motion.h2
          className="text-[28px] font-bold text-white md:text-[36px]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {confidence.title}
        </motion.h2>
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25, margin: "-48px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          {confidence.items.map((item) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, y: 48 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.68,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="flex min-h-[160px] flex-col justify-between bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  {item.label}
                </span>
                <ConfidenceIcon type={item.icon} />
              </div>
              <p className="mt-8 text-[17px] font-bold leading-snug text-[#1d1d1f]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function BlogListPageView({ data }) {
  return (
    <div className="mt-[60px] bg-white font-sans text-[#1d1d1f]">
      <MomentsSection moments={data.moments} />
      <SelectionsSection selections={data.selections} posts={data.posts} />
      <ConfidenceSection confidence={data.confidence} />
    </div>
  );
}
