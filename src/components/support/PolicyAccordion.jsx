"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PolicyAccordion({ sections = [], defaultOpenId = null }) {
  const [openId, setOpenId] = useState(defaultOpenId);

  const openByHash = () => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.some((s) => s.id === hash)) {
      setOpenId(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  useEffect(() => {
    openByHash();
    window.addEventListener("hashchange", openByHash);
    return () => window.removeEventListener("hashchange", openByHash);
  }, [sections]);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  if (!sections.length) return null;

  return (
    <div className="border-t border-gray-300">
      {sections.map((section) => {
        const isOpen = openId === section.id;

        return (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-28 border-b border-gray-300"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`policy-body-${section.id}`}
              onClick={() => toggle(section.id)}
              className="w-full py-5 md:py-6 flex items-center justify-between gap-6 text-left group"
            >
              <span>
                <span className="block text-[15px] md:text-base font-medium text-gray-900 group-hover:text-black transition-colors">
                  {section.title}
                </span>
                {section.summary && (
                  <span className="block mt-1 text-[13px] text-gray-500 font-normal">
                    {section.summary}
                  </span>
                )}
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
                  id={`policy-body-${section.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 md:pb-8 space-y-4 max-w-3xl">
                    {section.paragraphs.map((para, idx) => (
                      <p
                        key={idx}
                        className="text-[14px] md:text-[15px] text-gray-600 leading-[1.75]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
