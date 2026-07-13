"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import "./wp-content.css";

const ACTION_BLUE = "#0071e3";

function PillButton({ href, children, variant = "primary" }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-[14px] font-medium transition-opacity hover:opacity-85";
  const styles =
    variant === "primary"
      ? { backgroundColor: ACTION_BLUE, color: "#fff" }
      : {
          backgroundColor: "rgba(255,255,255,0.2)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
        };

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        style={styles}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={base} style={styles}>
      {children}
    </Link>
  );
}

function StickyBar({ data, title }) {
  return (
    <div className="sticky top-[60px] z-40 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#1d1d1f] md:text-[15px]">
          <span className="text-[#6e6e73]">{data.category}</span>
          <span className="mx-2 text-[#d2d2d7]">|</span>
          <span>{title || data.productLine}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3 md:gap-5">
          <span className="hidden text-[12px] text-[#6e6e73] sm:inline md:text-[13px]">
            {data.priceLabel}
          </span>
          <Link
            href={data.ctaHref}
            className="rounded-full px-4 py-1.5 text-[13px] font-medium text-white md:px-5 md:py-2 md:text-[14px]"
            style={{ backgroundColor: ACTION_BLUE }}
          >
            {data.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

/** 從文章 HTML 內容抓取圖片 URL（給縮圖列用） */
function extractImages(html, limit = 6) {
  if (!html) return [];
  const urls = [];
  const seen = new Set();
  const re = /<img[^>]+src="([^">]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].split("?")[0];
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(m[1]);
    }
    if (urls.length >= limit) break;
  }
  return urls;
}

