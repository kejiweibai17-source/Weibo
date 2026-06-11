"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

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
        <p className="truncate text-[13px] font-medium text-[#1d1d1f] md:text-[15px]">
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

function HeroSection({ hero }) {
  return (
    <section className="relative h-[min(100vh,900px)] w-full overflow-hidden bg-[#111]">
      <Image
        src={hero.image}
        alt={hero.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1200px] px-5 pb-16 pt-24 md:px-8 md:pb-24">
        <h1 className="max-w-[640px] text-[32px] font-bold leading-tight text-white md:text-[48px] lg:text-[56px]">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-white/90 md:text-[19px]">
          {hero.description}
        </p>
        {hero.footnote && (
          <p className="mt-6 text-[12px] text-white/60 md:text-[13px]">
            {hero.footnote}
          </p>
        )}
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

function WpBodySection({ html }) {
  if (!html) return null;

  return (
    <section className="bg-white px-5 py-16 md:px-8">
      <div
        className="prose prose-base mx-auto max-w-[800px] prose-headings:text-[#1d1d1f] prose-p:text-[#333] prose-a:text-[#0071e3]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

export default function ArticlePageView({ data }) {
  const displayTitle = data.wpTitle || data.hero.title;

  return (
    <article className="bg-white font-sans text-[#1d1d1f]">
      <StickyBar data={data.stickyBar} title={displayTitle} />
      <HeroSection hero={data.hero} />

      <WpBodySection html={data.wpBodyHtml} />
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
