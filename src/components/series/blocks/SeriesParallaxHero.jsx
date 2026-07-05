"use client";

import { motion } from "framer-motion";
import Copy from "@/components/Copy";

export default function SeriesParallaxHero({
  title,
  subtitle,
  backgroundImage,
}) {
  return (
    <div className="sticky top-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 text-center text-[33px] leading-none font-bold tracking-tighter text-white drop-shadow-lg xl:text-[4rem]"
      >
        {title}
      </motion.h1>
      {subtitle ? (
        <Copy>
          <p className="z-10 mt-6 max-w-sm text-center text-sm text-gray-400 drop-shadow-md">
            {subtitle}
          </p>
        </Copy>
      ) : null}
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
    </div>
  );
}
