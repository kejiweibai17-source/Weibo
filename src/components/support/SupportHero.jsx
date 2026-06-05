"use client";

import { motion } from "framer-motion";
import { Link } from "next-view-transitions";

export default function SupportHero({
  eyebrow = "Support",
  title,
  subtitle,
  breadcrumbs = [],
}) {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] pt-[60px] lg:pt-[72px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,180,216,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,180,216,0.08)_0%,transparent_40%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00B4D8]/40 to-transparent" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-16 py-16 md:py-24">
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-[12px] text-gray-500"
          >
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-600">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-gray-300">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#00B4D8] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00B4D8] mb-4"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.1] max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl font-light"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
