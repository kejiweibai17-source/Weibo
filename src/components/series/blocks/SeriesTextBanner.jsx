"use client";

import { motion } from "framer-motion";
import Copy from "@/components/Copy";

export default function SeriesTextBanner({
  backgroundColor = "#ea580c",
  heading,
  body,
}) {
  return (
    <section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-8 py-32 text-black shadow-[0_-10px_50px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor }}
    >
      <div className="max-w-3xl space-y-16 text-center">
        {heading ? (
          <Copy>
            <h2 className="text-xl md:text-2xl">{heading}</h2>
          </Copy>
        ) : null}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="font-mono text-sm leading-relaxed md:text-base">{body}</p>
        </motion.div>
      </div>
    </section>
  );
}
