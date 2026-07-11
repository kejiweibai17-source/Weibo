"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WaabiScrollIntro from "@/components/WaabiScrollIntro";
import { Globe, ArrowRight } from "lucide-react";
import Copy from "@/components/Copy";

gsap.registerPlugin(ScrollTrigger);

const LINE_OFFICIAL_URL =
  "https://page.line.me/157yqtwl?oat_content=url&openQrModal=true";

const BRAND_HERO_IMAGE = "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png";

// ============================================================================
// 昔馬 SMASMALL 真實產品系列資料設定 (全繁體中文在地化)
// ============================================================================
const CORE_STATS = [
  { end: 100, suffix: "%", decimals: 0, label: "全合金壓鑄機身" },
  { end: 1, suffix: " 秒", decimals: 0, label: "磁吸刀頭快拆" },
  { display: "IPX7", label: "全機防水乾濕兩用" },
  { end: 0.05, suffix: "mm", decimals: 2, label: "德國進口精鋼刀網" },
  { end: 12, suffix: " 個月", decimals: 0, label: "台灣總代理原廠保固" },
];

function formatStatValue(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

function BrandRevealImage({
  src = BRAND_HERO_IMAGE,
  alt = "昔馬 SMASMALL 全合金電動刮鬍刀 品牌形象 威柏科技台灣總代理",
  origin = "left",
  tall = false,
}: {
  src?: string;
  alt?: string;
  origin?: "left" | "right";
  tall?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!wrapRef.current || !revealRef.current) return;

      // 容器尺寸固定，只做 clip-path 展開，避免擠動左側文字
      const fromClip =
        origin === "right"
          ? "inset(0 0% 0 100%)" // 從右往左展開
          : "inset(0 100% 0 0%)"; // 從左往右展開
      const toClip = "inset(0 0% 0 0%)";

      gsap.set(revealRef.current, { clipPath: fromClip });

      gsap.to(revealRef.current, {
        clipPath: toClip,
        duration: 1.35,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: wrapRef, dependencies: [origin, src] },
  );

  return (
    <div
      ref={wrapRef}
      className={`relative max-w-full overflow-hidden rounded-lg shadow-sm ${
        tall
          ? "w-full max-w-[420px] md:max-w-[480px] aspect-[3/4]"
          : "lg:col-span-7 w-full h-[400px] md:h-[500px]"
      } ${origin === "right" ? "ml-auto" : ""}`}
    >
      <div
        ref={revealRef}
        className="absolute inset-0 h-full w-full will-change-[clip-path]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          quality={100}
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}

function AnimatedStatValue({
  stat,
  index,
}: {
  stat: (typeof CORE_STATS)[number];
  index: number;
}) {
  const valueRef = useRef<HTMLDivElement>(null);
  const initialText =
    stat.display ??
    `${formatStatValue(0, stat.decimals ?? 0)}${stat.suffix ?? ""}`;
  const [text, setText] = useState(initialText);

  useGSAP(
    () => {
      if (!valueRef.current) return;

      if (stat.display) {
        gsap.fromTo(
          valueRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valueRef.current,
              start: "top 88%",
              once: true,
            },
          },
        );
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value: stat.end ?? 0,
        duration: 1.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: valueRef.current,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          setText(
            `${formatStatValue(counter.value, stat.decimals ?? 0)}${stat.suffix ?? ""}`,
          );
        },
      });
    },
    { scope: valueRef, dependencies: [stat, index] },
  );

  return (
    <div
      ref={valueRef}
      className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1 tabular-nums"
    >
      {stat.display ?? text}
    </div>
  );
}

