"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Anker 風格 FAQ 手風琴：置中標題、細線分隔、右側 chevron
 */
export default function FaqAccordion({
  items = [],
  title = "常見問題",
  defaultOpenIndex = null,
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  if (!items.length) return null;

  return (
    <section className="w-full" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-center text-2xl md:text-[2rem] font-bold text-gray-900 tracking-tight mb-10 md:mb-14"
      >
        {title}
      </h2>

      <div className="border-t border-gray-300">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          const itemId = `faq-item-${index}`;

          return (
            <div key={itemId} className="border-b border-gray-300">
              <button
                type="button"
                id={`faq-q-${itemId}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${itemId}`}
                onClick={() => toggle(index)}
                className="w-full py-5 md:py-6 flex items-center justify-between gap-6 text-left group"
              >
                <span className="text-[15px] md:text-base font-medium text-gray-900 leading-snug pr-4 group-hover:text-black transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  strokeWidth={1.5}
                  className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${itemId}`}
                    role="region"
                    aria-labelledby={`faq-q-${itemId}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 md:pb-6 text-[14px] md:text-[15px] text-gray-600 leading-[1.75] max-w-3xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
