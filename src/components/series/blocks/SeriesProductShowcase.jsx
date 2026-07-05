"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOX_STYLES = {
  top_left: {
    boxPos: "md:absolute md:top-[15%] md:left-[5%]",
    lineClass:
      "hidden md:block top-[50%] left-full w-[150px] h-[1px] origin-left rotate-[15deg]",
    dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  },
  bottom_left: {
    boxPos: "md:absolute md:bottom-[15%] md:left-[8%]",
    lineClass:
      "hidden md:block top-[20%] left-full w-[120px] h-[1px] origin-left rotate-[-20deg]",
    dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  },
  bottom_right: {
    boxPos: "md:absolute md:bottom-[20%] md:right-[10%]",
    lineClass:
      "hidden md:block top-[50%] right-full w-[160px] h-[1px] origin-right rotate-[15deg]",
    dotClass: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  top_right: {
    boxPos: "md:absolute md:top-[20%] md:left-[10%]",
    lineClass:
      "hidden md:block top-[50%] left-full w-[160px] h-[1px] origin-left rotate-[5deg]",
    dotClass: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  },
};

export default function SeriesProductShowcase({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!items?.length) return null;

  const currentProduct = items[activeIndex] || items[0];

  const handleDragEnd = (_event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (info.offset.x > swipeThreshold) {
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  return (
    <section className="relative flex h-auto w-full flex-col overflow-hidden bg-[#050507] pt-16 pb-[150px] font-sans">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-start justify-center pt-[13vh]">
        <div className="absolute h-[400px] w-[80%] max-w-[1200px] rounded-[100%] bg-[#ea580c] opacity-[0.15] blur-[120px]" />
        <div className="absolute mt-[50px] h-[200px] w-[50%] max-w-[600px] rounded-[100%] bg-white opacity-[0.08] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto mb-8 min-h-[400px] w-full max-w-[1400px] px-4 md:mb-12 md:h-[650px] md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="relative inset-0 flex h-full w-full cursor-grab touch-pan-y flex-col items-center justify-center active:cursor-grabbing md:absolute"
          >
            <div className="pointer-events-none relative z-10 mb-4 flex h-[280px] w-full shrink-0 items-center justify-center md:mb-0 md:h-[90%] md:w-[60%]">
              <img
                src={currentProduct.mainUrl}
                alt={currentProduct.name}
                className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="pointer-events-none mb-6 flex items-center justify-center gap-2 md:hidden">
              {items.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === dotIdx ? "w-4 bg-[#ea580c]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <div className="pointer-events-none relative z-20 flex w-full flex-col gap-4 md:pointer-events-auto md:absolute md:inset-0">
              {currentProduct.features?.map((feature, idx) => {
                const style = BOX_STYLES[feature.boxPosition || "top_left"];
                return (
                  <div
                    key={idx}
                    className={`${style.boxPos} relative w-full rounded-xl border border-white/5 bg-[#18181b]/60 p-4 shadow-lg backdrop-blur-md md:absolute md:w-[280px] md:border-white/10 md:bg-[#18181b]/80 md:p-5 md:shadow-2xl`}
                  >
                    <h3 className="mb-2 text-[14px] leading-tight font-bold text-white md:mb-3 md:text-[15px]">
                      {feature.title}
                    </h3>
                    <ul className="space-y-1.5 pl-3 text-[12px] leading-relaxed text-[#a1a1aa] md:text-[13px]">
                      {feature.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="relative">
                          <span className="absolute top-[7px] left-[-12px] h-[3px] w-[3px] rounded-full bg-gray-500" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {style.lineClass ? (
                      <div
                        className={`absolute bg-white/30 pointer-events-none ${style.lineClass}`}
                      >
                        <div
                          className={`absolute h-[5px] w-[5px] rounded-full bg-[#ea580c] shadow-[0_0_8px_rgba(234,88,12,0.8)] ${style.dotClass}`}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="custom-scrollbar relative z-10 mx-auto mt-4 w-full max-w-[1600px] overflow-x-auto px-6 pb-8 md:mt-0">
        <div className="mx-auto flex min-w-max gap-4 md:justify-center">
          {items.map((product, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={`${product.name}-${index}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`group relative flex w-[180px] flex-shrink-0 cursor-pointer flex-col rounded-xl p-3 transition-all duration-300 ease-out md:w-[220px] md:p-4 ${
                  isActive ? "bg-[#1f1f22]" : "bg-[#131315] hover:bg-[#1a1a1d]"
                }`}
                style={{
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className={`absolute top-0 left-0 h-[3px] w-full rounded-t-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#ea580c] shadow-[0_0_12px_rgba(234,88,12,0.8)]"
                      : "bg-transparent"
                  }`}
                />
                <div className="mb-3 w-fit rounded border border-[#ea580c]/20 bg-[#27272a] px-2 py-1 text-[10px] font-bold text-[#ea580c]">
                  {product.badge}
                </div>
                <div className="mb-3 flex h-[100px] w-full items-center justify-center p-2 md:h-[120px]">
                  <img
                    src={product.thumbUrl}
                    alt={product.name}
                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="mb-3 line-clamp-2 text-[12px] leading-snug font-medium text-white md:text-[14px]">
                  {product.name}
                </h4>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {product.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  );
}