function BrandCoreStats() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-8">
      {CORE_STATS.map((stat, idx) => (
        <div key={stat.label} className={idx === 4 ? "col-span-2" : ""}>
          <AnimatedStatValue stat={stat} index={idx} />
          <div className="text-xs md:text-sm text-gray-500 font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
const PRODUCT_CATEGORIES = [
  {
    categoryTitle: "Premium Alloy Series",
    categorySubtitle: "經典合金系列",
    products: [
      {
        name: "昔馬 S1 經典青春版",
        slogan: "重塑經典，品味隨行。",
        description:
          "採用獨創高溫壓鑄全合金機身，手感沉穩冰冷。搭載德國進口精鋼刀片與雙環超薄刀網，配合自研磨技術，越用越鋒利。支援 IPX7 全機防水，乾濕兩用，讓您隨時保持俐落清爽的面貌。",
        imgUrl: "/images/accessories/青春版電動刮鬍刀禮盒-三色/情境圖/004.jpg", // 替換為 S1 產品圖
        reverse: false, // 圖片在左
      },
      {
        name: "昔馬捍衛者",
        slogan: "小。很強大。",
        description:
          "把刮鬍、修容、收納與快充，放進精巧而有份量的全合金設計。磁吸式快拆刀頭、德國進口精鋼刀網與 IPX7 全機防水，兼顧硬派質感與日常便利。",
        imgUrl: "/images/61e0b64e-1f2c-465c-91e6-34dde2596b4e.png",
        reverse: true, // 圖片在右
      },
      {
        name: "昔馬 S1-DK 黑夜騎士",
        slogan: "深邃暗黑，硬派美學。",
        description:
          "延續 S1 經典架構，披上極致深邃的消光黑夜塗裝。專為低調且注重質感的都會男士設計，每一處細節都散發著復古未來主義的獨特魅力，是展現個人風格的最佳桌面理容藝術品。",
        imgUrl: "/images/index/banner-02.png", // 替換為黑夜騎士版產品圖
        reverse: false, // 圖片在左
      },
    ],
  },
  {
    categoryTitle: "Exclusive Gift Sets",
    categorySubtitle: "尊榮限定禮盒",
    products: [
      {
        name: "昔馬 x 威柏 尊榮理容套裝",
        slogan: "送禮首選，極致尊榮。",
        description:
          "專為高階商務人士與節日送禮打造的頂級套裝。內含昔馬合金電動刮鬍刀、專屬訂製皮革防撞收納包，以及高質感清潔配件。威柏科技總代理品質承諾，提供最完善的一年原廠保固。",
        imgUrl: "/images/index/banner-05.png",
        reverse: false,
      },
    ],
  },
];

export default function SmasmallCollections() {
  return (
    <div className="w-full bg-[#f8f9fb] text-slate-900 font-sans selection:bg-blue-200 antialiased">
      <WaabiScrollIntro />

      {/* ===== 我們堅持做好這三件事 ===== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <Copy>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 tracking-tight">
            我們堅持做好這三件事
          </h2>
        </Copy>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              en: "Quality",
              label: "品質",
              desc: "從材料、配方到製程，每一個細節都朝著用心把關。",
              img: "/images/2.0刀頭/去背.webp",
            },
            {
              en: "Design",
              label: "設計",
              desc: "以積極的美學結合實用機能，打造符合現代生活的產品。",
              img: "/images/3.0刀頭/1.webp",
            },
            {
              en: "Experience",
              label: "體驗",
              desc: "讓每一次使用感受，讓日常護理成為生活中的美好儀式。",
              img: "/images/a547d145-6bc1-4dd4-9653-81ee1945b2b8.png",
            },
          ].map((item) => (
            <div
              key={item.en}
              className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-10 group cursor-pointer shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${item.img}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="relative z-10 text-white">
                <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/60 mb-2">
                  {item.en}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  {item.label}
                </h3>
                <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto bg-[#f5f5f7]">
        {/* 頂部橫向大標題 */}
        <div className="max-w-4xl mb-16">
          <Copy>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              專注全合金電動刮鬍刀的
              <br />
              精品理容品牌
            </h2>
          </Copy>
          <Copy>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed tracking-wide">
              昔馬 SMASMALL 以全合金機身、磁吸刀頭與 IPX7 防水，
              <br />
              為注重質感與效率的男士，打造值得日常使用的理容器材。
            </p>
          </Copy>
        </div>

        {/* 下方左右內容：左側形象大圖，右側數據與敘述 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <BrandRevealImage />

          {/* 右側文字與數據面板 */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <Copy>
              {" "}
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-12">
                昔馬 SMASMALL
                由台灣總代理威柏科技原廠授權引進。我們相信電動刮鬍刀不只是消耗品，更是展現個人品味的日常配件——拋棄廉價塑膠機身，以重機與航空工業啟發的壓鑄合金，帶來更沉穩、更耐用的刮鬍體驗。
              </p>
            </Copy>

            <BrandCoreStats />
          </div>
        </div>
      </section>

      {/* ===== 品牌承諾 ===== */}
      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Copy>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                威柏科技有限公司
              </h2>
            </Copy>
            <Copy>
              <p className="text-stone-900 text-[15px] md:text-[16px] leading-relaxed">
                威柏科技有限公司為昔馬 SMASMALL
                台灣唯一官方授權總代理，負責原廠正品引進、通路管理與售後保固。透過線上商城與授權通路，提供產品諮詢、保固登錄與維修協助，讓用戶享有完整的購買與使用支援。
              </p>
            </Copy>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex lg:justify-end">
            <BrandRevealImage
              src="/images/专利.jpg"
              alt="昔馬 SMASMALL 品牌承諾"
              origin="right"
              tall
            />
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: Brand Banner & Headquarters (參照 截圖 2.57.47 & 2.57.54)
          ==================================================================== */}
      <section className="w-full bg-white py-24 border-t border-b border-gray-200/60">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-16">
          {/* Part A: 昔馬品牌旗艦視覺牆 */}
          <div className="mb-20">
            <Copy>
              {" "}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                昔馬 SMASMALL
              </h3>
            </Copy>
            <Copy>
              {" "}
              <p className="text-stone-900 text-[16px] max-w-4xl leading-relaxed mb-8">
                專注於全合金機身與磁吸快拆刀頭，結合德國進口精鋼刀網與 Type-C
                快充，讓居家、差旅與商務場合都能輕鬆完成刮鬍。威柏科技於台灣提供原廠授權銷售與售後服務，讓每位用戶買得安心、用得長久。
              </p>
            </Copy>

            <a
              href="/brand"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:underline"
            >
              <span>探索昔馬全系列產品</span>
              <ArrowRight size={14} />
            </a>
            {/* 品牌巨幅卡片 */}
            <div className="w-full h-[220px] md:h-[320px] bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 rounded-lg mt-8 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
              <div className="text-center z-10 text-white">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em]">
                  昔馬 SMASMALL
                </h2>
                <p className="text-[11px] tracking-[0.4em] opacity-60 mt-3">
                  威柏科技台灣總代理
                </p>
              </div>
            </div>
          </div>

          {/* Part B: 總代理威柏科技營運與現代化大樓 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-gray-100">
            <div className="lg:col-span-5">
              <Copy>
                {" "}
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                  品牌承諾
                </h4>
              </Copy>
              <Copy>
                {" "}
                <p className="text-stone-900 text-[16px] leading-relaxed">
                  每一件產品，都承載著我們對品質的堅持。 <br></br>
                  每一次使用，都源於我們對生活細節的重視。 因為我們相信，
                </p>
              </Copy>
            </div>
            {/* 右側：宏偉的代理商現代化總部/工藝基地大樓 */}
            <div className="lg:col-span-7 h-[300px] md:h-[420px] relative rounded-lg overflow-hidden shadow-sm bg-gray-100">
              <div className="absolute inset-0 bg-[url('/images/2863f91d-4ff8-45c9-9c4c-f9a80a210e2d.png')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* <section className="w-full py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        {PRODUCT_CATEGORIES.map((category, catIdx) => (
          <div key={catIdx} className="mb-24 last:mb-0">
           
            <div className="mb-12 border-b border-gray-200 pb-4">
              <p className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2">
                {category.categoryTitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {category.categorySubtitle}
              </h2>
            </div>

         
            <div className="flex flex-col gap-12 md:gap-16">
              {category.products.map((product, prodIdx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  key={prodIdx}
                  className={`flex flex-col ${product.reverse ? "md:flex-row-reverse" : "md:flex-row"} w-full bg-white border-gray-200 transition-shadow duration-500  overflow-hidden border border-gray-100 group`}
                >
               
                  <div className="w-full md:w-[55%] relative h-[300px] md:h-[450px] bg-[#f0f0f2] overflow-hidden">
                    <Image
                      src={product.imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>

                
                  <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                      {product.name}
                    </h3>

                    <div className="mb-10">
                      <p className="font-bold text-blue-600 text-sm md:text-base mb-4 tracking-wide">
                        {product.slogan}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                  
                    <div>
                      <a
                        href={LINE_OFFICIAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-full"
                      >
                        進一步了解
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section> */}
    </div>
  );
}
