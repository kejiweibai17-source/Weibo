"use client";

import useEmblaCarousel from "embla-carousel-react";
import { MoveLeft, MoveRight } from "lucide-react";
import Copy from "@/components/Copy";

export default function SeriesTimelineCarousel({
  sectionEyebrow = "FEATURES",
  sectionTitle = "",
  sectionTitleBold = "",
  items,
}) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  if (!items?.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] py-24 font-sans">
      <div className="mx-auto mb-16 max-w-[1600px] px-6 lg:px-10">
        <Copy>
          <span className="mb-4 block text-[11px] font-bold tracking-widest text-[#EA580C] uppercase">
            {sectionEyebrow}
          </span>
        </Copy>
        <Copy>
          <h2 className="text-3xl font-light tracking-wide text-black md:text-4xl">
            {sectionTitle}
            {sectionTitleBold ? (
              <span className="font-bold">{sectionTitleBold}</span>
            ) : null}
          </h2>
        </Copy>
      </div>

      <div className="embla w-full cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
        <div className="embla__container relative flex">
          <div className="pointer-events-none absolute bottom-[30px] left-0 z-0 h-[30px] w-full">
            <div className="absolute top-0 h-[1px] w-full bg-[#d2d2d2]" />
            <div
              className="absolute bottom-0 h-[10px] w-full opacity-[0.35]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #000 0, #000 1.5px, transparent 1.5px, transparent 24px)",
              }}
            />
          </div>

          {items.map((item, index) => (
            <div
              key={`${item.number}-${index}`}
              className="embla__slide relative min-w-0 flex-[0_0_85vw] pb-[100px] md:flex-[0_0_420px] lg:flex-[0_0_480px]"
            >
              <div className="absolute top-[14px] bottom-[60px] left-[30px] z-0 w-[1px] bg-gray-300" />
              <div className="absolute top-[10px] left-[26.5px] z-10 h-[8px] w-[8px] bg-[#EA580C]" />
              <div className="absolute bottom-[56.5px] left-[26.5px] z-10 h-[8px] w-[8px] bg-black" />

              <div className="flex h-full flex-col pt-[6px] pr-[40px] pl-[60px]">
                {item.number ? (
                  <p className="mb-3 text-xs font-bold tracking-widest text-gray-500">
                    {item.number}
                  </p>
                ) : null}
                <h4 className="mb-4 text-[19px] leading-snug font-bold text-black">
                  {item.title}
                </h4>
                {item.description ? (
                  <p className="mb-8 text-[14px] leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                ) : null}
                <div className="mt-auto w-full max-w-[95%] overflow-hidden rounded bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-auto w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="embla__slide relative min-w-0 flex-[0_0_20vw] md:flex-[0_0_200px]" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[35px] left-[8vw] z-20 flex translate-y-1/2 items-center justify-center gap-[2px] rounded-full bg-[#EA580C] px-3 py-1.5 shadow-md md:left-[12vw]">
        <MoveLeft size={16} strokeWidth={2.5} color="black" />
        <MoveRight size={16} strokeWidth={2.5} color="black" />
      </div>
    </section>
  );
}
