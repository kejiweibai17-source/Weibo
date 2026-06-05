"use client";

import { Link } from "next-view-transitions";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { SEO_CONFIG } from "@/lib/seo/config";

export default function SupportCta() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#050505] px-8 py-12 md:px-14 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,180,216,0.2)_0%,transparent_55%)]" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8] mb-3">
            Need Help?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            還有其他問題？
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-lg">
            威柏科技客服團隊週一至週五 09:00–18:00 為您服務，歡迎來電、Email 或透過
            LINE 官方帳號聯繫。
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 text-[14px] text-gray-300">
            <a
              href={`tel:${SEO_CONFIG.organization.telephone}`}
              className="inline-flex items-center gap-2 hover:text-[#00B4D8] transition-colors"
            >
              <Phone size={15} />
              {SEO_CONFIG.organization.telephone}
            </a>
            <a
              href={`mailto:${SEO_CONFIG.organization.email}`}
              className="inline-flex items-center gap-2 hover:text-[#00B4D8] transition-colors"
            >
              <Mail size={15} />
              {SEO_CONFIG.organization.email}
            </a>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#00B4D8] hover:bg-[#0096B4] text-white px-8 py-3.5 text-[15px] font-semibold transition-colors shadow-lg shadow-cyan-500/20"
        >
          聯絡我們
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
