"use client";

import Image from "next/image";
import Copy from "@/components/Copy";

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image.replace(/^\/+/, "")}`;
}

export default function HomeConstellationSection({ section }) {
  if (!section) return null;

  const imageSrc = resolveImageSrc(section.image);
  const descriptionLines = String(section.description || "")
    .split(/\r?\n/)
    .filter(Boolean);

  return (
    <section className="flex h-[100svh] min-h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-white px-6 py-8 md:py-10">
      <div className="mx-auto flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-5 md:gap-6">
        <div className="w-full max-w-3xl shrink-0 text-center">
          {section.eyebrow ? (
            <Copy>
              <p className="mb-3 text-xs tracking-wide text-gray-500 md:text-sm">
                {section.eyebrow}
              </p>
            </Copy>
          ) : null}

          <Copy delay={0.08}>
            <h2 className="mb-4 text-2xl leading-[1.15] font-semibold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              {section.title}
            </h2>
          </Copy>

          {descriptionLines.length > 0 ? (
            <Copy delay={0.16}>
              <p className="mx-auto max-w-xl text-sm leading-relaxed font-normal text-gray-500 md:text-base">
                {descriptionLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {index > 0 ? (
                      <>
                        <br className="hidden sm:inline" />
                      </>
                    ) : null}
                    {line}
                  </span>
                ))}
              </p>
            </Copy>
          ) : null}

          {section.ctaLabel && section.ctaHref ? (
            <div className="mt-6 flex justify-center md:mt-7">
              <a
                href={section.ctaHref}
                className="group inline-flex items-center gap-2.5 rounded-full border border-gray-900/10 bg-white/55 px-7 py-3 text-sm font-medium tracking-wide text-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:border-gray-900/20 hover:bg-white/75 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] md:px-9 md:py-3.5"
              >
                {section.ctaLabel}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div className="relative flex min-h-0 w-full flex-1 items-end justify-center">
            <Image
              src={imageSrc}
              className="mx-auto h-full max-h-full w-full max-w-[900px] object-contain object-bottom"
              alt={section.imageAlt || section.title}
              placeholder="empty"
              loading="lazy"
              width={1920}
              height={1080}
              unoptimized={imageSrc.startsWith("http")}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