function ProductGallery({ images, title }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const activeImage = images[index] || images[0];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] md:rounded-[28px]">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {total > 1 && (
          <>
            {/* 頁數計數 */}
            <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
              {index + 1} / {total}
            </div>

            {/* 左右切換箭頭 */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="上一張"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-md transition-all hover:bg-white hover:scale-105"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="m15 18-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="下一張"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-md transition-all hover:bg-white hover:scale-105"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => {
            const isActive = i === index;
            return (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`檢視圖片 ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors md:h-[72px] md:w-[72px] ${
                  isActive
                    ? "border-[#0071e3]"
                    : "border-transparent hover:border-[#d2d2d7]"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="72px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductHeroSection({ hero, stickyBar, bodyHtml, title }) {
  const gallery = [hero.image, ...extractImages(bodyHtml)].filter(Boolean);
  const uniqueGallery = Array.from(new Set(gallery)).slice(0, 8);

  const badges = ["全館免運", "原廠 12 個月保固", "7 天鑑賞期"];

  return (
    <section className="bg-white px-5 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* 左：圖庫 */}
        <ProductGallery images={uniqueGallery} title={title || hero.title} />

        {/* 右：資訊欄 */}
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <p className="text-[13px] font-medium text-[#6e6e73]">
            {stickyBar.productLine}
          </p>
          <h1
            className="mt-2 text-[26px] font-bold leading-tight text-[#1d1d1f] md:text-[32px]"
            data-seo-speakable
          >
            {title || hero.title}
          </h1>
          <p
            className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]"
            data-seo-speakable
          >
            {hero.description}
          </p>

          <p className="mt-6 text-[22px] font-semibold text-[#1d1d1f] md:text-[26px]">
            {stickyBar.priceLabel}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[14px] text-[#6e6e73]">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[#34c759]"
              aria-hidden
            />
            現貨供應・快速出貨
          </div>

          <Link
            href={stickyBar.ctaHref}
            className="mt-6 flex w-full items-center justify-center rounded-full px-6 py-3.5 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACTION_BLUE }}
          >
            {stickyBar.ctaLabel}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#6e6e73]">
            {badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M20 6 9 17l-5-5"
                    stroke="#34c759"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </span>
            ))}
          </div>

          {hero.footnote && (
            <div className="mt-8 border-t border-[#d2d2d7] pt-6">
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">
                購買前須知
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">
                {hero.footnote}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DuoCardsSection({ cards }) {
  return (
    <section className="bg-white px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="relative aspect-[4/4] overflow-hidden rounded-[28px] md:aspect-[4/4] md:rounded-[32px]"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <h3 className="text-[28px] font-bold text-white md:text-[36px]">
                {card.title}
              </h3>
              {card.subtitle && (
                <p className="mt-2 max-w-[360px] text-[14px] leading-relaxed text-white/85 md:text-[15px]">
                  {card.subtitle}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <PillButton href={card.primaryCta.href}>
                  {card.primaryCta.label}
                </PillButton>
                {card.secondaryCta && (
                  <PillButton href={card.secondaryCta.href} variant="secondary">
                    {card.secondaryCta.label}
                  </PillButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrioFeaturesSection({ features }) {
  return (
    <section className="bg-white px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
        {features.map((item) => (
          <article key={item.title}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#f5f5f7] md:rounded-[28px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-5 text-[21px] font-bold text-[#1d1d1f] md:text-[24px]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73] md:text-[17px]">
              {item.description}
              {item.link && (
                <>
                  {" "}
                  <Link
                    href={item.link.href}
                    className="text-[#0071e3] hover:underline"
                  >
                    {item.link.label}
                  </Link>
                </>
              )}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ faq }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[980px]">
        <h2 className="text-[32px] font-bold text-[#1d1d1f] md:text-[40px]">
          {faq.title}
        </h2>
        <div className="mt-10 border-t border-[#d2d2d7]">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-[#d2d2d7]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left md:py-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-[17px] font-semibold text-[#1d1d1f] md:text-[19px]">
                    {item.question}
                  </span>
                  <span className="mt-1 shrink-0 text-[22px] font-light text-[#6e6e73]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-6 pr-10 text-[15px] leading-relaxed text-[#6e6e73] md:text-[17px]">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ newsletter }) {
  const [email, setEmail] = useState("");

  return (
    <section className="border-t border-[#d2d2d7] bg-white px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16">
        <h2 className="text-[19px] font-semibold text-[#6e6e73] md:text-[21px]">
          {newsletter.title}
        </h2>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletter.placeholder}
              className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-[15px] text-[#1d1d1f] outline-none focus:border-[#0071e3]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full border border-[#d2d2d7] px-6 py-3 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              {newsletter.buttonLabel}
            </button>
          </form>
          <p className="mt-4 text-[12px] leading-relaxed text-[#86868b]">
            {newsletter.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

function RelatedArticlesSidebar({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="min-w-0 lg:sticky lg:top-[88px] lg:self-start">
      <h2 className="text-[15px] font-semibold tracking-wide text-[#1d1d1f]">
        其他文章
      </h2>
      <div className="mt-5 flex flex-col gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${encodeURIComponent(post.slug)}`}
            className="group flex min-w-0 gap-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7]">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="64px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="line-clamp-3 break-words text-[14px] font-medium leading-snug text-[#1d1d1f] group-hover:text-[#0071e3]">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-block text-[13px] font-medium text-[#0071e3] hover:underline"
      >
        查看全部文章 →
      </Link>
    </aside>
  );
}

function WpBodySection({ html, relatedPosts }) {
  if (!html) return null;

  return (
    <section className="overflow-x-clip bg-white px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
        <div
          className="wp-content min-w-0 max-w-full overflow-x-clip"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <RelatedArticlesSidebar posts={relatedPosts} />
      </div>
    </section>
  );
}

export default function ArticlePageView({ data, relatedPosts = [] }) {
  const displayTitle = data.wpTitle || data.hero.title;

  return (
    <article className="overflow-x-clip bg-white font-sans text-[#1d1d1f]">
      <StickyBar data={data.stickyBar} title={displayTitle} />
      <ProductHeroSection
        hero={data.hero}
        stickyBar={data.stickyBar}
        bodyHtml={data.wpBodyHtml}
        title={displayTitle}
      />

      <WpBodySection html={data.wpBodyHtml} relatedPosts={relatedPosts} />
      <FaqSection faq={data.faq} />
      <NewsletterSection newsletter={data.newsletter} />
      <TrioFeaturesSection features={data.trioFeatures} />
      <DuoCardsSection cards={data.duoCards} />
      <div className="flex justify-center border-t border-[#d2d2d7] bg-white py-12">
        <Link
          href="/blog"
          className="text-[13px] tracking-wide text-[#0071e3] hover:underline"
        >
          ← 返回理容知識專欄
        </Link>
      </div>
    </article>
  );
}
