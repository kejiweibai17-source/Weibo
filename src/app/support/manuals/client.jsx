"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { ArrowRight, Check, X, FileDown } from "lucide-react";
import {
  CARE_GUIDE_SECTIONS,
  CARE_DOS_DONTS,
  MANUAL_DOWNLOADS,
} from "@/data/supportContent";
import { POLICY_NAV_LINKS } from "@/data/policyContent";

const ICONS = {
  droplets: () => (
    <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 mx-auto mb-5">
      <path
        d="M16 4C16 4 8 13.5 8 19a8 8 0 0 0 16 0c0-5.5-8-15-8-15Z"
        fill="#00B4D8"
        fillOpacity=".18"
        stroke="#00B4D8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 20c0 2.2 1.8 4 4 4"
        stroke="#00B4D8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  sparkles: () => (
    <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 mx-auto mb-5">
      <path
        d="M16 4l2.5 7.5H26l-6.5 4.7 2.5 7.7L16 19.5l-6 4.4 2.5-7.7L6 11.5h7.5L16 4Z"
        fill="#00B4D8"
        fillOpacity=".18"
        stroke="#00B4D8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: () => (
    <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 mx-auto mb-5">
      <path
        d="M16 4l10 4v8c0 5.5-4.5 10-10 12C6 26 6 20.5 6 16V8l10-4Z"
        fill="#00B4D8"
        fillOpacity=".18"
        stroke="#00B4D8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11 16l3.5 3.5L21 12"
        stroke="#00B4D8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  box: () => (
    <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 mx-auto mb-5">
      <rect
        x="4"
        y="10"
        width="24"
        height="18"
        rx="2"
        fill="#00B4D8"
        fillOpacity=".18"
        stroke="#00B4D8"
        strokeWidth="1.6"
      />
      <path
        d="M4 16h24M12 10V7a4 4 0 0 1 8 0v3"
        stroke="#00B4D8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const SECTION_IMG = {
  "daily-clean": "/images/index/banner-02.png",
  "blade-care": "/images/index/banner-03.png",
  waterproof: "/images/index/banner-04.png",
  storage: "/images/index/banner-05.png",
};

export default function ManualsClient() {
  return (
    <div className="w-full font-sans antialiased overflow-x-hidden pt-[60px] lg:pt-[72px]">
      <section className="relative w-full bg-[#deeef8] overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-16  flex flex-col md:flex-row md:items-center gap-8">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <nav className="flex items-center gap-2 text-[12px] text-[#4a7c99] mb-6">
              <Link href="/" className="hover:text-[#00B4D8] transition-colors">
                首頁
              </Link>
              <span>/</span>
              <Link
                href="/support/faq"
                className="hover:text-[#00B4D8] transition-colors"
              >
                客戶支援
              </Link>
              <span>/</span>
              <span className="text-[#1a3c54]">使用與保養指南</span>
            </nav>

            <h1 className="text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] font-black text-[#0d2233] uppercase leading-[1.05] tracking-tight mb-5">
              SMASMALL
              <br />
              <span className="text-[#0d2233]">保養指南</span>
            </h1>
            <p className="text-[15px] md:text-[16px] text-[#2c5570] leading-relaxed max-w-lg mb-8 font-medium">
              正確的使用與保養習慣，讓全合金刮鬍刀保持最佳性能，陪伴您每一天的俐落儀容。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/accessories"
                className="inline-flex items-center gap-2 rounded-full bg-[#00B4D8] hover:bg-[#0096B4] text-white px-7 py-3 text-[14px] font-bold uppercase tracking-wide transition-colors shadow-md shadow-cyan-400/30"
              >
                前往產品/配件選購
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/support/warranty"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#0d2233]/25 text-[#0d2233] px-7 py-3 text-[14px] font-bold uppercase tracking-wide hover:border-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              >
                保固說明
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative flex-1   flex items-center justify-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div
              className="relative w-2/3 mx-auto sm:w-full max-w-[520px]  "
              style={{
                clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src="/images/b91b5cc9-729c-4ffe43576c1762-2.png"
                alt="SMASMALL 昔馬電動刮鬍刀使用示意"
                width={1000}
                height={1500}
                className="w-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#deeef8] via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        <span className="absolute top-10 left-[38%] w-2 h-2 rounded-full bg-[#00B4D8] opacity-70 hidden lg:block" />
        <span className="absolute bottom-14 left-[42%] w-1.5 h-1.5 rounded-full bg-[#f59e0b] opacity-80 hidden lg:block" />
      </section>

      <section className="w-full bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-[#0d2233] uppercase tracking-tight mb-16">
            詳細保養步驟
          </h2>

          <div className="space-y-20">
            {CARE_GUIDE_SECTIONS.map((section, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={section.id}
                  id={`section-${section.id}`}
                  className="scroll-mt-28 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  style={{ flexDirection: isEven ? "row" : "row-reverse" }}
                >
                  <div className="w-full lg:w-[45%] shrink-0 overflow-hidden aspect-[4/3] relative bg-[#edf5fb]">
                    <Image
                      src={SECTION_IMG[section.id]}
                      alt={section.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 600px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                      <span className="text-white text-[13px] font-semibold tracking-widest opacity-80">
                        0{idx + 1} / {CARE_GUIDE_SECTIONS.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="text-[11px] font-mono font-bold text-[#00B4D8] tracking-[0.2em] uppercase">
                      Step {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[1.5rem] md:text-[2rem] font-black text-[#0d2233] uppercase mt-2 mb-4 tracking-tight">
                      {section.title}
                    </h3>
                    <p className="text-[15px] text-[#4a7c99] leading-relaxed mb-6 font-medium">
                      {section.summary}
                    </p>
                    <ol className="space-y-3">
                      {section.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-4 items-start">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-[#00B4D8] text-white text-[11px] font-black flex items-center justify-center mt-0.5">
                            {stepIdx + 1}
                          </span>
                          <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <Image
          src="/images/index/banner-01.png"
          alt="SMASMALL 昔馬保養承諾"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-black text-white uppercase leading-tight tracking-tight">
              堅持品質
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>延長使用壽命
            </h2>
            <p className="mt-5 text-[15px] text-gray-300 max-w-xl mx-auto leading-relaxed font-light">
              每一支昔馬刮鬍刀，都值得被細心對待。良好的保養，是對品質最好的回應。
            </p>
          </motion.div>
        </div>
      </section>
      <section className="w-full bg-[#edf5fb] py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.h2
            className="text-[1.5rem] md:text-[2rem] font-black text-[#0d2233] uppercase tracking-tight mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            使用守則
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <motion.div
              className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h3 className="text-[15px] font-black text-[#00B4D8] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00B4D8] flex items-center justify-center">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
                建議做法
              </h3>
              <ul className="space-y-4">
                {CARE_DOS_DONTS.dos.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 items-start text-[14px] text-gray-700 leading-relaxed"
                  >
                    <Check
                      size={15}
                      className="shrink-0 text-[#00B4D8] mt-0.5"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h3 className="text-[15px] font-black text-[#e55] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#e55] flex items-center justify-center">
                  <X size={11} className="text-white" strokeWidth={3} />
                </span>
                請避免
              </h3>
              <ul className="space-y-4">
                {CARE_DOS_DONTS.donts.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 items-start text-[14px] text-gray-700 leading-relaxed"
                  >
                    <X
                      size={15}
                      className="shrink-0 text-[#e55] mt-0.5"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-[#0d2233] uppercase tracking-tight mb-1">
            SMASMALL 昔馬
          </h2>
          <p className="text-[1.5rem] md:text-[2rem] font-black text-[#00B4D8] uppercase tracking-tight mb-10">
            使用條款與政策
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {POLICY_NAV_LINKS.map((policy) => (
              <Link
                key={policy.id}
                href={policy.href}
                className="group block border-b border-gray-200 pb-5 hover:border-[#00B4D8] transition-colors"
              >
                <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#00B4D8] transition-colors mb-2">
                  {policy.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {policy.summary}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/support/policies"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#00B4D8] hover:text-[#0096B4] transition-colors"
          >
            查看完整條款與政策
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {MANUAL_DOWNLOADS.length > 0 && (
        <section className="w-full bg-[#edf5fb] py-12 md:py-16 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
            <h2 className="text-lg md:text-xl font-bold text-[#0d2233] mb-6">
              產品說明書下載
            </h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {MANUAL_DOWNLOADS.map((manual) => (
                <li key={manual.href}>
                  <a
                    href={manual.href}
                    download
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-800 hover:text-[#00B4D8] transition-colors"
                  >
                    <FileDown size={16} className="text-gray-400" />
                    {manual.title}
                    <span className="text-[12px] text-gray-400 font-normal">
                      PDF
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
